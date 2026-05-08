import Link from "next/link"
import { ChevronLeft, FileText, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function NovaVagaPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vagas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nova Vaga</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Escolha como deseja criar a vaga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/vagas/nova/com-ia" className="block group">
          <Card className="border-secondary/40 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/60 h-full cursor-pointer">
            <CardContent className="p-8 flex flex-col gap-4 items-center text-center">
              <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="size-7 text-sidebar" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">Criar com IA</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Descreva o briefing e deixe a IA gerar uma descrição profissional da vaga automaticamente
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Recomendado
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vagas/nova/manual" className="block group">
          <Card className="border-secondary/40 shadow-sm transition-all group-hover:shadow-md group-hover:border-secondary/70 h-full cursor-pointer">
            <CardContent className="p-8 flex flex-col gap-4 items-center text-center">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="size-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">Criar Manualmente</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Escreva você mesmo a descrição e os requisitos da vaga com total controle
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
