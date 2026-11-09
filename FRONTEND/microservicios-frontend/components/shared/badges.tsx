import {
  AlertTriangleIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  CircleOffIcon,
  XCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TipoMovimiento } from "@/lib/api/types"
import type { StockLevel } from "@/lib/format"

const base =
  "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap [&>svg]:size-3"

export function ActiveBadge({ active }: { active: boolean }) {
  return active ? (
    <span className={cn(base, "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400")}>
      <CheckCircle2Icon aria-hidden /> Activo
    </span>
  ) : (
    <span className={cn(base, "bg-muted text-muted-foreground")}>
      <CircleOffIcon aria-hidden /> Inactivo
    </span>
  )
}

export function StockBadge({ level }: { level: StockLevel }) {
  if (level === "agotado")
    return (
      <span className={cn(base, "bg-destructive/10 text-destructive")}>
        <XCircleIcon aria-hidden /> Agotado
      </span>
    )
  if (level === "bajo")
    return (
      <span className={cn(base, "bg-amber-500/15 text-amber-700 dark:text-amber-400")}>
        <AlertTriangleIcon aria-hidden /> Stock bajo
      </span>
    )
  return (
    <span className={cn(base, "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400")}>
      <CheckCircle2Icon aria-hidden /> Disponible
    </span>
  )
}

export function TipoBadge({ tipo }: { tipo: TipoMovimiento }) {
  return tipo === "Entrada" ? (
    <span className={cn(base, "bg-primary/10 text-primary")}>
      <ArrowDownLeftIcon aria-hidden /> Entrada
    </span>
  ) : (
    <span className={cn(base, "bg-orange-500/10 text-orange-700 dark:text-orange-400")}>
      <ArrowUpRightIcon aria-hidden /> Salida
    </span>
  )
}
