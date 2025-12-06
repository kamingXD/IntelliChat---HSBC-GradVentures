'use server';

import { ai } from '@/ai/genkit';
import { streamFlow } from '@genkit-ai/next/server';
import { z } from 'zod';
import type { Message } from './types';

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })
  ),
});

const continueConversationFlow = ai.defineFlow(
  {
    name: 'continueConversationFlow',
    inputSchema: ChatRequestSchema,
    outputSchema: z.string(),
  },
  async ({ messages }) => {
    const llmResponse = await ai.generate({
      history: messages.map(m => ({...m, parts: m.content})),
      prompt: '', // The last message is the prompt
      stream: true,
    });

    let text = '';
    for await (const chunk of llmResponse.stream) {
      if (chunk.text) {
        text += chunk.text;
      }
    }
    return text;
  }
);

export async function continueConversation(history: Message[], prompt: string) {
    const messages = history.map(m => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        content: [{ text: m.content }]
    }));
    messages.push({ role: 'user', content: [{ text: prompt }] });

    const stream = await streamFlow(continueConversationFlow, { messages });
    return stream;
}
