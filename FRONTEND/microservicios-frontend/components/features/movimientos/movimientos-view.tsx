"use client"

import { useMemo, useState } from "react"
import {
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  Trash2Icon,
} from "lucide-react"

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
import { StockBadge, TipoBadge } from "@/components/shared/badges"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Field, NativeSelect, SearchInput } from "@/components/shared/form"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"
import { useProductos } from "@/hooks/queries/use-inventario"
import {
  useCreateMovimiento,
  useDeleteMovimiento,
  useEmpleados,
  useMovimientos,
} from "@/hooks/queries/use-movimientos"
import type { Empleado, Movimiento, Producto, TipoMovimiento } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { formatDateTime, getStockLevel, normalize } from "@/lib/format"

type TipoFilter = "todos" | TipoMovimiento

export function MovimientosView() {
  const { data: movimientos = [], isPending, isError, error, refetch } = useMovimientos()
  const { data: productos = [] } = useProductos()
  const { data: empleados = [] } = useEmpleados()
  const deleteMutation = useDeleteMovimiento()

  const [search, setSearch] = useState("")
  const [tipo, setTipo] = useState<TipoFilter>("todos")
  const [formTipo, setFormTipo] = useState<TipoMovimiento | null>(null)
  const [toDelete, setToDelete] = useState<Movimiento | null>(null)

  const filtered = useMemo(() => {
    const term = normalize(search.trim())
    return movimientos.filter((m) => {
      if (tipo !== "todos" && m.tipoMovimiento !== tipo) return false
      if (!term) return true
      return normalize(`${m.productoNombre} ${m.empleadoNombre} ${m.empleadoNumero} ${m.motivo} ${m.registrador}`).includes(term)
    })
  }, [movimientos, search, tipo])

  const columns: Column<Movimiento>[] = [
    {
      key: "fecha",
      header: "Fecha",
      className: "whitespace-nowrap text-muted-foreground tabular-nums",
      cell: (m) => formatDateTime(m.fechaMovimiento),
    },
    { key: "tipo", header: "Tipo", cell: (m) => <TipoBadge tipo={m.tipoMovimiento} /> },
    {
      key: "producto",
      header: "Producto",
      cell: (m) => <span className="block min-w-48 font-medium">{m.productoNombre}</span>,
    },
    {
      key: "cantidad",
      header: "Cantidad",
      className: "text-right tabular-nums font-medium",
      cell: (m) => (m.tipoMovimiento === "Entrada" ? `+${m.cantidad}` : `−${m.cantidad}`),
    },
    {
      key: "empleado",
      header: "Empleado",
      cell: (m) =>
        m.empleadoNombre ? (
          <div className="flex min-w-40 flex-col">
            <span>{m.empleadoNombre}</span>
            <span className="font-mono text-xs text-muted-foreground">{m.empleadoNumero}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Proveedor</span>
        ),
    },
    {
      key: "motivo",
      header: "Motivo",
      cell: (m) => <span className="line-clamp-2 min-w-48 text-muted-foreground">{m.motivo || "—"}</span>,
    },
    {
      key: "registrador",
      header: "Registró",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (m) => m.registrador || "—",
    },
    {
      key: "acciones",
      header: "",
      className: "w-px text-right",
      cell: (m) => (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Eliminar movimiento ${m.movimientoId}`}
          className="text-destructive hover:text-destructive"
          onClick={() => setToDelete(m)}
        >
          <Trash2Icon />
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Movimientos"
        description="Entradas y salidas de EPP · Orquesta los microservicios Inventario y Movimientos"
        actions={
          <>
            <Button variant="outline" onClick={() => setFormTipo("Entrada")}>
              <ArrowDownLeftIcon /> Registrar entrada
            </Button>
            <Button onClick={() => setFormTipo("Salida")}>
              <ArrowUpRightIcon /> Registrar salida
            </Button>
          </>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Buscar producto, empleado o motivo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar movimiento"
          />
          <div className="inline-flex w-fit rounded-lg border p-0.5" role="group" aria-label="Filtrar por tipo">
            {(["todos", "Entrada", "Salida"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tipo === t}
                onClick={() => setTipo(t)}
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  tipo === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "todos" ? "Todos" : t === "Entrada" ? "Entradas" : "Salidas"}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground sm:ml-auto">
            {filtered.length} de {movimientos.length} movimientos
          </span>
        </div>
        {isPending ? (
          <TableSkeleton cols={6} />
        ) : isError ? (
          <ErrorState error={error} service="Movimientos" onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRightIcon}
            title={movimientos.length ? "Sin resultados" : "Aún no hay movimientos"}
            description={movimientos.length ? "Ajusta la búsqueda o el filtro." : "Registra la primera entrada de EPP."}
          />
        ) : (
          <DataTable columns={columns} rows={filtered} rowKey={(m) => m.movimientoId} />
        )}
      </Card>

      {formTipo && (
        <MovimientoFormDialog
          key={formTipo}
          tipo={formTipo}
          onClose={() => setFormTipo(null)}
          productos={productos}
          empleados={empleados}
        />
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Eliminar movimiento"
        description="Se eliminará el registro del historial. El stock del producto NO se modifica; si necesitas corregirlo registra un movimiento inverso."
        loading={deleteMutation.isPending}
        onConfirm={() =>
          toDelete && deleteMutation.mutate(toDelete.movimientoId, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  )
}

function MovimientoFormDialog({
  tipo,
  onClose,
  productos,
  empleados,
}: {
  tipo: TipoMovimiento
  onClose: () => void
  productos: Producto[]
  empleados: Empleado[]
}) {
  const createMutation = useCreateMovimiento()
  const [productoId, setProductoId] = useState(0)
  const [empleadoId, setEmpleadoId] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [motivo, setMotivo] = useState("")
  const [registrador, setRegistrador] = useState("")

  const esSalida = tipo === "Salida"
  const productosActivos = productos.filter((p) => p.activo)
  const empleadosActivos = empleados.filter((e) => e.activo)
  const producto = productos.find((p) => p.productoId === productoId)
  const stockInsuficiente = esSalida && producto !== undefined && cantidad > producto.stockActual

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!producto || stockInsuficiente) return
    createMutation.mutate(
      {
        tipoMovimiento: tipo,
        productoId: producto.productoId,
        productoNombre: producto.nombre,
        empleadoId: esSalida ? empleadoId : null,
        cantidad,
        motivo: motivo.trim(),
        registrador: registrador.trim(),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  esSalida ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" : "bg-primary/10 text-primary"
                )}
              >
                {esSalida ? <ArrowUpRightIcon className="size-4" /> : <ArrowDownLeftIcon className="size-4" />}
              </span>
              <DialogTitle>{esSalida ? "Registrar salida de EPP" : "Registrar entrada de EPP"}</DialogTitle>
            </div>
            <DialogDescription>
              {esSalida
                ? "Entrega de equipo a un empleado. Se descuenta del inventario."
                : "Recepción de equipo de proveedor. Se suma al inventario."}
            </DialogDescription>
          </DialogHeader>

          <Field label="Producto" htmlFor="mov-producto" required>
            <NativeSelect
              id="mov-producto"
              required
              value={productoId || ""}
              onChange={(e) => setProductoId(Number(e.target.value))}
            >
              <option value="" disabled>
                Selecciona un producto
              </option>
              {productosActivos.map((p) => (
                <option key={p.productoId} value={p.productoId} disabled={esSalida && p.stockActual <= 0}>
                  {p.codigo} · {p.nombre} ({p.stockActual} disp.)
                </option>
              ))}
            </NativeSelect>
          </Field>

          {producto && (
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{producto.categoriaNombre}</span>
                <span className="tabular-nums">
                  Disponible: <strong>{producto.stockActual}</strong> / {producto.stockMaximo}
                </span>
              </div>
              <StockBadge level={getStockLevel(producto)} />
            </div>
          )}

          {esSalida && (
            <Field label="Empleado que recibe" htmlFor="mov-empleado" required>
              <NativeSelect
                id="mov-empleado"
                required
                value={empleadoId || ""}
                onChange={(e) => setEmpleadoId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Selecciona un empleado
                </option>
                {empleadosActivos.map((e) => (
                  <option key={e.empleadoId} value={e.empleadoId}>
                    {e.numEmpleado} · {e.nombreCompleto} — {e.departamento}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          )}

          <Field
            label="Cantidad"
            htmlFor="mov-cantidad"
            required
            hint={stockInsuficiente ? undefined : esSalida && producto ? `Máximo ${producto.stockActual}` : undefined}
          >
            <Input
              id="mov-cantidad"
              type="number"
              min={1}
              max={esSalida && producto ? producto.stockActual : undefined}
              required
              value={cantidad}
              aria-invalid={stockInsuficiente}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            {stockInsuficiente && (
              <p className="text-xs text-destructive">Stock insuficiente: solo hay {producto?.stockActual} disponibles.</p>
            )}
          </Field>

          <Field label="Motivo" htmlFor="mov-motivo">
            <Textarea
              id="mov-motivo"
              maxLength={255}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={esSalida ? "Ej. Reposición por desgaste" : "Ej. Compra a proveedor - OC-1006"}
            />
          </Field>

          <Field label="Registrado por" htmlFor="mov-registrador">
            <Input
              id="mov-registrador"
              maxLength={100}
              value={registrador}
              onChange={(e) => setRegistrador(e.target.value)}
              placeholder="Nombre de quien registra"
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || stockInsuficiente || !producto}>
              {createMutation.isPending && <Spinner />}
              {esSalida ? "Registrar salida" : "Registrar entrada"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
