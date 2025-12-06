'use server';

import { ai } from '@/ai/genkit';
import { gemini15Flash } from '@genkit-ai/google-genai';
import type { Message } from './types';

export async function continueConversation(
  history: Omit<Message, 'id'>[],
  prompt: string
) {
  return ai.generateStream({
    model: gemini15Flash,
    history,
    prompt: { text: prompt },
  }).toWebStream();
}
