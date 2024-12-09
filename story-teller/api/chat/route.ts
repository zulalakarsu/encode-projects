import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client outside the handler to reuse the instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Add response caching
let responseCache = new Map();

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Create a cache key from the last message
    const lastMessage = messages[messages.length - 1];
    const cacheKey = JSON.stringify(lastMessage);

    // Check cache first
    if (responseCache.has(cacheKey)) {
      return NextResponse.json(responseCache.get(cacheKey));
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Changed to a faster model
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      timeout: 60000, // 60 second timeout
    });

    const result = response.choices[0].message;

    // Cache the response
    responseCache.set(cacheKey, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Add response headers for better caching
export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour