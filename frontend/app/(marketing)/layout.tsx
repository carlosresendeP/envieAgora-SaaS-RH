"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const hydrate = useAuthStore((s) => s.hydrate)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Verifica uma única vez ao carregar — não reage a mudanças de isAuthenticated
    // (evita corrida com o redirect do form de login)
    hydrate().finally(() => {
      if (useAuthStore.getState().isAuthenticated) {
        router.replace("/dashboard")
      }
      setHydrated(true)
    })
  }, [hydrate, router])

  if (!hydrated) return null

  return <>{children}</>
}
