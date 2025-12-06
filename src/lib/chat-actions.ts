'use server';

import { ai } from '@/ai/genkit';
import type { Message } from './types';

export async function continueConversation(
  history: Omit<Message, 'id'>[],
  prompt: string
): Promise<ReadableStream<Uint8Array>> {

  const { stream } = await ai.generateStream({
    model: 'googleai/gemini-1.5-flash',
    history: history.map(msg => ({
      role: msg.role as 'user' | 'model',
      content: [{ text: msg.content }],
    })),
    prompt: { text: prompt },
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (chunk.text) {
          const data = encoder.encode(chunk.text);
          controller.enqueue(data);
        }
      }
      controller.close();
    },
  });

  return readableStream;
}
