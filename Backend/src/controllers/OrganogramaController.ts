import { FastifyReply, FastifyRequest } from 'fastify';
import { OrganogramaService } from '../services/OrganogramaService';
import { OrganogramaDTO, ParamsIdDTO } from '@/schemas/organograma.schema';

export class OrganogramaController {
  private organogramaService = new OrganogramaService();

  get = async (req: FastifyRequest, reply: FastifyReply) => {
    const data = await this.organogramaService.executeList(req.user.companyId);
    return reply.send({ ok: true, data });
  };

  create = async (req: FastifyRequest<{ Body: OrganogramaDTO }>, reply: FastifyReply) => {
    const data = await this.organogramaService.executeCreate(req.body, req.user.companyId);
    return reply.status(201).send({ ok: true, data });
  };

  update = async (req: FastifyRequest<{ Params: ParamsIdDTO; Body: Partial<OrganogramaDTO> }>, reply: FastifyReply) => {
    const data = await this.organogramaService.executeUpdate(req.params.id, req.body, req.user.companyId);
    return reply.send({ ok: true, data });
  };

  delete = async (req: FastifyRequest<{ Params: ParamsIdDTO }>, reply: FastifyReply) => {

    await this.organogramaService.executeDelete(req.params.id, req.user.companyId);
    return reply.status(204).send({ ok: true, message: 'Nó removido com sucesso' });
  };
}
