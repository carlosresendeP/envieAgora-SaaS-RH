import { z } from "zod"

export const nodeSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cargo: z.string().min(2, "Cargo obrigatório"),
  parentId: z.string().optional().nullable(),
})

export type NodeFormValues = z.infer<typeof nodeSchema>
