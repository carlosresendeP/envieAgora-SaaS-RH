"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Briefcase, Users, MessageSquare, CheckCircle2, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { companyService } from "@/services/company.service"
import { useJobs } from "@/hooks/useJobs"
import { useCompanyApplications } from "@/hooks/useApplications"
import type { ApplicationStatus } from "@/types/api"

// ── Helpers ──────────────────────────────────────────────────────────────────

function isThisMonth(dateStr: string): boolean {
  const parts = dateStr.split("/")
  if (parts.length < 3) return false
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2].split(" ")[0], 10)
  const now = new Date()
  return month === now.getMonth() + 1 && year === now.getFullYear()
}

function getInitials(name?: string): string {
  if (!name) return "?"
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("")
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  PENDENTE:           { label: "PENDENTE",   className: "bg-muted text-foreground border-border" },
  EM_ANALISE:         { label: "EM ANÁLISE", className: "bg-muted text-foreground border-border" },
  TESTE_PSICOMETRICO: { label: "TESTE",      className: "bg-accent/20 text-foreground border-accent/40" },
  ENTREVISTA:         { label: "ENTREVISTA", className: "bg-primary/20 text-foreground border-primary/40" },
  APROVADO:           { label: "APROVADO",   className: "bg-sidebar text-sidebar-foreground border-sidebar" },
  REPROVADO:          { label: "REPROVADO",  className: "bg-destructive/20 text-foreground border-destructive/40" },
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: companyService.get,
  })

  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const { data: applications = [], isLoading: appsLoading } = useCompanyApplications()

  // Onboarding guard
  useEffect(() => {
    if (company && company.onboardingStep < 5) {
      router.replace(`/onboarding/etapa-${Math.min(company.onboardingStep, 4)}`)
    }
  }, [company, router])

  if (jobsLoading || appsLoading) return <DashboardSkeleton />

  // ── KPIs ──
  const vagasAbertas  = jobs.filter((j) => j.status === "ABERTA").length
  const candidatosAtivos = applications.filter((a) => a.status !== "REPROVADO").length
  const emEntrevista  = applications.filter((a) => a.status === "ENTREVISTA").length
  const aprovadosMes  = applications.filter(
    (a) => a.status === "APROVADO" && isThisMonth(a.createdAt)
  ).length

  const kpis = [
    {
      label: "VAGAS ABERTAS",
      value: vagasAbertas,
      icon: Briefcase,
      trend: { icon: TrendingUp, text: `${jobs.length} vagas no total` },
    },
    {
      label: "CANDIDATOS ATIVOS",
      value: candidatosAtivos,
      icon: Users,
      trend: { icon: TrendingUp, text: `${applications.length} candidaturas` },
    },
    {
      label: "EM ENTREVISTA",
      value: emEntrevista,
      icon: MessageSquare,
      trend: { icon: Clock, text: "na fase de entrevista" },
    },
    {
      label: "APROVADOS ESTE MÊS",
      value: aprovadosMes,
      icon: CheckCircle2,
      trend: { icon: CheckCircle2, text: `${applications.filter((a) => a.status === "APROVADO").length} aprovados no total` },
    },
  ]

  // ── Funnel ──
  const total = applications.length
  const count = (statuses: ApplicationStatus[]) =>
    applications.filter((a) => statuses.includes(a.status)).length

  const funnelStages = [
    { label: "Triagem",       count: total,                                                                  highlight: false },
    { label: "Em Análise",    count: count(["EM_ANALISE","TESTE_PSICOMETRICO","ENTREVISTA","APROVADO"]),      highlight: false },
    { label: "Teste Técnico", count: count(["TESTE_PSICOMETRICO","ENTREVISTA","APROVADO"]),                   highlight: false },
    { label: "Entrevista",    count: count(["ENTREVISTA","APROVADO"]),                                        highlight: false },
    { label: "Oferta",        count: count(["APROVADO"]),                                                     highlight: true  },
  ].map((s) => ({ ...s, pct: total > 0 ? Math.max(Math.round((s.count / total) * 100), s.count > 0 ? 4 : 0) : 0 }))

  // ── Recent activity ──
  const recentActivity = applications.slice(0, 5)

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend.icon
          return (
            <Card key={kpi.label} className="border-secondary/40 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground tabular-nums">
                      {String(kpi.value).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-sidebar" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendIcon className="size-3.5 shrink-0" />
                  {kpi.trend.text}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bento: Funnel + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <Card className="lg:col-span-2 border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Funil de Recrutamento Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            {total === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Nenhuma candidatura ainda.
              </p>
            ) : (
              <div className="flex flex-col gap-3 py-4">
                {funnelStages.map((stage) => (
                  <div key={stage.label} className="relative h-12 flex items-center w-full group">
                    <div className="absolute left-0 h-full w-full rounded-r-full bg-secondary/20" />
                    <div
                      className={cn(
                        "absolute left-0 h-full rounded-r-full flex items-center px-4 transition-all",
                        stage.highlight
                          ? "bg-primary"
                          : "bg-sidebar group-hover:bg-sidebar-accent"
                      )}
                      style={{ width: `${stage.pct}%` }}
                    >
                      <span
                        className={cn(
                          "font-bold text-sm w-32 truncate",
                          stage.highlight ? "text-primary-foreground" : "text-sidebar-foreground"
                        )}
                      >
                        {stage.label}
                      </span>
                      <span
                        className={cn(
                          "ml-auto font-bold text-lg tabular-nums",
                          stage.highlight ? "text-primary-foreground" : "text-sidebar-foreground"
                        )}
                      >
                        {stage.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-secondary/40 shadow-sm flex flex-col">
          <CardHeader className="pb-0 flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold tracking-widest text-foreground uppercase">
              Atividade Recente
            </CardTitle>
            <button className="text-sidebar text-xs hover:underline font-medium">
              Ver todas
            </button>
          </CardHeader>
          <CardContent className="flex-1 pt-4 px-3 pb-3 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade ainda.
              </p>
            ) : (
              <div className="flex flex-col">
                {recentActivity.map((app) => {
                  const cfg = statusConfig[app.status]
                  const name = app.candidate?.nome
                  const role = app.job?.titulo
                  return (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 py-3 border-b border-secondary/20 last:border-0 hover:bg-muted/50 transition-colors rounded-lg px-2"
                    >
                      <Avatar className="size-9 shrink-0">
                        <AvatarFallback className="bg-muted text-foreground text-xs font-bold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {name ?? "—"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {role ?? "—"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold whitespace-nowrap", cfg.className)}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
