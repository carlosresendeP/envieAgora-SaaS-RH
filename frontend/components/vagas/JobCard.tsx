import Link from "next/link"
import { Briefcase, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Job, JobStatus } from "@/types/api"

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

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const cfg = statusConfig[job.status]
  const count = job._count?.applications ?? 0

  return (
    <Link href={`/vagas/${job.id}`} className="block group">
      <Card
        className={cn(
          "border-secondary/40 shadow-sm transition-all group-hover:shadow-md group-hover:border-secondary/70",
          job.status === "PAUSADA" && "opacity-75",
          job.status === "FECHADA" && "opacity-60"
        )}
      >
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground leading-tight line-clamp-2 flex-1">
              {job.titulo}
            </h3>
            <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", cfg.className)}>
              {cfg.label}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <Briefcase className="size-3.5 shrink-0" />
              <span className="truncate">{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Users className="size-3.5" />
              {count} {count === 1 ? "candidatura" : "candidaturas"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
