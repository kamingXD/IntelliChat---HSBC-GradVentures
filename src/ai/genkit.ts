import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: 'https://integrate.api.nvidia.com/v1',
    }),
  ],
  model: 'googleai/gpt-oss-120b',
});
