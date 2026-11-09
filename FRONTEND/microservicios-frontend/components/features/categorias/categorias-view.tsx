"use client"

import { useMemo, useState } from "react"
import { PencilIcon, PlusIcon, TagsIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ActiveBadge } from "@/components/shared/badges"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Field, SearchInput, Switch } from "@/components/shared/form"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"
import {
  useCategorias,
  useDeleteCategoria,
  useProductos,
  useSaveCategoria,
} from "@/hooks/queries/use-inventario"
import type { Categoria, CategoriaPayload } from "@/lib/api/types"
import { formatDate, normalize } from "@/lib/format"

export function CategoriasView() {
  const { data: categorias = [], isPending, isError, error, refetch } = useCategorias()
  const { data: productos = [] } = useProductos()
  const deleteMutation = useDeleteCategoria()

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [toDelete, setToDelete] = useState<Categoria | null>(null)

  const conteo = useMemo(() => {
    const map = new Map<number, number>()
    productos.forEach((p) => map.set(p.categoriaId, (map.get(p.categoriaId) ?? 0) + 1))
    return map
  }, [productos])

  const filtered = useMemo(() => {
    const term = normalize(search.trim())
    if (!term) return categorias
    return categorias.filter((c) => normalize(`${c.nombre} ${c.descripcion}`).includes(term))
  }, [categorias, search])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const columns: Column<Categoria>[] = [
    {
      key: "nombre",
      header: "Categoría",
      cell: (c) => (
        <div className="flex flex-col">
          <span className="font-medium">{c.nombre}</span>
          <span className="line-clamp-1 max-w-md text-xs text-muted-foreground">{c.descripcion}</span>
        </div>
      ),
    },
    {
      key: "productos",
      header: "Productos",
      className: "text-right tabular-nums",
      cell: (c) => conteo.get(c.categoriaId) ?? 0,
    },
    { key: "estado", header: "Estado", cell: (c) => <ActiveBadge active={c.activo} /> },
    {
      key: "fecha",
      header: "Actualización",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (c) => formatDate(c.fechaCreacion),
    },
    {
      key: "acciones",
      header: "",
      className: "w-px text-right",
      cell: (c) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${c.nombre}`}
            onClick={() => {
              setEditing(c)
              setFormOpen(true)
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${c.nombre}`}
            className="text-destructive hover:text-destructive"
            onClick={() => setToDelete(c)}
          >
            <Trash2Icon />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Clasificación del equipo de protección personal · Microservicio Inventario"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon /> Nueva categoría
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Buscar categoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar categoría"
          />
          <span className="text-sm text-muted-foreground">
            {filtered.length} de {categorias.length} categorías
          </span>
        </div>
        {isPending ? (
          <TableSkeleton cols={4} />
        ) : isError ? (
          <ErrorState error={error} service="Inventario" onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={TagsIcon}
            title={search ? "Sin resultados" : "Aún no hay categorías"}
            description={search ? "Prueba con otro término de búsqueda." : "Crea la primera categoría para clasificar tus productos."}
          />
        ) : (
          <DataTable columns={columns} rows={filtered} rowKey={(c) => c.categoriaId} />
        )}
      </Card>

      <CategoriaFormDialog
        key={editing?.categoriaId ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        categoria={editing}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Eliminar categoría"
        description={`¿Seguro que deseas eliminar "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
        onConfirm={() =>
          toDelete && deleteMutation.mutate(toDelete.categoriaId, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  )
}

function CategoriaFormDialog({
  open,
  onOpenChange,
  categoria,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria: Categoria | null
}) {
  const saveMutation = useSaveCategoria()
  const [form, setForm] = useState<CategoriaPayload>({
    nombre: categoria?.nombre ?? "",
    descripcion: categoria?.descripcion ?? "",
    activo: categoria?.activo ?? true,
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(
      { id: categoria?.categoriaId, payload: { ...form, nombre: form.nombre.trim(), descripcion: form.descripcion.trim() } },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{categoria ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
            <DialogDescription>Los campos marcados con * son obligatorios.</DialogDescription>
          </DialogHeader>
          <Field label="Nombre" htmlFor="cat-nombre" required>
            <Input
              id="cat-nombre"
              required
              maxLength={100}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Protección ocular"
            />
          </Field>
          <Field label="Descripción" htmlFor="cat-descripcion" required>
            <Textarea
              id="cat-descripcion"
              required
              maxLength={255}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="¿Qué tipo de equipo agrupa esta categoría?"
            />
          </Field>
          <Switch
            id="cat-activo"
            checked={form.activo}
            onCheckedChange={(activo) => setForm({ ...form, activo })}
            label="Categoría activa"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Spinner />}
              {categoria ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
