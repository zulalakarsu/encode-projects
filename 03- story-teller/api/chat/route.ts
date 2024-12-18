import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client outside the handler to reuse the instance
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Replace theOpenAI API with text generation webui server baseurl 
const openai = new OpenAI({
  baseURL: `http://127.0.0.1:5000/v1`,
});

// export const runtime = "edge";

// Add response caching
let responseCache = new Map();

// debug
// console.log('Using OpenAI API Key:', process.env.OPENAI_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // prompt: "You are a professional storyteller who has been hired to write a series of short stories in ${genre} and with  ${tone.toLowerCase()} in tone.",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = response.choices[0].message;

    // Cache the response
    responseCache.set(JSON.stringify(messages), result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in chat API:', error);
    // Log the error details
    if (error.response) {
      console.error('OpenAI API response:', error.response);
    }
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Add response headers for better caching
export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour
