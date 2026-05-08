"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Application } from "@/types/api"

function getInitials(name?: string): string {
  if (!name) return "?"
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("")
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-sidebar"
  return "text-muted-foreground"
}

interface RankingSidebarProps {
  applications: Application[]
  selectedId?: string
  onSelect: (app: Application) => void
}

export function RankingSidebar({ applications, selectedId, onSelect }: RankingSidebarProps) {
  const ranked = [...applications]
    .filter((a) => a.matchScore !== null)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

  const unranked = applications.filter((a) => a.matchScore === null)

  if (applications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhuma candidatura ainda.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      {ranked.map((app, i) => (
        <button
          key={app.id}
          onClick={() => onSelect(app)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-left transition-colors w-full",
            selectedId === app.id
              ? "bg-sidebar text-sidebar-foreground"
              : "hover:bg-muted/50"
          )}
        >
          <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">
            #{i + 1}
          </span>
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-muted text-xs font-bold">
              {getInitials(app.candidate?.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-semibold truncate",
              selectedId === app.id ? "text-sidebar-foreground" : "text-foreground"
            )}>
              {app.candidate?.nome ?? "—"}
            </p>
            <p className={cn(
              "text-xs truncate",
              selectedId === app.id ? "text-sidebar-foreground/70" : "text-muted-foreground"
            )}>
              {app.status.replace("_", " ")}
            </p>
          </div>
          <span className={cn("text-sm font-bold tabular-nums shrink-0", scoreColor(app.matchScore ?? 0))}>
            {app.matchScore}%
          </span>
        </button>
      ))}

      {unranked.length > 0 && (
        <>
          {ranked.length > 0 && <div className="h-px bg-secondary/20 my-2" />}
          {unranked.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelect(app)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-left transition-colors w-full",
                selectedId === app.id
                  ? "bg-sidebar text-sidebar-foreground"
                  : "hover:bg-muted/50"
              )}
            >
              <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">—</span>
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-bold">
                  {getInitials(app.candidate?.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-semibold truncate",
                  selectedId === app.id ? "text-sidebar-foreground" : "text-foreground"
                )}>
                  {app.candidate?.nome ?? "—"}
                </p>
                <p className={cn(
                  "text-xs truncate",
                  selectedId === app.id ? "text-sidebar-foreground/70" : "text-muted-foreground"
                )}>
                  Sem análise
                </p>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  )
}
