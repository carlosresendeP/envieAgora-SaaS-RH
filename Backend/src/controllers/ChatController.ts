import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatService } from '../services/chatService';

export class ChatController {
  private service = new ChatService();

  stream = async (
    req: FastifyRequest<{ Body: { message: string; context?: string } }>,
    reply: FastifyReply
  ) => {
    const { message, context } = req.body;

    const textStream = await this.service.stream(message, context);

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.flushHeaders();

    for await (const chunk of textStream) {
      reply.raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    reply.raw.write('data: [DONE]\n\n');
    reply.raw.end();
  };
}
