import { z } from "zod";

export const updateCompanySchema = z.object({
  nome: z.string().min(3).optional(),
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
  contextoEmpresa: z.string().optional(),
  perfilRitmo: z.string().optional(),
  valores: z.array(z.string()).optional(),
  logoUrl: z.string().url().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  teamEmails: z.array(z.string().email()).optional(),
});

export const teamInviteSchema = z.object({
  emails: z.array(z.string().email()).min(1, "Informe ao menos um e-mail"),
});

export type TeamInviteDTO = z.infer<typeof teamInviteSchema>;

// Este tipo substitui o 'any' no Service e no Controller
export type UpdateCompanyDTO = z.infer<typeof updateCompanySchema>;