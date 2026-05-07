import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

const model = openai('gpt-4o-mini');

export const ai = {
  async generateText(prompt: string, system?: string): Promise<string> {
    const { text } = await generateText({
      model,
      system,
      prompt,
    });

    return text;
  },

  async generateJson<T>(schema: z.ZodType<T>, prompt: string, system?: string): Promise<T> {
    const { text } = await generateText({
      model,
      system: `${system ?? ''}\n\nResponda APENAS com JSON válido, sem markdown, sem explicações.`.trim(),
      prompt,
    });

    return schema.parse(JSON.parse(text));
  },

  async streamText(prompt: string, system?: string) {
    const result = streamText({
      model,
      system,
      prompt,
    });

    return result.textStream;
  },
};
