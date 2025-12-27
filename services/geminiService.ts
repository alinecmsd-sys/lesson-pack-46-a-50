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
  // Converte buffer raw para PCM 16-bit
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalização para o padrão Web Audio API
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioCtx: AudioContext | null = null;

export async function speak(text: string): Promise<void> {
  const cleanText = text?.trim();
  if (!cleanText) return;

  try {
    // Inicialização segura do AudioContext
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // Criação da instância GenAI imediata para capturar a API_KEY corretamente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Chamada do modelo TTS
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // "Kore" é a voz recomendada para velocidade natural 1x
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("O modelo não retornou dados de áudio.");
    }

    const audioData = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error("Erro no Sistema TTS:", error);
    
    // Fallback ou Log detalhado para erro 500
    if (error.message?.includes("500") || error.message?.includes("INTERNAL")) {
      console.warn("Instabilidade detectada no servidor Gemini TTS. Tente clicar novamente.");
    }
  }
}