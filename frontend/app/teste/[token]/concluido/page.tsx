"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2 } from "lucide-react"
import { testService } from "@/services/test.service"
import type { RespostasJson, DiscScores } from "@/types/api"

const DISC_LABELS: Record<keyof Omit<DiscScores, "primary">, string> = {
  dominance: "D",
  influence: "I",
  steadiness: "S",
  conscientiousness: "C",
}

const DISC_DESCRIPTIONS: Record<string, string> = {
  dominance: "Dominância — orientado a resultados e desafios",
  influence: "Influência — comunicativo e entusiasta",
  steadiness: "Estabilidade — colaborativo e consistente",
  conscientiousness: "Conformidade — analítico e preciso",
}

function DiscBars({ disc }: { disc: DiscScores }) {
  const bars = (["dominance", "influence", "steadiness", "conscientiousness"] as const).map(
    (key) => ({ key, label: DISC_LABELS[key], value: disc[key] })
  )
  return (
    <div className="space-y-2.5">
      {bars.map(({ key, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-xs font-bold w-4 text-muted-foreground">{label}</span>
          <div className="flex-1 h-2.5 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{value}%</span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground pt-1">
        Perfil dominante:{" "}
        <span className="font-semibold text-foreground">
          {DISC_DESCRIPTIONS[disc.primary] ?? disc.primary}
        </span>
      </p>
    </div>
  )
}

export default function ConcluidoPage() {
  const { token } = useParams<{ token: string }>()
  const [results, setResults] = useState<RespostasJson | null>(null)

  const { data: test } = useQuery({
    queryKey: ["test-data", token],
    queryFn: () => testService.getTest(token),
    staleTime: Infinity,
    retry: false,
    throwOnError: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = sessionStorage.getItem(`test_results_${token}`)
      if (stored) setResults(JSON.parse(stored) as RespostasJson)
    } catch { /* silent */ }
  }, [token])

  return (
    <div className="max-w-lg mx-auto px-4 py-12 flex flex-col gap-6">
      {/* Success header */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="size-10 text-sidebar" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Testes concluídos!</h1>
          <p className="text-muted-foreground">
            Obrigado por participar
            {test?.candidate ? (
              <>, <span className="font-semibold text-foreground">{test.candidate}</span></>
            ) : null}!
          </p>
        </div>
      </div>

      {/* Results profile */}
      {results && (
        <div className="rounded-xl border border-secondary/40 bg-card p-5 space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Seu Perfil Comportamental
          </p>

          {results.disc && (
            <div className="space-y-3">
              <p className="text-sm font-semibold">DISC</p>
              <DiscBars disc={results.disc} />
            </div>
          )}

          {(results.eneagrama || results.personalities) && (
            <div className="border-t border-secondary/20 pt-4 grid grid-cols-2 gap-4">
              {results.eneagrama && (
                <div className="space-y-1 text-center rounded-lg border border-secondary/30 p-3">
                  <p className="text-xs text-muted-foreground">Eneagrama</p>
                  <p className="text-2xl font-bold text-primary">{results.eneagrama.primaryType}</p>
                  <p className="text-xs text-muted-foreground">Tipo {results.eneagrama.primaryType}</p>
                </div>
              )}
              {results.personalities && (
                <div className="space-y-1 text-center rounded-lg border border-secondary/30 p-3">
                  <p className="text-xs text-muted-foreground">16 Personalidades</p>
                  <p className="text-2xl font-bold text-primary">{results.personalities.type}</p>
                  <p className="text-xs text-muted-foreground">{results.personalities.type}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next steps */}
      <div className="rounded-xl border border-secondary/40 bg-muted/30 p-5 space-y-2">
        <p className="text-sm font-semibold">O que acontece agora?</p>
        <ul className="space-y-1.5">
          {[
            "Seus resultados foram registrados e enviados para a equipe de RH.",
            "A empresa irá analisar seu perfil psicométrico junto com os requisitos da vaga.",
            "A equipe entrará em contato com os próximos passos do processo.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Esta janela pode ser fechada com segurança.
      </p>
    </div>
  )
}
