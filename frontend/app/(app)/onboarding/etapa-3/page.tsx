"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Users, Brain, CheckCircle2 } from "lucide-react"
import { companyService } from "@/services/company.service"
import { Button } from "@/components/ui/button"

const BENEFITS = [
  {
    icon: Brain,
    title: "Perfil DISC do time",
    description:
      "Cada colaborador responde um questionário de 15 minutos que mapeia seu perfil comportamental.",
  },
  {
    icon: CheckCircle2,
    title: "Match cultural automático",
    description:
      "A IA compara o perfil de cada candidato com o DNA comportamental do seu time atual.",
  },
  {
    icon: Users,
    title: "Melhor retenção",
    description:
      "Contratações alinhadas com a cultura da equipe têm 3x mais chance de permanecer na empresa.",
  },
]

export default function Etapa3Page() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleContinue() {
    setSaving(true)
    try {
      await companyService.setOnboardingStep(4)
      router.push("/onboarding/etapa-4")
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
            <Users className="size-4 text-sidebar" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Testes do Seu Time</h2>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Convide seus colaboradores para mapear o DNA comportamental da empresa. Isso
          potencializa o match de candidatos futuros.
        </p>
      </div>

      <div className="px-8 pb-6 flex flex-col gap-4">
        {BENEFITS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="flex gap-4 p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="size-4 text-sidebar" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          )
        })}

        <p className="text-xs text-muted-foreground text-center mt-2">
          Você pode convidar seu time depois, em <strong>Configurações → Time</strong>.
        </p>
      </div>

      <div className="px-8 py-4 border-t border-border flex justify-between bg-muted/30">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/onboarding/etapa-2")}
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
