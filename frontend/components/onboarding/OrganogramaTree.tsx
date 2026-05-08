"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Plus, Trash2, User, ChevronRight } from "lucide-react"
import { organogramaService } from "@/services/organograma.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrganogramaNode } from "@/types/api"

interface NodeFormFields {
  nome: string
  cargo: string
  parentId: string
}

interface TreeNode extends OrganogramaNode {
  children: TreeNode[]
}

function buildTree(nodes: OrganogramaNode[], parentId: string | null = null): TreeNode[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .map((n) => ({ ...n, children: buildTree(nodes, n.id) }))
}

function NodeItem({
  node,
  depth,
  onDelete,
}: {
  node: TreeNode
  depth: number
  onDelete: (id: string) => void
}) {
  return (
    <>
      <div
        className="flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-muted/50 group transition-colors"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
      >
        {depth > 0 && <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />}
        <div className="size-7 rounded-full bg-sidebar/10 flex items-center justify-center shrink-0">
          <User className="size-3.5 text-sidebar" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{node.nome}</p>
          <p className="text-xs text-muted-foreground truncate">{node.cargo}</p>
        </div>
        <button
          onClick={() => onDelete(node.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      {node.children.map((child) => (
        <NodeItem key={child.id} node={child} depth={depth + 1} onDelete={onDelete} />
      ))}
    </>
  )
}

export function OrganogramaTree() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [parentId, setParentId] = useState<string>("")

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ["organograma"],
    queryFn: organogramaService.list,
  })

  const createMutation = useMutation({
    mutationFn: organogramaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organograma"] })
      setOpen(false)
      reset()
      setParentId("")
      toast.success("Posição adicionada!")
    },
    onError: () => toast.error("Erro ao adicionar posição."),
  })

  const deleteMutation = useMutation({
    mutationFn: organogramaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organograma"] })
      toast.success("Posição removida!")
    },
    onError: () => toast.error("Erro ao remover posição."),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NodeFormFields>()

  function onSubmit(values: NodeFormFields) {
    createMutation.mutate({
      nome: values.nome,
      cargo: values.cargo,
      parentId: parentId || null,
    })
  }

  const tree = buildTree(nodes)

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Carregando...</div>
      ) : nodes.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma posição adicionada ainda.
          <br />
          Comece adicionando o CEO ou fundador.
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border/50">
          {tree.map((node) => (
            <NodeItem
              key={node.id}
              node={node}
              depth={0}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 mr-2" />
        Adicionar posição
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova posição</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                NOME
              </Label>
              <Input
                placeholder="Ex: Ana Lima"
                {...register("nome", { required: "Informe o nome" })}
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                CARGO
              </Label>
              <Input
                placeholder="Ex: CTO"
                {...register("cargo", { required: "Informe o cargo" })}
              />
              {errors.cargo && <p className="text-xs text-destructive">{errors.cargo.message}</p>}
            </div>

            {nodes.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  REPORTA PARA (OPCIONAL)
                </Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nível raiz (sem superior)" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.nome} — {n.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
