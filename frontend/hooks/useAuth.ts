import { useAuthStore } from "@/store/auth.store"
import { useShallow } from "zustand/react/shallow"

export function useAuth() {
  return useAuthStore(
    useShallow((s) => ({
      user:            s.user,
      isAuthenticated: s.isAuthenticated,
      setAuth:         s.setAuth,
      clearAuth:       s.clearAuth,
    }))
  )
}