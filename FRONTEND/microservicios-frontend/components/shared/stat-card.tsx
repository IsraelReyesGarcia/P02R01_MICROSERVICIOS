import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  loading?: boolean
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </span>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </CardContent>
    </Card>
  )
}
