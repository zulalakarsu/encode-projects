import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";



export async function POST(req: Request) {
  const { messages, topic, tone, jokeType, options } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    temperature: options?.temperature ?? 1,
    messages: [
      {
        role: 'system',
        content: `You are a comedian and joke critic. First generate a ${jokeType} joke about ${topic} with a ${tone} tone. 
        Then, on a new line after "EVALUATION:", provide a brief analysis of the joke considering:
        - Humor Level (1-10)
        - Appropriateness (1-10)
        - Originality (1-10)
        - Alignment with requested tone
        Keep the evaluation concise and professional.`,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}