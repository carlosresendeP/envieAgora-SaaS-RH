"use client"

import { useRouter } from "next/navigation"
import { useState, KeyboardEvent } from "react"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Users, CheckCircle2, Mail, Plus, X, Loader2 } from "lucide-react"
import { companyService } from "@/services/company.service"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Option = "skip" | "invite"

export default function Etapa3Page() {
  const router = useRouter()
  const [selected, setSelected] = useState<Option | null>(null)
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [saving, setSaving] = useState(false)

  function addEmail() {
    const val = emailInput.trim().toLowerCase()
    if (!val || emails.includes(val)) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      toast.error("E-mail inválido.")
      return
    }
    setEmails((prev) => [...prev, val])
    setEmailInput("")
  }

  function handleEmailKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addEmail() }
  }

  async function handleContinue() {
    if (!selected) return
    setSaving(true)
    try {
      if (selected === "invite" && emails.length > 0) {
        await api.post("/company/team-invite", { emails })
        toast.success(`${emails.length} convite(s) enviado(s)!`)
      }
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
          Mapeie o DNA comportamental da sua equipe para potencializar o match de candidatos futuros.
        </p>
      </div>

      <div className="px-8 pb-6 flex flex-col gap-4">
        {/* Option A */}
        <button
          type="button"
          onClick={() => setSelected("skip")}
          className={cn(
            "flex gap-4 p-4 rounded-lg border-2 text-left transition-all",
            selected === "skip"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 bg-muted/30"
          )}
        >
          <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className={cn("size-4", selected === "skip" ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Já tenho os resultados do meu time</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Meu time já foi mapeado ou farei isso depois em <strong>Configurações → Time</strong>.
            </p>
          </div>
        </button>

        {/* Option B */}
        <button
          type="button"
          onClick={() => setSelected("invite")}
          className={cn(
            "flex gap-4 p-4 rounded-lg border-2 text-left transition-all",
            selected === "invite"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 bg-muted/30"
          )}
        >
          <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <Mail className={cn("size-4", selected === "invite" ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Quero enviar convites para meus colaboradores</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Envie links de mapeamento comportamental por e-mail agora mesmo.
            </p>
          </div>
        </button>

        {/* Email input — only when "invite" is selected */}
        {selected === "invite" && (
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              E-MAILS DOS COLABORADORES
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colaborador@empresa.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyDown}
              />
              <Button type="button" variant="outline" size="icon" onClick={addEmail}>
                <Plus className="size-4" />
              </Button>
            </div>
            {emails.length > 0 && (
              <div className="flex flex-col gap-1">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between text-sm bg-muted/50 rounded px-3 py-1.5"
                  >
                    <span className="text-foreground">{email}</span>
                    <button
                      type="button"
                      onClick={() => setEmails((prev) => prev.filter((e) => e !== email))}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {emails.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Adicione os e-mails e pressione Enter ou clique em +.
              </p>
            )}
          </div>
        )}
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
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!selected || saving || (selected === "invite" && emails.length === 0)}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              {selected === "invite" ? "Enviar e Continuar" : "Continuar"}
              <ArrowRight className="size-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
