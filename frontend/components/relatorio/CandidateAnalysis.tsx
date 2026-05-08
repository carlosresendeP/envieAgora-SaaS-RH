import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import type { Application, MatchReport } from "@/types/api"

interface CandidateAnalysisProps {
  application: Application
  onGenerateMatch?: () => void
  isGenerating?: boolean
}

export function CandidateAnalysis({ application, onGenerateMatch, isGenerating }: CandidateAnalysisProps) {
  const report = application.matchResultJson as MatchReport | null

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <p className="text-sm text-muted-foreground max-w-xs">
          Ainda não há análise de IA para este candidato.
        </p>
        {onGenerateMatch && (
          <Button
            onClick={onGenerateMatch}
            disabled={isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar Análise com IA"}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">
            Match Score
          </p>
          <p className="text-4xl font-bold tabular-nums text-primary">{report.matchScore}%</p>
        </div>
        <Badge variant="outline" className="border-primary/40 text-primary text-xs font-bold px-3 py-1">
          #{report.rankingPosition}° no ranking
        </Badge>
      </div>

      <Card className="border-secondary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-widest">Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.resumoExecutivo}</p>
        </CardContent>
      </Card>

      {report.pontosFortes?.length > 0 && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-sidebar">
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.pontosFortes.map((p, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-sm font-semibold">{p.titulo}</p>
                <p className="text-xs text-muted-foreground">{p.descricao}</p>
                {p.impactoNaFuncao && (
                  <p className="text-xs text-sidebar">Impacto: {p.impactoNaFuncao}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {report.pontosAtencao?.length > 0 && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-destructive/80">
              Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.pontosAtencao.map((p, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-sm font-semibold">{p.titulo}</p>
                <p className="text-xs text-muted-foreground">{p.descricao}</p>
                {p.sugestaoDeDesenvolvimento && (
                  <p className="text-xs text-sidebar">Sugestão: {p.sugestaoDeDesenvolvimento}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {report.comoLiderarEsseCandidato && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Como Liderar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-xs font-semibold">Delegação: </span>
              <span className="text-xs text-muted-foreground">{report.comoLiderarEsseCandidato.delegacao}</span>
            </div>
            <div>
              <span className="text-xs font-semibold">Feedback: </span>
              <span className="text-xs text-muted-foreground">{report.comoLiderarEsseCandidato.feedback}</span>
            </div>
            <div>
              <span className="text-xs font-semibold">Motivação: </span>
              <span className="text-xs text-muted-foreground">{report.comoLiderarEsseCandidato.motivacao}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {report.matchComCultura && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Match com Cultura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-xs font-semibold">Alinhamento: </span>
              <span className="text-xs text-muted-foreground">{report.matchComCultura.onde}</span>
            </div>
            <div>
              <span className="text-xs font-semibold">Fricção esperada: </span>
              <span className="text-xs text-muted-foreground">{report.matchComCultura.fricaoEsperada}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {report.perguntasComplementares?.length > 0 && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">
              Perguntas para Entrevista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {report.perguntasComplementares.map((q, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-sidebar shrink-0">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.desafioPratico && (
        <Card className="border-secondary/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest">Desafio Prático</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <p className="text-sm font-semibold">{report.desafioPratico.titulo}</p>
            <p className="text-xs text-muted-foreground">{report.desafioPratico.descricao}</p>
            <p className="text-xs text-muted-foreground">
              Duração estimada: {report.desafioPratico.duracaoEstimada}
            </p>
            {report.desafioPratico.habilidadesAvaliadas?.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {report.desafioPratico.habilidadesAvaliadas.map((h, i) => (
                  <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {h}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
