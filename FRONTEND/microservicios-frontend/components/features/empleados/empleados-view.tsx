"use client"

import { useMemo, useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon, UsersIcon } from "lucide-react"

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
import { ActiveBadge } from "@/components/shared/badges"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Field, NativeSelect, SearchInput, Switch } from "@/components/shared/form"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"
import {
  useDeleteEmpleado,
  useEmpleados,
  useMovimientos,
  useSaveEmpleado,
} from "@/hooks/queries/use-movimientos"
import type { Empleado, EmpleadoPayload } from "@/lib/api/types"
import { formatDate, normalize } from "@/lib/format"

function initials(e: Empleado) {
  return `${e.nombre.charAt(0)}${e.apellidos.charAt(0)}`.toUpperCase()
}

export function EmpleadosView() {
  const { data: empleados = [], isPending, isError, error, refetch } = useEmpleados()
  const { data: movimientos = [] } = useMovimientos()
  const deleteMutation = useDeleteEmpleado()

  const [search, setSearch] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Empleado | null>(null)
  const [toDelete, setToDelete] = useState<Empleado | null>(null)

  const departamentos = useMemo(
    () => Array.from(new Set(empleados.map((e) => e.departamento).filter(Boolean))).sort(),
    [empleados]
  )

  const entregas = useMemo(() => {
    const map = new Map<number, number>()
    movimientos.forEach((m) => {
      if (m.empleadoId && m.tipoMovimiento === "Salida")
        map.set(m.empleadoId, (map.get(m.empleadoId) ?? 0) + m.cantidad)
    })
    return map
  }, [movimientos])

  const filtered = useMemo(() => {
    const term = normalize(search.trim())
    return empleados.filter((e) => {
      if (departamento && e.departamento !== departamento) return false
      if (!term) return true
      return normalize(`${e.numEmpleado} ${e.nombreCompleto} ${e.puesto}`).includes(term)
    })
  }, [empleados, search, departamento])

  const columns: Column<Empleado>[] = [
    {
      key: "empleado",
      header: "Empleado",
      cell: (e) => (
        <div className="flex min-w-52 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(e)}
          </span>
          <div className="flex flex-col">
            <span className="font-medium">{e.nombreCompleto}</span>
            <span className="font-mono text-xs text-muted-foreground">{e.numEmpleado}</span>
          </div>
        </div>
      ),
    },
    {
      key: "puesto",
      header: "Puesto / Departamento",
      cell: (e) => (
        <div className="flex flex-col">
          <span>{e.puesto || "—"}</span>
          <span className="text-xs text-muted-foreground">{e.departamento || "—"}</span>
        </div>
      ),
    },
    {
      key: "entregas",
      header: "EPP recibido",
      className: "text-right tabular-nums",
      cell: (e) => entregas.get(e.empleadoId) ?? 0,
    },
    { key: "estado", header: "Estado", cell: (e) => <ActiveBadge active={e.activo} /> },
    {
      key: "alta",
      header: "Alta",
      className: "whitespace-nowrap text-muted-foreground",
      cell: (e) => formatDate(e.fechaAlta),
    },
    {
      key: "acciones",
      header: "",
      className: "w-px text-right",
      cell: (e) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Editar ${e.nombreCompleto}`}
            onClick={() => {
              setEditing(e)
              setFormOpen(true)
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar ${e.nombreCompleto}`}
            className="text-destructive hover:text-destructive"
            onClick={() => setToDelete(e)}
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
        title="Empleados"
        description="Personal que recibe equipo de protección · Microservicio Movimientos"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <PlusIcon /> Nuevo empleado
          </Button>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Buscar por número, nombre o puesto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar empleado"
          />
          <NativeSelect
            aria-label="Filtrar por departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            className="sm:w-56"
          >
            <option value="">Todos los departamentos</option>
            {departamentos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </NativeSelect>
          <span className="text-sm text-muted-foreground sm:ml-auto">
            {filtered.length} de {empleados.length} empleados
          </span>
        </div>
        {isPending ? (
          <TableSkeleton cols={5} />
        ) : isError ? (
          <ErrorState error={error} service="Movimientos" onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={empleados.length ? "Sin resultados" : "Aún no hay empleados"}
            description={empleados.length ? "Ajusta la búsqueda o el filtro." : "Registra al primer empleado."}
          />
        ) : (
          <DataTable columns={columns} rows={filtered} rowKey={(e) => e.empleadoId} />
        )}
      </Card>

      <EmpleadoFormDialog
        key={editing?.empleadoId ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        empleado={editing}
        departamentos={departamentos}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Eliminar empleado"
        description={`¿Seguro que deseas eliminar a "${toDelete?.nombreCompleto}"? Si tiene movimientos registrados, mejor desactívalo.`}
        loading={deleteMutation.isPending}
        onConfirm={() =>
          toDelete && deleteMutation.mutate(toDelete.empleadoId, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  )
}

function EmpleadoFormDialog({
  open,
  onOpenChange,
  empleado,
  departamentos,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  empleado: Empleado | null
  departamentos: string[]
}) {
  const saveMutation = useSaveEmpleado()
  const [form, setForm] = useState<EmpleadoPayload>({
    numEmpleado: empleado?.numEmpleado ?? "",
    nombre: empleado?.nombre ?? "",
    apellidos: empleado?.apellidos ?? "",
    departamento: empleado?.departamento ?? "",
    puesto: empleado?.puesto ?? "",
    activo: empleado?.activo ?? true,
  })

  const set = <K extends keyof EmpleadoPayload>(key: K, value: EmpleadoPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(
      {
        id: empleado?.empleadoId,
        payload: {
          ...form,
          numEmpleado: form.numEmpleado.trim().toUpperCase(),
          nombre: form.nombre.trim(),
          apellidos: form.apellidos.trim(),
          departamento: form.departamento.trim(),
          puesto: form.puesto.trim(),
        },
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{empleado ? "Editar empleado" : "Nuevo empleado"}</DialogTitle>
            <DialogDescription>Los campos marcados con * son obligatorios.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Número de empleado" htmlFor="emp-num" required>
              <Input
                id="emp-num"
                required
                maxLength={20}
                value={form.numEmpleado}
                onChange={(e) => set("numEmpleado", e.target.value)}
                placeholder="EMP-0001"
                className="font-mono uppercase"
              />
            </Field>
            <div className="hidden sm:block" />
            <Field label="Nombre(s)" htmlFor="emp-nombre" required>
              <Input id="emp-nombre" required maxLength={100} value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
            </Field>
            <Field label="Apellidos" htmlFor="emp-apellidos" required>
              <Input
                id="emp-apellidos"
                required
                maxLength={150}
                value={form.apellidos}
                onChange={(e) => set("apellidos", e.target.value)}
              />
            </Field>
            <Field label="Departamento" htmlFor="emp-depto">
              <Input
                id="emp-depto"
                list="emp-deptos"
                maxLength={100}
                value={form.departamento}
                onChange={(e) => set("departamento", e.target.value)}
              />
              <datalist id="emp-deptos">
                {departamentos.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </Field>
            <Field label="Puesto" htmlFor="emp-puesto">
              <Input id="emp-puesto" maxLength={100} value={form.puesto} onChange={(e) => set("puesto", e.target.value)} />
            </Field>
          </div>
          <Switch id="emp-activo" checked={form.activo} onCheckedChange={(v) => set("activo", v)} label="Empleado activo" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Spinner />}
              {empleado ? "Guardar cambios" : "Registrar empleado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
