import { GoogleGenAI, Modality } from "@google/genai";

// Helpers para processamento de áudio binário (PCM 16-bit)
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
  // Converte o buffer bruto em inteiros de 16 bits
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normaliza PCM 16-bit para o intervalo [-1.0, 1.0] exigido pela Web Audio API
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Singleton para o contexto de áudio para evitar múltiplas instâncias
let audioCtx: AudioContext | null = null;

export async function speak(text: string): Promise<void> {
  if (!text || !text.trim()) return;

  try {
    // 1. Prepara o contexto de áudio (deve ser iniciado por interação do usuário)
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 2. Inicializa o cliente GenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Gera o conteúdo de áudio (TTS)
    // Usamos um texto limpo para evitar erros internos de processamento
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.trim() }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // "Kore" é uma voz estável com velocidade natural 1x
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.warn("Nenhum dado de áudio retornado pelo modelo.");
      return;
    }

    // 4. Decodifica o PCM e reproduz
    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error("Erro no Sistema TTS:", error);
    // Erros 500 costumam ser problemas temporários no servidor de preview
    if (error.message?.includes("500") || error.message?.includes("INTERNAL")) {
      console.warn("O serviço TTS encontrou um erro interno (500). Tente novamente em alguns segundos.");
    }
  }
}