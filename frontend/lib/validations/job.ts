import { z } from "zod"

export const createJobSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  requisitos: z.string().optional(),
  descricao: z.string().optional(),
  salaryMin: z.coerce.number().positive("Valor inválido").optional().or(z.literal("")),
  salaryMax: z.coerce.number().positive("Valor inválido").optional().or(z.literal("")),
  liderId: z.string().optional(),
})

export type CreateJobFormValues = z.infer<typeof createJobSchema>
