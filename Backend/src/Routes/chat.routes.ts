import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.middleware';
import { ChatController } from '../controllers/ChatController';

const chatController = new ChatController();

const chatBodySchema = z.object({
  message: z.string().min(1),
  context: z.string().optional(),
});

export async function chatRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    preHandler: [authMiddleware],
    schema: {
      body: chatBodySchema,
    },
    handler: chatController.stream,
  });
}
