'use server';

/**
 * @fileOverview Implements a Genkit flow to suggest response options based on the conversation history and current message.
 *
 * - suggestResponseOptions - A function that generates suggested responses based on conversation history.
 * - SuggestResponseOptionsInput - The input type for the suggestResponseOptions function.
 * - SuggestResponseOptionsOutput - The return type for the suggestResponseOptions function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'genkit';

const SuggestResponseOptionsInputSchema = z.object({
  conversationHistory: z.array(z.string()).describe('The history of the conversation.'),
  currentMessage: z.string().describe('The current message from the user.'),
});
export type SuggestResponseOptionsInput = z.infer<
  typeof SuggestResponseOptionsInputSchema
>;

const SuggestResponseOptionsOutputSchema = z.array(z.string()).describe('An array of suggested response options.');
export type SuggestResponseOptionsOutput = z.infer<
  typeof SuggestResponseOptionsOutputSchema
>;

export async function suggestResponseOptions(
  input: SuggestResponseOptionsInput
): Promise<SuggestResponseOptionsOutput> {
  return suggestResponseOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResponseOptionsPrompt',
  model: googleAI.model('gemini-2.5-flash'),
  input: {schema: SuggestResponseOptionsInputSchema},
  output: {schema: SuggestResponseOptionsOutputSchema},
  system: `You are an expert at providing relevant, short, and helpful response options.
If the conversation has just started, provide some useful getting-started questions.
Otherwise, base your suggestions on the recent conversation history.`,
  prompt: `Given the following conversation history and the current message, suggest three possible response options as a multiple-choice list. The options should be short and relevant to the conversation.

Conversation History:
{{#each conversationHistory}}
- {{{this}}}
{{/each}}

Current Message: {{{currentMessage}}}

Response Options:`,
});

const suggestResponseOptionsFlow = ai.defineFlow(
  {
    name: 'suggestResponseOptionsFlow',
    inputSchema: SuggestResponseOptionsInputSchema,
    outputSchema: SuggestResponseOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
