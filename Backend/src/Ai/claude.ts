import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

const model = anthropic('claude-haiku-4-5-20251001');

export const claude = {

  async generateText(prompt: string, system?: string): Promise<string> {
    const { text } = await generateText({
      model,
      system,
      prompt,
    });

    return text;
  },

  /**
   * Gera um objeto JSON validado pelo Zod.
   * Substitui o antigo generateJson por uma abordagem tipada.
   */
  async generateJson<T>(schema: z.ZodType<T>, prompt: string, system?: string): Promise<T> {
    const { text } = await generateText({
      model,
      system: `${system ?? ''}\n\nResponda APENAS com JSON válido, sem markdown, sem explicações.`.trim(),
      prompt,
    });

    return schema.parse(JSON.parse(text));
  },

  /**
   * Cria um stream de texto para respostas em tempo real.
   */
  async streamText(prompt: string, system?: string) {
    const result = await streamText({
      model,
      system,
      prompt,
    });

    return result.textStream;
  }
};