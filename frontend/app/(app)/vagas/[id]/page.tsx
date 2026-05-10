"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ChevronLeft,
  Copy,
  HelpCircle,
  Brain,
  Link2,
  Pencil,
  SendHorizonal,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RankingSidebar } from "@/components/relatorio/RankingSidebar"
import { CandidateAnalysis } from "@/components/relatorio/CandidateAnalysis"
import { useJob } from "@/hooks/useJobs"
import { useJobApplications } from "@/hooks/useApplications"
import { useOrganograma } from "@/hooks/useOrganograma"
import { jobService } from "@/services/job.service"
import { applicationService } from "@/services/application.service"
import { candidateService } from "@/services/candidate.service"
import { cn } from "@/lib/utils"
import type { Application, Job, JobStatus } from "@/types/api"

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  ABERTA:  { label: "ABERTA",  className: "bg-secondary/20 text-sidebar border-secondary/40" },
  PAUSADA: { label: "PAUSADA", className: "bg-muted text-muted-foreground border-border" },
  FECHADA: { label: "FECHADA", className: "bg-destructive/20 text-foreground border-destructive/40" },
}

function formatSalary(min?: string | null, max?: string | null): string {
  if (!min && !max) return "A combinar"
  const fmt = (v: string) => `R$ ${Number(v).toLocaleString("pt-BR")}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `A partir de ${fmt(min)}`
  return `Até ${fmt(max!)}`
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado!`))
}

// ─── Edit schema ───────────────────────────────────────────────────────────────

const editSchema = z.object({
  titulo:    z.string().min(3, "Mínimo 3 caracteres"),
  descricao: z.string().optional(),
  requisitos: z.string().optional(),
  salaryMin: z.coerce.number().positive().optional().or(z.literal("")),
  salaryMax: z.coerce.number().positive().optional().or(z.literal("")),
  status:    z.enum(["ABERTA", "PAUSADA", "FECHADA"]),
  liderId:   z.string().optional(),
})

type EditForm = z.infer<typeof editSchema>

// ─── EditJobSheet ──────────────────────────────────────────────────────────────

