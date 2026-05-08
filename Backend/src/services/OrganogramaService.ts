import { prisma } from '@/config/prisma';
import { formatBR } from '@/config/dayjs';
import { AppError } from '@/config/error';
import { OrganogramaDTO } from '@/schemas/organograma.schema';

export class OrganogramaService {

  //listar o organograma
  async executeList(companyId: string) {
    const nodes = await prisma.organogramaNode.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });

    return nodes.map(node => ({
      ...node,
      createdAt: formatBR(node.createdAt),
      updatedAt: formatBR(node.updatedAt),
    }));
  }

  //criando o organograma
  async executeCreate(data: OrganogramaDTO, companyId: string) {
    const newNode = await prisma.organogramaNode.create({
      data: { ...data, companyId },
    });

    return {
      ...newNode,
      createdAt: formatBR(newNode.createdAt),
      updatedAt: formatBR(newNode.updatedAt),
    };
  }

  // atualizando um nó do organograma
  async executeUpdate(id: string, data: Partial<OrganogramaDTO>, companyId: string) {
    const node = await prisma.organogramaNode.findFirst({ where: { id, companyId } });

    if (!node) throw new AppError('Nó não encontrado', 404);

    const updated = await prisma.organogramaNode.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      createdAt: formatBR(updated.createdAt),
      updatedAt: formatBR(updated.updatedAt),
    };
  }

  async executeDelete(id: string, companyId: string) {
    const node = await prisma.organogramaNode.findFirst({ where: { id, companyId } });

    if (!node) throw new AppError('Nó não encontrado', 404);

    try {
      await prisma.organogramaNode.delete({ where: { id } });
    } catch {
      throw new AppError('Erro ao deletar o nó', 500);
    }
  }
}
