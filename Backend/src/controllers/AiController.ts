import { FastifyReply, FastifyRequest } from 'fastify';
import { MatchService } from '../services/matchService';
import { MatchBodyDTO } from '../schemas/ai.schema';

export class AiController {
  private service = new MatchService();

  generateJd = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const data = await this.service.generateJd(req.params.id);
    return reply.send({ ok: true, data });
  };

  match = async (
    req: FastifyRequest<{ Params: { id: string }; Body: MatchBodyDTO }>,
    reply: FastifyReply
  ) => {
    const data = await this.service.generateMatch(req.params.id, req.body.candidateId);
    return reply.send({ ok: true, data });
  };
}
