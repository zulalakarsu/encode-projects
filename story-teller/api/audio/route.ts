import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Add audio cache
const audioCache = new Map<string, ArrayBuffer>();

export async function POST(req: Request) {
  try {
    const { message, tone, ageGroup } = await req.json();
    
    // Create cache key
    const cacheKey = `${message}-${tone}-${ageGroup}`;
    
    // Check cache first
    if (audioCache.has(cacheKey)) {
      return new NextResponse(audioCache.get(cacheKey), {
        headers: { 'Content-Type': 'audio/mpeg' },
      });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: tone.toLowerCase() === "happy" ? "alloy" : "nova",
      input: message,
    });

    const audioData = await response.arrayBuffer();
    
    // Cache the audio data
    audioCache.set(cacheKey, audioData);
    
    // Limit cache size (optional)
    if (audioCache.size > 10) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }

    return new NextResponse(audioData, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error in audio API:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}