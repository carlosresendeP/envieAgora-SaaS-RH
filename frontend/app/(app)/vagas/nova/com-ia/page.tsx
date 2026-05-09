"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JdPreview } from "@/components/vagas/JdPreview"
import { jobService } from "@/services/job.service"
import { organogramaService } from "@/services/organograma.service"
import { createJobSchema, type CreateJobFormValues } from "@/lib/validations/job"

export default function NovaVagaComIaPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "preview">("form")
  const [jobId, setJobId] = useState<string | null>(null)
  const [jdContent, setJdContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { data: nodes = [] } = useQuery({
    queryKey: ["organograma"],
    queryFn: organogramaService.list,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
  })

  async function onSubmitBriefing(values: CreateJobFormValues) {
    setIsGenerating(true)
    try {
      const job = await jobService.create({
        titulo: values.titulo,
        requisitos: values.requisitos,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        liderId: values.liderId,
        status: "ABERTA",
      })
      setJobId(job.id)
      const jd = await jobService.generateJd(job.id)
      setJdContent(jd)
      setStep("preview")
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Erro ao gerar descrição. Tente novamente."
      console.error("[generateJd]", err)
      toast.error(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSaveJd() {
    if (!jobId) return
    setIsSaving(true)
    try {
      await jobService.update(jobId, { descricao: jdContent })
      toast.success("Vaga criada com sucesso!")
      router.push(`/vagas/${jobId}`)
    } catch {
      toast.error("Erro ao salvar. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  if (step === "preview") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("form")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Descrição Gerada pela IA</h1>
            <p className="text-sm text-muted-foreground">Revise e edite antes de salvar</p>
          </div>
        </div>

        <JdPreview value={jdContent} onChange={setJdContent} isGenerated />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setStep("form")}>
            Voltar
          </Button>
          <Button
            onClick={handleSaveJd}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? "Salvando..." : "Salvar Vaga"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vagas/nova" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Criar Vaga com IA</h1>
          <p className="text-sm text-muted-foreground">Preencha o briefing para gerar a descrição automaticamente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitBriefing)} className="grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título da Vaga *</Label>
            <Input id="titulo" {...register("titulo")} placeholder="Ex: Desenvolvedor Full Stack Sênior" />
            {errors.titulo && <p className="text-xs text-destructive">{errors.titulo.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Salário Mínimo</Label>
              <Input id="salaryMin" {...register("salaryMin")} type="number" min="0" placeholder="5000" />
              {errors.salaryMin && <p className="text-xs text-destructive">{errors.salaryMin.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Salário Máximo</Label>
              <Input id="salaryMax" {...register("salaryMax")} type="number" min="0" placeholder="8000" />
              {errors.salaryMax && <p className="text-xs text-destructive">{errors.salaryMax.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Líder Responsável</Label>
            <Select onValueChange={(v) => setValue("liderId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o líder (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.nome} — {node.cargo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="requisitos">Requisitos e Briefing</Label>
            <Textarea
              id="requisitos"
              {...register("requisitos")}
              placeholder="Descreva os requisitos técnicos, responsabilidades, perfil ideal do candidato..."
              className="min-h-[180px]"
            />
          </div>
        </div>

        {/* Right — AI preview placeholder */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[280px]">
            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="size-6 text-sidebar" />
            </div>
            <div>
              <p className="font-bold text-foreground">Descrição Mágica</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[220px]">
                Após preencher o briefing, a IA irá gerar uma descrição profissional baseada nas informações fornecidas.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex justify-end gap-3 border-t border-secondary/20 pt-4">
          <Button variant="outline" asChild>
            <Link href="/vagas/nova">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={isGenerating || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4 mr-2" />
            {isGenerating ? "Gerando descrição..." : "Gerar Descrição com IA"}
          </Button>
        </div>
      </form>
    </div>
  )
}
