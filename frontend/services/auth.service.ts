import { api } from "@/lib/api"
import type { ApiResponse, AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "@/types/api"

interface LoginRawResponse {
  ok: true
  data: {
    user: Omit<AuthUser, "companyId">
    company: { id: string; razaoSocial: string; cnpj: string }
  }
  token: string
  refreshToken: string
}

export const authService = {
  login: async (body: LoginRequest): Promise<AuthResponse & { refreshToken: string }> => {
    const { data } = await api.post<LoginRawResponse>("/login", body)
    return {
      token: data.token,
      refreshToken: data.refreshToken,
      user: { ...data.data.user, companyId: data.data.company.id },
    }
  },

  signup: async (body: RegisterRequest): Promise<void> => {
    await api.post("/register", body)
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await api.get<ApiResponse<AuthUser>>("/me")
    return data.data
  },

  logout: async (): Promise<void> => {
    const { tokenStorage } = await import("@/lib/tokens")
    const refreshToken = tokenStorage.getRefresh()
    if (refreshToken) {
      await api.post("/logout", { refreshToken }).catch(() => null)
    }
  },
}
