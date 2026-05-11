"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { X, Plus, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { nodeSchema, type NodeFormValues } from "@/lib/validations/organograma"
import { organogramaService } from "@/services/organograma.service"
import { useOrganograma } from "@/hooks/useOrganograma"
import type { OrganogramaNode } from "@/types/api"

// ── Tree helpers ──────────────────────────────────────────────────────────────

interface TreeNodeData extends OrganogramaNode {
  children: TreeNodeData[]
}

function buildTree(nodes: OrganogramaNode[]): TreeNodeData[] {
  const map = new Map<string, TreeNodeData>()

  for (const node of nodes) {
    map.set(node.id, { ...node, children: [] })
  }

  const roots: TreeNodeData[] = []

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

// ── Panel state ───────────────────────────────────────────────────────────────

type PanelState = null | { mode: "add" } | { mode: "edit"; node: OrganogramaNode }

// ── Depth-based card styles ───────────────────────────────────────────────────

function cardClass(depth: number, selected: boolean): string {
  const base =
    depth === 0
      ? "bg-sidebar text-sidebar-foreground rounded-xl w-56 p-3 shadow-sm border border-sidebar/20"
      : depth === 1
        ? "bg-secondary/20 text-foreground rounded-xl w-52 p-3 shadow-sm border border-secondary/40"
        : "bg-muted text-foreground rounded-xl w-48 p-3 shadow-sm border border-secondary/30"

  return cn(base, selected && "ring-2 ring-primary")
}

// ── TreeNode component ────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: TreeNodeData
  depth: number
  selectedId: string | null
  onSelect: (node: OrganogramaNode) => void
}

