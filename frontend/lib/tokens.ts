const ACCESS_KEY  = "saas_rh_token"
const REFRESH_KEY = "saas_rh_refresh_token"

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(ACCESS_KEY)
  },
  set: (token: string): void => {
    localStorage.setItem(ACCESS_KEY, token)
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(REFRESH_KEY)
  },
  setRefresh: (token: string): void => {
    localStorage.setItem(REFRESH_KEY, token)
  },
  clear: (): void => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}
