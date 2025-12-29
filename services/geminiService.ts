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
  // Ensure 2-byte alignment for Int16Array
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

/**
 * Strips speaker markers (A:, B:, etc.) and other non-verbal symbols 
 * that might confuse the single-speaker TTS model.
 */
function cleanForSpeech(text: string): string {
  return text
    .replace(/[A-Z]:\s*/g, " ") // Remove "A: " markers
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\[\]\-_:;()]/g, " ")
    .replace(/[^a-zA-Z0-9\s.,?!']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function speak(text: string, retryCount = 0): Promise<void> {
  const cleanText = cleanForSpeech(text);
  if (!cleanText) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Using a very simple prompt to minimize text preamble from the model
    const prompt = `Text to read: ${cleanText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
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
    let fallbackText: string = "";

    // Iterate through all parts of the first candidate to find inline audio data
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          break; // Found the audio!
        } else if (part.text) {
          fallbackText += part.text;
        }
      }
    }
    
    if (!base64Audio) {
      if (fallbackText) {
        console.warn("Model returned text instead of audio:", fallbackText);
      }
      throw new Error("EMPTY_AUDIO_DATA");
    }

    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error(`TTS Service Failure (Attempt ${retryCount + 1}):`, error);

    const isRetryable = error.message?.includes("500") || 
                        error.message?.includes("INTERNAL") ||
                        error.message === "EMPTY_AUDIO_DATA" ||
                        error.name === 'AbortError';
    
    if (isRetryable && retryCount < 2) {
      const delay = 1000 + (retryCount * 2000);
      console.warn(`Attempting recovery in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      return speak(text, retryCount + 1);
    }
  }
}