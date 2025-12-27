import { GoogleGenAI, Modality } from "@google/genai";

// Funções de decodificação manuais conforme as diretrizes da API Gemini
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // A API Gemini retorna raw PCM 16-bit
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normaliza para o intervalo [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Singleton do AudioContext para evitar o erro "too many audio contexts"
let audioCtx: AudioContext | null = null;

export async function speak(text: string, isRetry = false): Promise<void> {
  const cleanText = text?.trim().replace(/[*_#]/g, '');
  if (!cleanText) return;

  try {
    // 1. Inicializa o AudioContext apenas na primeira interação do usuário
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // 2. OBRIGATÓRIO: Retomar o contexto (necessário para browsers em produção)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 3. Instancia o SDK (usamos o process.env.API_KEY injetado)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 4. Solicitação de TTS
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.error("Nenhum dado de áudio recebido da API.");
      return;
    }

    // 5. Reprodução do Áudio
    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error("Erro no Sistema TTS:", error);

    // Tratamento de Erro 500 (Instabilidade do Servidor)
    const isInternalError = error.message?.includes("500") || error.message?.includes("INTERNAL");
    
    if (isInternalError && !isRetry) {
      console.warn("Servidor Gemini instável. Tentando reconexão...");
      // Espera 1.5s antes de tentar novamente (Exponential backoff simples)
      await new Promise(r => setTimeout(r, 1500));
      return speak(text, true);
    }
    
    // Alerta amigável para o usuário em caso de erro persistente
    if (isRetry) {
      alert("O serviço de áudio do Google está temporariamente instável. Por favor, tente novamente em alguns instantes.");
    }
  }
}