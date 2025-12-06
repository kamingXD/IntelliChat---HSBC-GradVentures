'use server';

import { ai } from '@/ai/genkit';
import { streamFlow } from '@genkit-ai/next/server';
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

    // The entire flow result is streamed to the client, so we just need
    // to return the text from the stream.
    return llmResponse.text;
  }
);

export async function continueConversation(history: Message[], prompt: string) {
    // OpenAI-compatible models expect a flat list of messages
    const messages = history.map(m => ({
        role: m.role,
        content: m.content
    }));

    const {stream} = await streamFlow(continueConversationFlow, { history: messages, prompt });
    return stream;
}
