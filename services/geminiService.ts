import { GoogleGenAI, Modality } from "@google/genai";

// Standard decoding functions as per Gemini API documentation
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

/**
 * Clean text for TTS. 
 * The 500 error is often triggered by special characters or formatting
 * that the preview TTS model doesn't handle well.
 */
function sanitizeTextForTTS(text: string): string {
  return text
    .replace(/[*_#\[\]()]/g, '') // Remove markdown
    .replace(/[^\w\s.,?!']/gi, ' ') // Remove non-standard symbols
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();
}

export async function speak(text: string, retryCount = 0): Promise<void> {
  // Use progressively simpler text on retries to avoid 500 errors
  const cleanText = retryCount === 0 
    ? sanitizeTextForTTS(text)
    : text.replace(/[^a-zA-Z0-9\s]/g, ' ').trim(); // Ultra-safe fallback

  if (!cleanText) return;

  try {
    // 1. Initialize or resume AudioContext
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 2. Create fresh client instance
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Generate content with explicit system instruction to stabilize engine
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${cleanText}` }] }],
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
      throw new Error("EMPTY_TTS_RESPONSE");
    }

    // 4. Play audio
    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);

  } catch (error: any) {
    console.error(`TTS Error (Attempt ${retryCount + 1}):`, error);

    // Handle 500 INTERNAL or other transient network errors
    const isInternalError = error.message?.includes("500") || error.message?.includes("INTERNAL");
    
    if ((isInternalError || error.name === 'AbortError') && retryCount < 2) {
      const waitTime = (retryCount + 1) * 800; // Shorter backoff
      console.warn(`Internal error detected. Retrying with simplified text in ${waitTime}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      return speak(text, retryCount + 1);
    }
  }
}