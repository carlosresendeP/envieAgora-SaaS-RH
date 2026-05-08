"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function CTAButton() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  return (
    <Button
      size="lg"
      className="rounded-full px-8 shadow-md hover:shadow-primary hover:bg-primary-foreground hover:text-popover"
      onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
    >
      Começar Agora
    </Button>
  )
}
