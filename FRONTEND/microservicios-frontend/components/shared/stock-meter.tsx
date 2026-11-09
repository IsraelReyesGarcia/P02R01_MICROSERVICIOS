import { cn } from "@/lib/utils"
import { getStockLevel, getStockPercent } from "@/lib/format"
import type { Producto } from "@/lib/api/types"

/** Medidor de una sola tinta: el estado se comunica con el badge (ícono + texto), no con el color */
export function StockMeter({
  producto,
  className,
}: {
  producto: Pick<Producto, "stockActual" | "stockMaximo">
  className?: string
}) {
  const percent = getStockPercent(producto)
  const level = getStockLevel(producto)
  return (
    <div className={cn("flex min-w-28 flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between text-xs tabular-nums">
        <span className="font-medium">{producto.stockActual}</span>
        <span className="text-muted-foreground">/ {producto.stockMaximo}</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Stock al ${percent}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            level === "normal" ? "bg-primary" : level === "bajo" ? "bg-amber-500" : "bg-destructive"
          )}
          style={{ width: `${Math.max(percent, level === "agotado" ? 0 : 3)}%` }}
        />
      </div>
    </div>
  )
}