function TreeNode({ node, depth, selectedId, onSelect }: TreeNodeProps) {
  const hasChildren = node.children.length > 0
  const isSelected = selectedId === node.id

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <button
        type="button"
        onClick={() => onSelect(node)}
        className={cn(cardClass(depth, isSelected), "text-left cursor-pointer hover:opacity-90 transition-opacity")}
      >
        <p
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase mb-0.5",
            depth === 0 ? "text-sidebar-foreground/70" : "text-muted-foreground",
          )}
        >
          cargo
        </p>
        <p className="font-bold text-sm leading-tight">{node.nome}</p>
        <p className={cn("text-xs mt-0.5", depth === 0 ? "text-sidebar-foreground/80" : "text-muted-foreground")}>
          {node.cargo}
        </p>
      </button>

      {/* Children */}
      {hasChildren && (
        <>
          {/* Vertical stem from card to horizontal bus */}
          <div className="w-px h-6 bg-secondary/40" />

          {/* Children row */}
          <div className="flex items-start">
            {node.children.map((child, idx) => {
              const isFirst = idx === 0
              const isLast = idx === node.children.length - 1
              const isOnly = node.children.length === 1

              return (
                <div key={child.id} className="relative pt-6 px-4 flex flex-col items-center">
                  {/* Horizontal bus — skip when only child */}
                  {!isOnly && (
                    <div
                      className="absolute top-0 h-px bg-secondary/40"
                      style={{
                        left: isFirst ? "50%" : "0",
                        right: isLast ? "50%" : "0",
                      }}
                    />
                  )}
                  {/* Vertical drop */}
                  <div className="absolute top-0 left-1/2 -translate-x-px w-px h-6 bg-secondary/40" />

                  <TreeNode
                    node={child}
                    depth={depth + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function OrganogramaSkeleton() {
  return (
    <div className="flex justify-center py-8 px-8 min-w-max gap-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-20 w-56 rounded-xl" />
        <div className="flex gap-6">
          <Skeleton className="h-20 w-52 rounded-xl" />
          <Skeleton className="h-20 w-52 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// ── Right panel form ──────────────────────────────────────────────────────────

interface PanelFormProps {
  panelState: PanelState
  nodes: OrganogramaNode[]
  onClose: () => void
}

function PanelForm({ panelState, nodes, onClose }: PanelFormProps) {
  const queryClient = useQueryClient()

  const editNode = panelState?.mode === "edit" ? panelState.node : null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NodeFormValues>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      nome: editNode?.nome ?? "",
      cargo: editNode?.cargo ?? "",
      parentId: editNode?.parentId ?? null,
    },
  })

  const createNode = useMutation({
    mutationFn: (values: NodeFormValues) =>
      organogramaService.create({
        nome: values.nome,
        cargo: values.cargo,
        parentId: values.parentId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organograma"] })
      toast.success("Posição criada com sucesso!")
      reset()
      onClose()
    },
    onError: () => toast.error("Erro ao criar posição."),
  })

  const updateNode = useMutation({
    mutationFn: (values: NodeFormValues) =>
      organogramaService.update(editNode!.id, {
        nome: values.nome,
        cargo: values.cargo,
        parentId: values.parentId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organograma"] })
      toast.success("Posição atualizada com sucesso!")
      onClose()
    },
    onError: () => toast.error("Erro ao atualizar posição."),
  })

  const deleteNode = useMutation({
    mutationFn: () => organogramaService.delete(editNode!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organograma"] })
      toast.success("Posição removida com sucesso!")
      onClose()
    },
    onError: () => toast.error("Erro ao remover posição."),
  })

  const isEdit = panelState?.mode === "edit"
  const isPending = createNode.isPending || updateNode.isPending || deleteNode.isPending

  function onSubmit(values: NodeFormValues) {
    const normalized = { ...values, parentId: values.parentId || null }
    if (isEdit) {
      updateNode.mutate(normalized)
    } else {
      createNode.mutate(normalized)
    }
  }

  return (
    <div className="w-80 flex flex-col border-l border-secondary/40 bg-background h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-secondary/40">
        <h2 className="font-semibold text-sm text-foreground">
          {isEdit ? "Editar Posição" : "Adicionar Posição"}
        </h2>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-1 px-5 py-4 space-y-4">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="text-xs font-semibold text-foreground">
              Nome
            </Label>
            <Input
              id="nome"
              placeholder="Ex: João Silva"
              className="bg-muted/40 border-secondary/40 focus-visible:ring-primary"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          {/* Cargo */}
          <div className="space-y-1.5">
            <Label htmlFor="cargo" className="text-xs font-semibold text-foreground">
              Cargo
            </Label>
            <Input
              id="cargo"
              placeholder="Ex: Gerente de RH"
              className="bg-muted/40 border-secondary/40 focus-visible:ring-primary"
              {...register("cargo")}
            />
            {errors.cargo && (
              <p className="text-xs text-destructive">{errors.cargo.message}</p>
            )}
          </div>

          {/* Reporta a */}
          <div className="space-y-1.5">
            <Label htmlFor="parentId" className="text-xs font-semibold text-foreground">
              Reporta a
            </Label>
            <select
              id="parentId"
              className="w-full h-9 rounded-md border border-secondary/40 bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
              {...register("parentId")}
            >
              <option value="">Nenhum (Raiz)</option>
              {nodes
                .filter((n) => !isEdit || n.id !== editNode?.id)
                .map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nome} — {n.cargo}
                  </option>
                ))}
            </select>
            {errors.parentId && (
              <p className="text-xs text-destructive">{errors.parentId.message}</p>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-5 py-4 border-t border-secondary/40 space-y-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>

          {isEdit && (
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteNode.mutate()}
            >
              Excluir
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrganogramaPage() {
  const { data: nodes = [], isLoading } = useOrganograma()
  const [panelState, setPanelState] = useState<PanelState>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const treeRoots = buildTree(nodes)

  function handleSelectNode(node: OrganogramaNode) {
    setSelectedId(node.id)
    setPanelState({ mode: "edit", node })
  }

  function handleAddClick() {
    setSelectedId(null)
    setPanelState({ mode: "add" })
  }

  function handleClosePanel() {
    setPanelState(null)
    setSelectedId(null)
  }

  return (
    <div className="flex h-full -m-6 overflow-hidden">
      {/* Canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/40 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organograma</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nodes.length} {nodes.length === 1 ? "posição cadastrada" : "posições cadastradas"}
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4 mr-2" />
            Adicionar Posição
          </Button>
        </div>

        {/* Tree canvas */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <OrganogramaSkeleton />
          ) : nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <Network className="size-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Nenhum cargo cadastrado ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Comece criando a primeira posição do organograma.
                </p>
              </div>
              <Button
                onClick={handleAddClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-4 mr-2" />
                Adicionar primeiro cargo
              </Button>
            </div>
          ) : (
            <div className="flex justify-center py-8 px-8 min-w-max">
              <div className="flex gap-12">
                {treeRoots.map((root) => (
                  <TreeNode
                    key={root.id}
                    node={root}
                    depth={0}
                    selectedId={selectedId}
                    onSelect={handleSelectNode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      {panelState !== null && (
        <PanelForm
          panelState={panelState}
          nodes={nodes}
          onClose={handleClosePanel}
        />
      )}
    </div>
  )
}
