'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Message } from './types';

// This schema is not directly used by the exported function,
// but it's good practice for defining flow inputs.
const ChatRequestSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  prompt: z.string(),
});

// We don't need to define a separate flow here.
// We can call ai.generate directly in the server action.

export async function continueConversation(history: Omit<Message, 'id'>[], prompt: string) {
    const llmResponse = await ai.generate({
        model: 'googleai/gemini-pro',
        history: history,
        prompt: prompt,
        stream: true
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            for await (const chunk of llmResponse.stream) {
                if (chunk.text) {
                    controller.enqueue(encoder.encode(chunk.text));
                }
            }
            controller.close();
        }
    });
    
    return stream;
}
