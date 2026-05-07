import { z } from "zod";

// Validação de entrada para as rotas
export const aiJobParamsSchema = z.object({
  id: z.string().uuid("ID da vaga inválido"),
});

export const matchBodySchema = z.object({
  candidateId: z.string().uuid("ID do candidato inválido"),
});

// Schema que a IA PRECISA seguir (usado no generateObject do Claude)
export const aiMatchResultSchema = z.object({
  score: z.number().min(0).max(100),
  justificativa: z.string(),
  pontos_fortes: z.array(z.string()),
  pontos_de_atencao: z.array(z.string()),
});

export type AiMatchResult = z.infer<typeof aiMatchResultSchema>;
export type MatchBodyDTO = z.infer<typeof matchBodySchema>;