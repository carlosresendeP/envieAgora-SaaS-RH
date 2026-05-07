import { ai } from '../Ai/openai';
import { prompts } from '../Ai/prompts';

export class ChatService {
  async stream(message: string, context?: string): Promise<AsyncIterable<string>> {
    const system = prompts.chat(context ?? '');
    return ai.streamText(message, system);
  }
}
