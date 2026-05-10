import { prisma } from '../config/prisma';
import { AppError } from '../config/error';
import { ai } from '../Ai/openai';
import { prompts } from '../Ai/prompts';
import { aiMatchResultSchema, AiMatchResult, perfilIdealSchema, PerfilIdeal } from '../schemas/ai.schema';

export class MatchService {
  async generateJd(jobId: string): Promise<string> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new AppError('Vaga não encontrada', 404);

    const description = await ai.generateText(
      prompts.jd(job.titulo, job.descricao || ''),
      'Você é um especialista em recrutamento tech.'
    );

    await prisma.job.update({
      where: { id: jobId },
      data: { jdGerada: description },
    });

    return description;
  }

  async generateMatch(jobId: string, candidateId: string): Promise<AiMatchResult> {
    const [job, candidate] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId }, include: { company: true } }),
      prisma.candidate.findUnique({ where: { id: candidateId } }),
    ]);

    if (!job) throw new AppError('Vaga não encontrada', 404);
    if (!candidate) throw new AppError('Candidato não encontrado', 404);

    const application = await prisma.application.findFirst({
      where: { jobId, candidateId },
    });

    if (!application) throw new AppError('Candidatura não encontrada para esta vaga e candidato', 404);

    const companyContext = JSON.stringify({
      contextoEmpresa: job.company.contextoEmpresa,
      perfilRitmo: job.company.perfilRitmo,
      valores: job.company.valores,
    });

    const { company: _company, ...jobData } = job;

    const analysis = await ai.generateJson<AiMatchResult>(
      aiMatchResultSchema,
      prompts.match(JSON.stringify(jobData), JSON.stringify(candidate), companyContext),
      'Você é um sistema de triagem de RH de alta precisão.'
    );

    await prisma.application.update({
      where: { id: application.id },
      data: {
        matchScore: analysis.matchScore,
        feedbackIA: analysis.resumoExecutivo,
        matchResultJson: JSON.parse(JSON.stringify(analysis)),
      },
    });

    return analysis;
  }

  async generatePerfilIdeal(jobId: string): Promise<PerfilIdeal> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) throw new AppError('Vaga não encontrada', 404);

    const companyContext = JSON.stringify({
      contextoEmpresa: job.company.contextoEmpresa,
      perfilRitmo: job.company.perfilRitmo,
      valores: job.company.valores,
    });

    const { company: _company, ...jobData } = job;

    const perfil = await ai.generateJson<PerfilIdeal>(
      perfilIdealSchema,
      prompts.perfilIdeal(JSON.stringify(jobData), companyContext),
      'Você é um especialista em recrutamento e psicologia organizacional.'
    );

    await prisma.job.update({
      where: { id: jobId },
      data: { perfilIdealJson: JSON.parse(JSON.stringify(perfil)) },
    });

    return perfil;
  }
}
