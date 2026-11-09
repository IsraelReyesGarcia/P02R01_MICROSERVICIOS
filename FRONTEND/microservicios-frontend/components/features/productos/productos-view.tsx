"use client"

import { useMemo, useState } from "react"
import { PackageIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

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
import { ActiveBadge, StockBadge } from "@/components/shared/badges"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Field, NativeSelect, SearchInput, Switch } from "@/components/shared/form"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"
import { StockMeter } from "@/components/shared/stock-meter"
import {
  useCategorias,
  useDeleteProducto,
  useProductos,
  useSaveProducto,
} from "@/hooks/queries/use-inventario"
import type { Categoria, Producto, ProductoPayload } from "@/lib/api/types"
import { formatCurrency, getStockLevel, normalize, type StockLevel } from "@/lib/format"

type StockFilter = "todos" | StockLevel

export function ProductosView() {
  const { data: productos = [], isPending, isError, error, refetch } = useProductos()
  const { data: categorias = [] } = useCategorias()
  const deleteMutation = useDeleteProducto()

  const [search, setSearch] = useState("")
  const [categoriaId, setCategoriaId] = useState("0")
  const [stockFilter, setStockFilter] = useState<StockFilter>("todos")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [toDelete, setToDelete] = useState<Producto | null>(null)

  const filtered = useMemo(() => {
    const term = normalize(search.trim())
    return productos.filter((p) => {
      if (categoriaId !== "0" && p.categoriaId !== Number(categoriaId)) return false
      if (stockFilter !== "todos" && getStockLevel(p) !== stockFilter) return false
      if (!term) return true
      return normalize(`${p.codigo} ${p.nombre} ${p.marca} ${p.descripcion}`).includes(term)
    })
  }, [productos, search, categoriaId, stockFilter])

  const columns: Column<Producto>[] = [
    {
      key: "producto",
      header: "Producto",
      cell: (p) => (
        <div className="flex min-w-48 flex-col">
          <span className="font-medium">{p.nombre}</span>
          <span className="font-mono text-xs text-muted-foreground">{p.codigo}</span>
        </div>
      ),
    },
    {
      key: "categoria",
      header: "Categoría",
      className: "whitespace-nowrap",
      cell: (p) => p.categoriaNombre || "—",
    },
    {
      key: "marca",
      header: "Marca / Talla",
      className: "whitespace-nowrap",
      cell: (p) => (
        <div className="flex flex-col">
          <span>{p.marca || "—"}</span>
          <span className="text-xs text-muted-foreground">{p.talla || "—"}</span>
        </div>
      ),
    },
    { key: "stock", header: "Stock", cell: (p) => <StockMeter producto={p} /> },
    { key: "nivel", header: "Nivel", cell: (p) => <StockBadge level={getStockLevel(p)} /> },
    {
      key: "precio",
      header: "Precio",
      className: "text-right tabular-nums whitespace-nowrap",
      cell: (p) => formatCurrency(p.precio),
    },
    { key: "estado", header: "Estado", cell: (p) => <ActiveBadge active={p.activo} /> },
    {
      key: "acciones",
      header: "",
      className: "w-px text-right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${p.nombre}`}
            onClick={() => {
              setEditing(p)
              setFormOpen(true)
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${p.nombre}`}
            className="text-destructive hover:text-destructive"
            onClick={() => setToDelete(p)}
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
        title="Productos"
        description="Catálogo de EPP y existencias en almacén · Microservicio Inventario"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <PlusIcon /> Nuevo producto
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <SearchInput
            placeholder="Buscar por código, nombre o marca…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar producto"
          />
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <NativeSelect
              aria-label="Filtrar por categoría"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="sm:w-52"
            >
              <option value="0">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.categoriaId} value={c.categoriaId}>
                  {c.nombre}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              aria-label="Filtrar por nivel de stock"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              className="sm:w-40"
            >
              <option value="todos">Todo el stock</option>
              <option value="normal">Disponible</option>
              <option value="bajo">Stock bajo</option>
              <option value="agotado">Agotado</option>
            </NativeSelect>
          </div>
          <span className="text-sm text-muted-foreground lg:ml-auto">
            {filtered.length} de {productos.length} productos
          </span>
        </div>
        {isPending ? (
          <TableSkeleton cols={6} />
        ) : isError ? (
          <ErrorState error={error} service="Inventario" onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={PackageIcon}
            title={productos.length ? "Sin resultados" : "Aún no hay productos"}
            description={
              productos.length
                ? "Ajusta la búsqueda o los filtros."
                : "Registra el primer producto de EPP en el inventario."
            }
          />
        ) : (
          <DataTable columns={columns} rows={filtered} rowKey={(p) => p.productoId} />
        )}
      </Card>

      <ProductoFormDialog
        key={editing?.productoId ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        producto={editing}
        categorias={categorias}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Eliminar producto"
        description={`¿Seguro que deseas eliminar "${toDelete?.nombre}" (${toDelete?.codigo})? Esta acción no se puede deshacer.`}
        loading={deleteMutation.isPending}
        onConfirm={() =>
          toDelete && deleteMutation.mutate(toDelete.productoId, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  )
}

function ProductoFormDialog({
  open,
  onOpenChange,
  producto,
  categorias,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  categorias: Categoria[]
}) {
  const saveMutation = useSaveProducto()
  const [form, setForm] = useState<ProductoPayload>({
    categoriaId: producto?.categoriaId ?? 0,
    codigo: producto?.codigo ?? "",
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    marca: producto?.marca ?? "",
    talla: producto?.talla ?? "",
    stockActual: producto?.stockActual ?? 0,
    stockMaximo: producto?.stockMaximo ?? 0,
    precio: producto?.precio ?? 0,
    activo: producto?.activo ?? true,
  })

  const set = <K extends keyof ProductoPayload>(key: K, value: ProductoPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(
      {
        id: producto?.productoId,
        payload: { ...form, codigo: form.codigo.trim().toUpperCase(), nombre: form.nombre.trim() },
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{producto ? "Editar producto" : "Nuevo producto"}</DialogTitle>
            <DialogDescription>
              {producto
                ? "Para registrar entradas o salidas usa el módulo de Movimientos."
                : "Los campos marcados con * son obligatorios."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código" htmlFor="prod-codigo" required>
              <Input
                id="prod-codigo"
                required
                maxLength={20}
                value={form.codigo}
                onChange={(e) => set("codigo", e.target.value)}
                placeholder="EPP-CAB-001"
                className="font-mono uppercase"
              />
            </Field>
            <Field label="Categoría" htmlFor="prod-categoria" required>
              <NativeSelect
                id="prod-categoria"
                required
                value={form.categoriaId || ""}
                onChange={(e) => set("categoriaId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((c) => (
                  <option key={c.categoriaId} value={c.categoriaId}>
                    {c.nombre}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Nombre" htmlFor="prod-nombre" required className="sm:col-span-2">
              <Input
                id="prod-nombre"
                required
                maxLength={150}
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Ej. Casco de seguridad tipo I clase E"
              />
            </Field>
            <Field label="Descripción" htmlFor="prod-descripcion" className="sm:col-span-2">
              <Textarea
                id="prod-descripcion"
                maxLength={500}
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
              />
            </Field>
            <Field label="Marca" htmlFor="prod-marca">
              <Input id="prod-marca" maxLength={100} value={form.marca} onChange={(e) => set("marca", e.target.value)} />
            </Field>
            <Field label="Talla" htmlFor="prod-talla">
              <Input
                id="prod-talla"
                maxLength={20}
                value={form.talla}
                onChange={(e) => set("talla", e.target.value)}
                placeholder="Unitalla, M, 27…"
              />
            </Field>
            <Field label="Stock actual" htmlFor="prod-stock" required hint={producto ? "Ajuste manual del inventario" : undefined}>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                required
                value={form.stockActual}
                onChange={(e) => set("stockActual", Number(e.target.value))}
              />
            </Field>
            <Field label="Stock máximo" htmlFor="prod-stockmax" required hint="Se usa para calcular el nivel de stock">
              <Input
                id="prod-stockmax"
                type="number"
                min={0}
                required
                value={form.stockMaximo}
                onChange={(e) => set("stockMaximo", Number(e.target.value))}
              />
            </Field>
            <Field label="Precio unitario (MXN)" htmlFor="prod-precio" required>
              <Input
                id="prod-precio"
                type="number"
                min={0}
                step="0.01"
                required
                value={form.precio}
                onChange={(e) => set("precio", Number(e.target.value))}
              />
            </Field>
            <div className="flex items-end pb-1.5">
              <Switch
                id="prod-activo"
                checked={form.activo}
                onCheckedChange={(v) => set("activo", v)}
                label="Producto activo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Spinner />}
              {producto ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
