import { GoogleGenAI, Modality } from "@google/genai";

// Helpers para processamento de áudio PCM 16-bit
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
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioCtx: AudioContext | null = null;

export async function speak(text: string, retryCount = 0): Promise<void> {
  // Limpeza de texto para evitar erro interno no modelo de TTS
  const cleanText = text?.trim()
    .replace(/[*_#]/g, '') // Remove markdown básico
    .replace(/\s+/g, ' '); // Normaliza espaços
    
  if (!cleanText) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Chamada do modelo TTS com configuração de velocidade 1x (implícita pela voz Kore)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this clearly at normal speed: ${cleanText}` }] }],
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

    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error(`Tentativa ${retryCount + 1} falhou:`, error);

    // Se for um erro 500 (INTERNAL) e ainda tivermos tentativas, tenta novamente após breve delay
    if ((error.message?.includes("500") || error.message?.includes("INTERNAL")) && retryCount < 2) {
      console.warn("Instabilidade no servidor TTS detectada. Tentando novamente...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return speak(text, retryCount + 1);
    }
    
    throw error;
  }
}