'use server';

import { ai } from '@/ai/genkit';
import { gemini25Flash } from '@genkit-ai/googleai';
import type { Message } from './types';

export async function continueConversation(
  history: Omit<Message, 'id'>[],
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  const model = gemini25Flash;

  const { stream } = await ai.generateStream({
    model,
    history: history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{ text: msg.content }],
    })),
    prompt: { text: prompt },
    config: {
      temperature: 0.7,
    },
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          if (chunk.text) {
            const data = encoder.encode(chunk.text);
            controller.enqueue(data);
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return readableStream;
}
