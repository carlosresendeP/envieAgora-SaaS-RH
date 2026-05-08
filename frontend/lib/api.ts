import axios from "axios"
import { tokenStorage } from "@/lib/tokens"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res, // Se der tudo certo, apenas retorna a resposta
  (err: unknown) => {
    const isAuthPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/cadastro")

    if (axios.isAxiosError(err) && err.response?.status === 401 && !isAuthPage) {
      tokenStorage.clear()
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
