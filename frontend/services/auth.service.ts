import { api } from "@/lib/api"
import type { ApiResponse, AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "@/types/api"

// Estrutura real do /login: token fica na raiz, não dentro de data
interface LoginRawResponse {
  ok: true
  data: {
    user: Omit<AuthUser, "companyId">
    company: { id: string; razaoSocial: string; cnpj: string }
  }
  token: string
}

export const authService = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<LoginRawResponse>("/login", body)
    return {
      token: data.token,
      user: { ...data.data.user, companyId: data.data.company.id },
    }
  },

  // /register não retorna token — apenas confirma a criação da conta
  signup: async (body: RegisterRequest): Promise<void> => {
    await api.post("/register", body)
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<ApiResponse<AuthUser>>("/me")
    return data.data
  },
}
