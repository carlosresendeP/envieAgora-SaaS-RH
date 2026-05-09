import axios, { type InternalAxiosRequestConfig } from "axios"
import { tokenStorage } from "@/lib/tokens"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// ── Request: injeta access token ─────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: silent refresh em caso de 401 ──────────────────────────────────

type QueueItem = { resolve: (token: string) => void; reject: (err: unknown) => void }

let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(err: unknown, token: string | null) {
  failedQueue.forEach((item) => (err ? item.reject(err) : item.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err: unknown) => {
    if (!axios.isAxiosError(err)) return Promise.reject(err)

    const config = err.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = err.response?.status
    const isAuthPage =
      typeof window !== "undefined" &&
      ["/login", "/cadastro"].some((p) => window.location.pathname.startsWith(p))

    if (status !== 401 || config._retry || isAuthPage) return Promise.reject(err)

    // Se já está renovando, enfileira e aguarda
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        config.headers.Authorization = `Bearer ${newToken}`
        config._retry = true
        return api(config)
      })
    }

    config._retry = true
    isRefreshing = true

    const refreshToken = tokenStorage.getRefresh()

    if (!refreshToken) {
      isRefreshing = false
      tokenStorage.clear()
      if (typeof window !== "undefined") window.location.href = "/login"
      return Promise.reject(err)
    }

    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? ""
      const { data } = await axios.post(`${base}/auth/refresh`, { refreshToken })
      const { accessToken, refreshToken: newRefresh } = data.data

      tokenStorage.set(accessToken)
      tokenStorage.setRefresh(newRefresh)

      processQueue(null, accessToken)
      config.headers.Authorization = `Bearer ${accessToken}`
      return api(config)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      tokenStorage.clear()
      if (typeof window !== "undefined") window.location.href = "/login"
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)
