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
  cnpj: z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
})

export type LoginFields = z.infer<typeof LoginSchema>
export type CadastroFields = z.infer<typeof CadastroSchema>
