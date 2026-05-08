import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface JdPreviewProps {
  value: string
  onChange: (value: string) => void
  isGenerated?: boolean
}

export function JdPreview({ value, onChange, isGenerated = false }: JdPreviewProps) {
  return (
    <div className={cn("rounded-lg transition-all", isGenerated && "ring-2 ring-primary ring-offset-2")}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-h-[400px] resize-none bg-muted/30 text-sm font-mono",
          isGenerated && "border-primary focus-visible:ring-primary"
        )}
        placeholder="A descrição gerada pela IA aparecerá aqui. Você pode editar antes de salvar."
      />
    </div>
  )
}
