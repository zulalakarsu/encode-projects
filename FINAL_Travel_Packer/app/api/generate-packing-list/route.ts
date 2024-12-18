import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "system", 
        content: "You are a travel packing expert who provides detailed, practical packing recommendations based on weather and activities."
      },
      { 
        role: "user", 
        content: prompt 
      }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{"items": []}');
    
    return NextResponse.json(response.items);
  } catch (error) {
    console.error('Error generating packing list:', error);
    return NextResponse.json(
      { error: 'Failed to generate packing list' },
      { status: 500 }
    );
  }
} 