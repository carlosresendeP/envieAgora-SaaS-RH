"use client"

import { useState } from "react"
import Link from "next/link"
import { Briefcase, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/layout/EmptyState"
import { JobCard } from "@/components/vagas/JobCard"
import { useJobs } from "@/hooks/useJobs"
import type { JobStatus } from "@/types/api"

type Filter = "TODAS" | JobStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: "TODAS",  label: "Todas"    },
  { value: "ABERTA", label: "Abertas"  },
  { value: "PAUSADA", label: "Pausadas" },
  { value: "FECHADA", label: "Fechadas" },
]

function VagasSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}

export default function VagasPage() {
  const [filter, setFilter] = useState<Filter>("TODAS")
  const { data: jobs = [], isLoading } = useJobs()

  const filtered = filter === "TODAS" ? jobs : jobs.filter((j) => j.status === filter)

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vagas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {jobs.length} {jobs.length === 1 ? "vaga cadastrada" : "vagas cadastradas"}
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/vagas/nova">
            <Plus className="size-4 mr-2" />
            Nova Vaga
          </Link>
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="bg-muted/50">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value} className="text-xs font-bold">
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <VagasSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="size-12" />}
          title={filter === "TODAS" ? "Nenhuma vaga cadastrada" : "Nenhuma vaga encontrada"}
          description={
            filter === "TODAS"
              ? "Crie sua primeira vaga para começar a receber candidaturas."
              : `Você não tem vagas com status "${filter.toLowerCase()}".`
          }
          action={
            filter === "TODAS" ? (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/vagas/nova">
                  <Plus className="size-4 mr-2" />
                  Criar Vaga
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
