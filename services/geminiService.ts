import { GoogleGenAI, Modality } from "@google/genai";

// Funções de decodificação manuais conforme diretrizes oficiais
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
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
  const dataInt16 = new Int16Array(data.buffer);
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

// Saneamento radical: remove qualquer coisa que não seja alfanumérica simples ou pontuação básica
function sanitizeForTTS(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos se houver
    .replace(/[*_#\[\]()]/g, "") // Remove markdown
    .replace(/[^a-zA-Z0-9\s.,?!']/g, " ") // Mantém apenas o essencial
    .replace(/\s+/g, " ")
    .trim();
}

export async function speak(text: string, retryCount = 0): Promise<void> {
  const cleanText = sanitizeForTTS(text);
  if (!cleanText) return;

  try {
    // 1. Gerenciamento do Contexto de Áudio (Crucial para produção/Vercel)
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 2. Inicialização do Cliente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Chamada simplificada para o modelo (evita prefixos que causam erro 500)
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
      throw new Error("EMPTY_AUDIO");
    }

    // 4. Execução do Áudio
    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error(`TTS Production Error (Attempt ${retryCount + 1}):`, error);

    // Se for erro 500, tentamos apenas uma vez com um atraso maior
    const isInternal = error.message?.includes("500") || error.message?.includes("INTERNAL");
    
    if (isInternal && retryCount < 1) {
      await new Promise(r => setTimeout(r, 1500));
      return speak(text, retryCount + 1);
    }
  }
}