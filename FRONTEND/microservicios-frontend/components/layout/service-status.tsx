"use client"

import { CheckCircle2Icon, LoaderIcon, XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCategorias } from "@/hooks/queries/use-inventario"
import { useEmpleados } from "@/hooks/queries/use-movimientos"

type Status = "online" | "offline" | "checking"

function useServiceStatus() {
  const inventario = useCategorias()
  const movimientos = useEmpleados()
  const toStatus = (q: { isPending: boolean; isError: boolean }): Status =>
    q.isPending ? "checking" : q.isError ? "offline" : "online"
  return {
    inventario: toStatus(inventario),
    movimientos: toStatus(movimientos),
  }
}

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle2Icon; className: string }> = {
  online: { label: "En línea", icon: CheckCircle2Icon, className: "text-emerald-600 dark:text-emerald-400" },
  offline: { label: "Sin conexión", icon: XCircleIcon, className: "text-destructive" },
  checking: { label: "Verificando", icon: LoaderIcon, className: "text-muted-foreground" },
}

function StatusRow({ name, port, status }: { name: string; port: string; status: Status }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-sidebar-foreground">{name}</span>
        <span className="text-[11px] text-muted-foreground">:{port}</span>
      </div>
      <span className={cn("flex shrink-0 items-center gap-1", config.className)}>
        <Icon className={cn("size-3.5", status === "checking" && "animate-spin")} aria-hidden />
        {config.label}
      </span>
    </div>
  )
}

export function ServiceStatus() {
  const status = useServiceStatus()
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Microservicios
      </span>
      <StatusRow name="API Inventario" port="5236" status={status.inventario} />
      <StatusRow name="API Movimientos" port="5198" status={status.movimientos} />
    </div>
  )
}
