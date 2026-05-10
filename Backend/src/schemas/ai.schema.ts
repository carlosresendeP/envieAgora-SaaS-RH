import { z } from "zod";

// Validação de entrada para as rotas
export const aiJobParamsSchema = z.object({
  id: z.string().uuid("ID da vaga inválido"),
});

export const matchBodySchema = z.object({
  candidateId: z.string().uuid("ID do candidato inválido"),
});

export const aiMatchResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  resumoExecutivo: z.string(),
  pontosFortes: z.array(z.object({
    titulo: z.string(),
    descricao: z.string(),
    impactoNaFuncao: z.string(),
  })),
  pontosAtencao: z.array(z.object({
    titulo: z.string(),
    descricao: z.string(),
    sugestaoDeDesenvolvimento: z.string(),
  })),
  comoLiderarEsseCandidato: z.object({
    delegacao: z.string(),
    feedback: z.string(),
    motivacao: z.string(),
  }),
  matchComCultura: z.object({
    onde: z.string(),
    fricaoEsperada: z.string(),
  }),
  perguntasComplementares: z.array(z.string()),
  desafioPratico: z.object({
    titulo: z.string(),
    descricao: z.string(),
    duracaoEstimada: z.string(),
    habilidadesAvaliadas: z.array(z.string()),
  }),
  planoDevelopment: z.object({
    livros: z.array(z.object({ titulo: z.string(), motivo: z.string() })),
    cursos: z.array(z.object({ nome: z.string(), plataforma: z.string(), motivo: z.string() })),
    evolucaoSalarial: z.string(),
  }),
});

export const perfilIdealSchema = z.object({
  perguntasTriagem: z.array(z.string()),
  perfilPsicometricoIdeal: z.object({
    disc: z.string(),
    eneagrama: z.string(),
    tracosPrincipais: z.array(z.string()),
  }),
});

export type AiMatchResult = z.infer<typeof aiMatchResultSchema>;
export type MatchBodyDTO = z.infer<typeof matchBodySchema>;
export type PerfilIdeal = z.infer<typeof perfilIdealSchema>;