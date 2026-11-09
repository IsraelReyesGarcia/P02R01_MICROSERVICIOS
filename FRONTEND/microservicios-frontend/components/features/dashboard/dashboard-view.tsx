"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  AlertTriangleIcon,
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BoxesIcon,
  CircleDollarSignIcon,
  PackageCheckIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StockBadge, TipoBadge } from "@/components/shared/badges"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState, ErrorState, TableSkeleton } from "@/components/shared/states"
import { StockMeter } from "@/components/shared/stock-meter"
import { useProductos } from "@/hooks/queries/use-inventario"
import { useEmpleados, useMovimientos } from "@/hooks/queries/use-movimientos"
import { formatCurrency, formatDateTime, formatNumber, getStockLevel } from "@/lib/format"

export function DashboardView() {
  const productosQuery = useProductos()
  const movimientosQuery = useMovimientos()
  const empleadosQuery = useEmpleados()

  const productos = useMemo(() => productosQuery.data ?? [], [productosQuery.data])
  const movimientos = useMemo(() => movimientosQuery.data ?? [], [movimientosQuery.data])
  const empleados = empleadosQuery.data ?? []

  const stats = useMemo(() => {
    const valor = productos.reduce((acc, p) => acc + p.stockActual * p.precio, 0)
    const unidades = productos.reduce((acc, p) => acc + p.stockActual, 0)
    const alertas = productos
      .filter((p) => p.activo && getStockLevel(p) !== "normal")
      .sort((a, b) => a.stockActual / (a.stockMaximo || 1) - b.stockActual / (b.stockMaximo || 1))

    // Referencia: momento en que se obtuvieron los datos (evita valores impuros en el render)
    const hace30 = movimientosQuery.dataUpdatedAt - 30 * 24 * 60 * 60 * 1000
    const recientes = movimientos.filter((m) => new Date(m.fechaMovimiento).getTime() >= hace30)
    const entradas = recientes.filter((m) => m.tipoMovimiento === "Entrada").reduce((a, m) => a + m.cantidad, 0)
    const salidas = recientes.filter((m) => m.tipoMovimiento === "Salida").reduce((a, m) => a + m.cantidad, 0)

    const porProducto = new Map<string, number>()
    movimientos
      .filter((m) => m.tipoMovimiento === "Salida")
      .forEach((m) => porProducto.set(m.productoNombre, (porProducto.get(m.productoNombre) ?? 0) + m.cantidad))
    const topSalidas = [...porProducto.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

    return { valor, unidades, alertas, recientes: recientes.length, entradas, salidas, topSalidas }
  }, [productos, movimientos, movimientosQuery.dataUpdatedAt])

  const maxTop = stats.topSalidas[0]?.[1] ?? 1

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen del inventario de EPP y su rotación en los últimos 30 días"
        actions={
          <Button asChild>
            <Link href="/movimientos">
              Registrar movimiento <ArrowRightIcon />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Productos"
          value={formatNumber(productos.length)}
          hint={`${formatNumber(stats.unidades)} unidades en almacén`}
          icon={BoxesIcon}
          loading={productosQuery.isPending}
        />
        <StatCard
          label="Valor del inventario"
          value={formatCurrency(stats.valor)}
          hint="Stock actual × precio unitario"
          icon={CircleDollarSignIcon}
          loading={productosQuery.isPending}
        />
        <StatCard
          label="Alertas de stock"
          value={formatNumber(stats.alertas.length)}
          hint="Productos bajos o agotados"
          icon={AlertTriangleIcon}
          loading={productosQuery.isPending}
        />
        <StatCard
          label="Movimientos (30 días)"
          value={formatNumber(stats.recientes)}
          hint={`${formatNumber(empleados.filter((e) => e.activo).length)} empleados activos`}
          icon={PackageCheckIcon}
          loading={movimientosQuery.isPending}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimos movimientos</CardTitle>
            <CardDescription>Entradas y salidas más recientes</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/movimientos">
                  Ver todos <ArrowRightIcon />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            {movimientosQuery.isPending ? (
              <TableSkeleton rows={5} cols={3} />
            ) : movimientosQuery.isError ? (
              <ErrorState error={movimientosQuery.error} service="Movimientos" onRetry={() => movimientosQuery.refetch()} />
            ) : movimientos.length === 0 ? (
              <EmptyState title="Sin movimientos registrados" />
            ) : (
              <ul className="divide-y">
                {movimientos.slice(0, 7).map((m) => (
                  <li key={m.movimientoId} className="flex items-center gap-3 px-6 py-3">
                    <TipoBadge tipo={m.tipoMovimiento} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{m.productoNombre}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {m.empleadoNombre || "Proveedor"} · {formatDateTime(m.fechaMovimiento)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {m.tipoMovimiento === "Entrada" ? "+" : "−"}
                      {m.cantidad}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flujo de 30 días</CardTitle>
            <CardDescription>Unidades que entraron y salieron</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowDownLeftIcon className="size-3.5" aria-hidden /> Entradas
                </span>
                <span className="text-2xl font-semibold tabular-nums">{formatNumber(stats.entradas)}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRightIcon className="size-3.5" aria-hidden /> Salidas
                </span>
                <span className="text-2xl font-semibold tabular-nums">{formatNumber(stats.salidas)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium">EPP más entregado (histórico)</span>
              {stats.topSalidas.length === 0 ? (
                <span className="text-sm text-muted-foreground">Sin salidas registradas.</span>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {stats.topSalidas.map(([nombre, total]) => (
                    <li key={nombre} className="flex flex-col gap-1">
                      <div className="flex justify-between gap-2 text-xs">
                        <span className="truncate">{nombre}</span>
                        <span className="font-medium tabular-nums">{total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(total / maxTop) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos que requieren reabastecimiento</CardTitle>
          <CardDescription>Stock por debajo del 30 % del máximo configurado</CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/productos">
                Ir a productos <ArrowRightIcon />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          {productosQuery.isPending ? (
            <TableSkeleton rows={4} cols={3} />
          ) : productosQuery.isError ? (
            <ErrorState error={productosQuery.error} service="Inventario" onRetry={() => productosQuery.refetch()} />
          ) : stats.alertas.length === 0 ? (
            <EmptyState icon={PackageCheckIcon} title="Todo en orden" description="Ningún producto está por debajo del nivel mínimo." />
          ) : (
            <ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
              {stats.alertas.slice(0, 9).map((p) => (
                <li key={p.productoId} className="flex flex-col gap-2 px-6 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">{p.nombre}</span>
                      <span className="font-mono text-xs text-muted-foreground">{p.codigo}</span>
                    </div>
                    <StockBadge level={getStockLevel(p)} />
                  </div>
                  <StockMeter producto={p} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  )
}
