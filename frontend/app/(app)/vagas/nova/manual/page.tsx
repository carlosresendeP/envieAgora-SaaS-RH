"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jobService } from "@/services/job.service"
import { organogramaService } from "@/services/organograma.service"
import { createJobSchema, type CreateJobFormValues } from "@/lib/validations/job"

export default function NovaVagaManualPage() {
  const router = useRouter()

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

  async function onSubmit(values: CreateJobFormValues) {
    try {
      const job = await jobService.create({
        titulo: values.titulo,
        descricao: values.descricao,
        requisitos: values.requisitos,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        liderId: values.liderId,
        status: "ABERTA",
      })
      toast.success("Vaga criada com sucesso!")
      router.push(`/vagas/${job.id}`)
    } catch {
      toast.error("Erro ao criar vaga. Tente novamente.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vagas/nova" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Criar Vaga Manualmente</h1>
          <p className="text-sm text-muted-foreground">Preencha todos os detalhes da vaga</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Label htmlFor="requisitos">Requisitos</Label>
          <Textarea
            id="requisitos"
            {...register("requisitos")}
            placeholder="Descreva os requisitos técnicos e habilidades necessárias..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="descricao">Descrição da Vaga</Label>
          <Textarea
            id="descricao"
            {...register("descricao")}
            placeholder="Descreva as responsabilidades, benefícios, cultura da empresa..."
            className="min-h-[200px]"
          />
          {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-secondary/20">
          <Button variant="outline" asChild>
            <Link href="/vagas/nova">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Criando..." : "Criar Vaga"}
          </Button>
        </div>
      </form>
    </div>
  )
}
