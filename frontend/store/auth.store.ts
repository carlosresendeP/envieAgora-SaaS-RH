import { create } from "zustand"
import { api } from "@/lib/api"
import { tokenStorage } from "@/lib/tokens"
import type { AuthUser, ApiResponse } from "@/types/api"

interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean
  setAuth:         (user: AuthUser, accessToken: string, refreshToken: string) => void
  clearAuth:       () => void
  hydrate:         () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,

  // Define os dados do usuário no estado e salva o token no storage
  setAuth: (user, accessToken, refreshToken) => {
    tokenStorage.set(accessToken)
    tokenStorage.setRefresh(refreshToken)
    set({ user, token: accessToken, isAuthenticated: true })
  },

  // Limpa o estado global e remove o token do storage
  clearAuth: () => {
    tokenStorage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Restaura a sessão ao recarregar a página, validando o token com o backend
  hydrate: async () => {
    const token = tokenStorage.get()
    if (!token) return
    try {
      const { data } = await api.get<ApiResponse<AuthUser>>("/me")
      set({ user: data.data, token, isAuthenticated: true })
    } catch {
      tokenStorage.clear()
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