function EditJobSheet({
  job,
  open,
  onClose,
}: {
  job: Job
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { data: nodes = [] } = useOrganograma()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      titulo:     job.titulo,
      descricao:  job.descricao ?? "",
      requisitos: job.requisitos ?? "",
      salaryMin:  job.salaryMin ? Number(job.salaryMin) : "",
      salaryMax:  job.salaryMax ? Number(job.salaryMax) : "",
      status:     job.status,
      liderId:    job.liderId ?? "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: EditForm) =>
      jobService.update(job.id, {
        titulo:     data.titulo,
        descricao:  data.descricao || undefined,
        requisitos: data.requisitos || undefined,
        salaryMin:  data.salaryMin !== "" ? Number(data.salaryMin) : undefined,
        salaryMax:  data.salaryMax !== "" ? Number(data.salaryMax) : undefined,
        status:     data.status,
        liderId:    data.liderId || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", job.id] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Vaga atualizada!")
      onClose()
    },
    onError: () => toast.error("Erro ao atualizar vaga."),
  })

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Editar Vaga</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4 px-4">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título *</Label>
            <Input id="titulo" {...register("titulo")} />
            {errors.titulo && (
              <p className="text-xs text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) => setValue("status", v as JobStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABERTA">Aberta</SelectItem>
                <SelectItem value="PAUSADA">Pausada</SelectItem>
                <SelectItem value="FECHADA">Fechada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salários */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Salário mínimo (R$)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="Ex: 3000"
                {...register("salaryMin")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Salário máximo (R$)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="Ex: 6000"
                {...register("salaryMax")}
              />
            </div>
          </div>

          {/* Líder */}
          <div className="space-y-1.5">
            <Label>Líder responsável</Label>
            <Select
              value={watch("liderId") ?? ""}
              onValueChange={(v) => setValue("liderId", v === "none" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um líder (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {nodes.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.nome} — {n.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={5}
              placeholder="Descrição da vaga..."
              {...register("descricao")}
            />
          </div>

          {/* Requisitos */}
          <div className="space-y-1.5">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              rows={4}
              placeholder="Requisitos da vaga..."
              {...register("requisitos")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// ─── Add candidate schema ─────────────────────────────────────────────────────

const addCandidateSchema = z.object({
  nome:         z.string().min(3, "Mínimo 3 caracteres"),
  email:        z.string().email("E-mail inválido"),
  telefone:     z.string().optional(),
  curriculoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  linkedinUrl:  z.string().url("URL inválida").optional().or(z.literal("")),
})

type AddCandidateForm = z.infer<typeof addCandidateSchema>

function AddCandidateSheet({
  jobId,
  open,
  onClose,
}: {
  jobId: string
  open: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCandidateForm>({ resolver: zodResolver(addCandidateSchema) })

  const addMutation = useMutation({
    mutationFn: (data: AddCandidateForm) =>
      candidateService.apply({
        jobId,
        nome:         data.nome,
        email:        data.email,
        telefone:     data.telefone || undefined,
        curriculoUrl: data.curriculoUrl || undefined,
        linkedinUrl:  data.linkedinUrl || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "job", jobId] })
      toast.success("Candidato adicionado com sucesso!")
      reset()
      onClose()
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
      const msg = err?.response?.data?.error ?? "Erro ao adicionar candidato."
      toast.error(msg)
    },
  })

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Adicionar Candidato Manualmente</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit((d) => addMutation.mutate(d))} className="space-y-4 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="add-nome">Nome completo *</Label>
            <Input id="add-nome" placeholder="Ex: João Silva" {...register("nome")} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-email">E-mail *</Label>
            <Input id="add-email" type="email" placeholder="candidato@email.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-telefone">Telefone</Label>
            <Input id="add-telefone" placeholder="(11) 99999-9999" {...register("telefone")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-curriculo">URL do Currículo (PDF)</Label>
            <Input id="add-curriculo" placeholder="https://..." {...register("curriculoUrl")} />
            {errors.curriculoUrl && <p className="text-xs text-destructive">{errors.curriculoUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-linkedin">LinkedIn</Label>
            <Input id="add-linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
            {errors.linkedinUrl && <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {addMutation.isPending ? "Adicionando..." : "Adicionar Candidato"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VagaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [testLinks, setTestLinks] = useState<Record<string, string>>({})
  const [editOpen, setEditOpen] = useState(false)
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const analysisRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedApp) return
    function onMouseDown(e: MouseEvent) {
      if (analysisRef.current && !analysisRef.current.contains(e.target as Node)) {
        setSelectedApp(null)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [selectedApp])

  const { data: job, isLoading: jobLoading } = useJob(id)
  const { data: applications = [], isLoading: appsLoading } = useJobApplications(id)

  const generateMatchMutation = useMutation({
    mutationFn: () => jobService.generateMatch(id, selectedApp!.candidateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applications", "job", id] })
      const updated = queryClient
        .getQueryData<Application[]>(["applications", "job", id])
        ?.find((a) => a.id === selectedApp?.id)
      if (updated) setSelectedApp(updated)
      toast.success("Análise gerada com sucesso!")
    },
    onError: () => toast.error("Erro ao gerar análise. Tente novamente."),
  })

  const generateTestLinkMutation = useMutation({
    mutationFn: (appId: string) => applicationService.createTestLink(appId),
    onSuccess: (data, appId) => {
      setTestLinks((prev) => ({ ...prev, [appId]: data.url }))
      copyToClipboard(data.url, "Link do teste")
    },
    onError: () => toast.error("Erro ao gerar link. Tente novamente."),
  })

  if (jobLoading || appsLoading) return <PageSkeleton />

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Link href="/vagas" className="text-sm text-sidebar hover:underline">
          Voltar para vagas
        </Link>
      </div>
    )
  }

  const cfg = statusConfig[job.status]
  const description = job.jdGerada || job.descricao
  const publicUrl = job.publicToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/candidatar/${job.publicToken}`
    : null

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/vagas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{job.titulo}</h1>
            <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {formatSalary(job.salaryMin, job.salaryMax)}
            {job.lider && (
              <span className="ml-3 inline-flex items-center gap-1">
                <User className="size-3" />
                {job.lider.nome} — {job.lider.cargo}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Editar vaga */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="gap-2"
          >
            <Pencil className="size-4" />
            Editar
          </Button>

          {/* Adicionar candidato manualmente */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddCandidateOpen(true)}
            className="gap-2"
          >
            <UserPlus className="size-4" />
            Adicionar Candidato
          </Button>

          {/* Link público de candidatura */}
          {publicUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(publicUrl, "Link da vaga")}
              className="gap-2"
            >
              <Link2 className="size-4" />
              Copiar Link Público
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — job info + candidate analysis */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-secondary/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              {description ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sem descrição cadastrada.</p>
              )}
            </CardContent>
          </Card>

          {job.requisitos && (
            <Card className="border-secondary/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest">Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.requisitos}
                </p>
              </CardContent>
            </Card>
          )}

          {job.perfilIdealJson && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-secondary/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle className="size-3.5 text-sidebar" />
                    Perguntas de Triagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {job.perfilIdealJson.perguntasTriagem.map((q, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-sidebar font-bold shrink-0">{i + 1}.</span>
                        <span className="text-muted-foreground">{q}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-secondary/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Brain className="size-3.5 text-sidebar" />
                    Perfil Psicométrico Ideal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-xs font-semibold">DISC: </span>
                    <span className="text-xs text-muted-foreground">{job.perfilIdealJson.perfilPsicometricoIdeal.disc}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold">Eneagrama: </span>
                    <span className="text-xs text-muted-foreground">{job.perfilIdealJson.perfilPsicometricoIdeal.eneagrama}</span>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {job.perfilIdealJson.perfilPsicometricoIdeal.tracosPrincipais.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>

        {/* Right — ranking sidebar */}
        <Card className="border-secondary/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="size-4" />
              Candidatos ({applications.length})
            </CardTitle>
          </CardHeader>
          {applications.length > 0 && (
            <div className="px-4 pb-1">
              <p className="text-[11px] text-muted-foreground bg-muted/60 rounded-lg px-3 py-2 text-center leading-relaxed">
                Clique sobre o candidato para gerar uma análise de IA
              </p>
            </div>
          )}
          <CardContent className="px-3 pb-3">
            <RankingSidebar
              applications={applications}
              selectedId={selectedApp?.id}
              onSelect={setSelectedApp}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit sheet */}
      <EditJobSheet job={job} open={editOpen} onClose={() => setEditOpen(false)} />

      {/* Add candidate sheet */}
      <AddCandidateSheet jobId={id} open={addCandidateOpen} onClose={() => setAddCandidateOpen(false)} />

      {/* Floating analysis panel — appears over left content, sidebar stays visible */}
      {selectedApp && (
        <div
          ref={analysisRef}
          className="fixed top-0 left-0 bottom-0 z-50 w-full lg:w-[65vw] bg-background border-r border-border shadow-2xl flex flex-col"
        >
          {/* Sticky header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-background">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                Análise de Candidatura
              </p>
              <h3 className="font-bold text-base leading-tight">
                {selectedApp.candidate?.nome ?? "Candidato"}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {testLinks[selectedApp.id] ? (
                <button
                  onClick={() => copyToClipboard(testLinks[selectedApp.id], "Link do teste")}
                  className="flex items-center gap-1.5 text-xs text-sidebar hover:underline"
                >
                  <Copy className="size-3.5" />
                  Copiar link do teste
                </button>
              ) : (
                <button
                  onClick={() => generateTestLinkMutation.mutate(selectedApp.id)}
                  disabled={generateTestLinkMutation.isPending}
                  className="flex items-center gap-1.5 text-xs text-sidebar hover:underline disabled:opacity-50"
                >
                  <SendHorizonal className="size-3.5" />
                  {generateTestLinkMutation.isPending ? "Gerando..." : "Gerar link de teste"}
                </button>
              )}
              <button
                onClick={() => setSelectedApp(null)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <CandidateAnalysis
              application={selectedApp}
              onGenerateMatch={() => generateMatchMutation.mutate()}
              isGenerating={generateMatchMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  )
}
