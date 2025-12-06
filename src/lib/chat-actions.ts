'use server';

import { ai } from '@/ai/genkit';
import type { Message } from './types';

export async function continueConversation(
  history: Omit<Message, 'id'>[],
  prompt: string
) {
  return ai.generateStream({
    model: 'googleai/gemini-1.5-flash',
    history,
    prompt: { text: prompt },
  }).toWebStream();
}
