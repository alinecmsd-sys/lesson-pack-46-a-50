import { GoogleGenAI, Modality } from "@google/genai";

function decode(base64: string): Uint8Array {
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
  let buffer = data.buffer;
  let offset = data.byteOffset;
  if (offset % 2 !== 0) {
    buffer = data.slice().buffer;
    offset = 0;
  }

  const dataInt16 = new Int16Array(buffer, offset, Math.floor(data.byteLength / 2));
  const frameCount = dataInt16.length / numChannels;
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return audioBuffer;
}

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioCtx;
}

function cleanTextForTTS(text: string): string {
  return text
    .replace(/[A-Z]:/g, "") // Remove "A:" ou "B:" de diálogos
    .replace(/[#*_\-\[\]]/g, "") // Remove markdown
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos problemáticos
    .replace(/\s+/g, " ")
    .trim();
}

export async function speak(text: string, retryCount = 0): Promise<boolean> {
  const cleanText = cleanTextForTTS(text);
  if (!cleanText) return false;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prompt mais direto para evitar que o modelo responda com texto
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this: ${cleanText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" },
          },
        },
      },
    });

    let base64Audio: string | undefined;
    const parts = response.candidates?.[0]?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Audio) {
      console.warn("Nenhum dado de áudio na resposta. Tentativa:", retryCount + 1);
      throw new Error("EMPTY_AUDIO_DATA");
    }

    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0);
    return true;

  } catch (error: any) {
    console.error(`Erro no TTS (Produção):`, error.message);

    if (retryCount < 2) {
      const wait = 1000 * (retryCount + 1);
      await new Promise(r => setTimeout(r, wait));
      return speak(text, retryCount + 1);
    }
    return false;
  }
}