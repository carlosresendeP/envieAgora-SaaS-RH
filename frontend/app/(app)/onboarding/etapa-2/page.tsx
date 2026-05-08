"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Network } from "lucide-react"
import { companyService } from "@/services/company.service"
import { OrganogramaTree } from "@/components/onboarding/OrganogramaTree"
import { Button } from "@/components/ui/button"

export default function Etapa2Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    setSaving(true)
    try {
      await companyService.setOnboardingStep(3)
      router.push("/onboarding/etapa-3")
    } catch {
      toast.error("Erro ao avançar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="px-8 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Network className="size-4 text-sidebar" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Organograma</h2>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Monte a estrutura hierárquica da sua empresa. Isso ajuda a IA a entender o contexto
          de cada vaga e a quem os candidatos se reportarão.
        </p>
      </div>

      <div className="px-8 pb-6">
        <OrganogramaTree />
      </div>

      <div className="px-8 py-4 border-t border-border flex justify-between bg-muted/30">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/onboarding/etapa-1")}
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <Button type="button" onClick={handleContinue} disabled={saving}>
          {saving ? "Salvando..." : "Continuar"}
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
