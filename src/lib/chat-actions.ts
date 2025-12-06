'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Message } from './types';

const ChatRequestSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  prompt: z.string(),
});

const continueConversationFlow = ai.defineFlow(
  {
    name: 'continueConversationFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: z.string(),
  },
  async ({ history, prompt }) => {
    const llmResponse = await ai.generate({
      history: history,
      prompt: prompt,
      stream: true,
    });

    return llmResponse.text;
  }
);

export async function continueConversation(history: Message[], prompt: string) {
    // OpenAI-compatible models expect a flat list of messages
    const messages = history.map(m => ({
        role: m.role,
        content: m.content
    }));

    const llmResponse = await ai.generate({
        history: messages,
        prompt: prompt,
        stream: true
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of llmResponse.stream) {
                controller.enqueue(chunk.text);
            }
            controller.close();
        }
    });
    
    return stream;
}
