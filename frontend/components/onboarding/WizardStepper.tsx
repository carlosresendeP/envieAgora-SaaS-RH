"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const STEPS = [
  { number: 1, path: "etapa-1", label: "Dados da Empresa" },
  { number: 2, path: "etapa-2", label: "Organograma" },
  { number: 3, path: "etapa-3", label: "Seu Time" },
  { number: 4, path: "etapa-4", label: "Contexto & Valores" },
]

export function WizardStepper() {
  const pathname = usePathname()
  const currentStep = STEPS.find((s) => pathname.includes(s.path))?.number ?? 1

  return (
    <div>
      {/* Segmented progress bar */}
      <div className="w-full h-1.5 flex">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className={cn(
              "flex-1 transition-colors",
              i > 0 && "ml-px",
              step.number < currentStep
                ? "bg-sidebar"
                : step.number === currentStep
                  ? "bg-primary"
                  : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step info */}
      <div className="px-8 pt-6 pb-1 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Passo {currentStep} de {STEPS.length}
        </span>
        <div className="flex gap-1">
          {STEPS.map((step) => (
            <span
              key={step.number}
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
                step.number === currentStep
                  ? "bg-primary/20 text-foreground font-bold"
                  : step.number < currentStep
                    ? "text-muted-foreground"
                    : "text-muted-foreground/40"
              )}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
