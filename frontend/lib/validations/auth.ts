import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const CadastroSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  razaoSocial: z.string().min(2, "Razão Social inválida"),
  cnpj: z.string().refine(
    (v) => v.replace(/\D/g, "").length === 14,
    "CNPJ deve ter 14 dígitos"
  ),
})

export type LoginFields = z.infer<typeof LoginSchema>
export type CadastroFields = z.infer<typeof CadastroSchema>
