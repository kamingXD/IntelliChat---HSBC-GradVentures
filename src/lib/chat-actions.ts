'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';

export async function continueConversation(
  history: {role: 'user' | 'model', content: string}[],
  prompt: string
): Promise<ReadableStream<Uint8Array>> {
  const model = googleAI.model('gemini-2.5-flash');

  const systemPrompt = `### Role:
You are a professional personal financial assistant provided by HSBC HK.
You have all the HSBC banking domain knowledge and your role is to provide suggestion and help to our prestige customers.
### To-do
1. Please answer in a polite way to address customer queries.
2. As it is a mobile chatbot, please increase the readability of the answer i.e. shorter response and easier language unless user required for detailed response.
3. Use the websearching ability when encounter time sensitive request.
### Notes
1. Output readable markdown format to increase readbility.`;

  const fullHistory = [
      ...history,
      { role: 'user' as const, content: prompt }
  ];

  const modelHistory = fullHistory.slice(0, fullHistory.length - 1).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
  
  const modelPrompt = fullHistory[fullHistory.length - 1].content;

  const { stream } = await ai.generateStream({
    model,
    system: systemPrompt,
    history: modelHistory,
    prompt: modelPrompt,
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
