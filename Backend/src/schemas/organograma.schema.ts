import { z } from 'zod';

export const organogramaSchema = z.object({
  nome: z.string().min(3, "O nome é obrigatório"),
  cargo: z.string().min(2, "O cargo é obrigatório"),
  parentId: z.string().uuid().optional().nullable(),
});

export const paramsIdDTO = z.object({
  id: z.string().uuid(),
});

export type ParamsIdDTO = z.infer<typeof paramsIdDTO>;
export type OrganogramaDTO = z.infer<typeof organogramaSchema>;