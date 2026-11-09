import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  className?: string
  cell: (row: T) => ReactNode
}

/** Tabla simple, responsiva con scroll horizontal dentro de la tarjeta */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "h-10 px-4 text-left text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b transition-colors last:border-0 hover:bg-muted/40">
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 align-middle", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
