'use server';

import { ai } from '@/ai/genkit';
import { runFlow } from 'genkit';
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
      // An OpenAI-compatible history consists of a flat list of messages.
      // The new user prompt is just the last message in that list.
      history: [...history, { role: 'user', content: prompt }],
      prompt: '', // The prompt is included in the history
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

    const flowStream = new ReadableStream({
      async start(controller) {
        try {
          await runFlow(continueConversationFlow, { history: messages, prompt }, {
              streamingCallback: (chunk) => {
                  if (chunk) {
                    controller.enqueue(new TextEncoder().encode(chunk));
                  }
              },
          });
        } finally {
          controller.close();
        }
      },
    });

    return flowStream;
}
