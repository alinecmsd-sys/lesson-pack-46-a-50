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

// Singleton do AudioContext
let audioCtx: AudioContext | null = null;

export async function speak(text: string, retryCount = 0): Promise<void> {
  // Limpeza profunda do texto para evitar erros de processamento no modelo preview
  const cleanText = text?.trim()
    .replace(/[*_#]/g, '') // Remove markdown
    .replace(/[\[\]()]/g, '') // Remove parênteses
    .replace(/\s+/g, ' '); // Normaliza espaços
    
  if (!cleanText) return;

  try {
    // 1. Inicializa ou recupera o AudioContext
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // 2. Essencial para produção: Retomar o contexto em cada clique do usuário
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 3. Cria uma nova instância para garantir o uso da API Key mais recente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 4. Solicitação de TTS (Velocidade 1x é o padrão da voz Kore)
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
      throw new Error("EMPTY_AUDIO_RESPONSE");
    }

    // 5. Reprodução
    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error(`Erro TTS (Tentativa ${retryCount + 1}):`, error);

    // Lógica de Retry para Erro 500 ou Erro Interno (comum no deploy)
    const isRetryable = error.message?.includes("500") || 
                        error.message?.includes("INTERNAL") || 
                        error.message?.includes("fetch");

    if (isRetryable && retryCount < 2) {
      const delay = 1000 * (retryCount + 1);
      console.warn(`Erro interno detectado. Tentando novamente em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return speak(text, retryCount + 1);
    }
    
    // Se falhar após retentativas, exibe erro silencioso no log ou alerta controlado
    if (retryCount >= 2) {
      console.error("Falha persistente no serviço de áudio Gemini.");
    }
  }
}