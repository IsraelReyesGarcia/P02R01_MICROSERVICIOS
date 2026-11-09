import type { Producto } from "@/lib/api/types"

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
const number = new Intl.NumberFormat("es-MX")
const date = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" })
const dateTime = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export const formatCurrency = (value: number) => currency.format(value ?? 0)
export const formatNumber = (value: number) => number.format(value ?? 0)
export const formatDate = (value: string) => (value ? date.format(new Date(value)) : "—")
export const formatDateTime = (value: string) => (value ? dateTime.format(new Date(value)) : "—")

export type StockLevel = "agotado" | "bajo" | "normal"

/** Nivel de stock respecto al stock máximo configurado del producto */
export function getStockLevel(producto: Pick<Producto, "stockActual" | "stockMaximo">): StockLevel {
  if (producto.stockActual <= 0) return "agotado"
  const max = producto.stockMaximo > 0 ? producto.stockMaximo : 1
  return producto.stockActual / max < 0.3 ? "bajo" : "normal"
}

export function getStockPercent(producto: Pick<Producto, "stockActual" | "stockMaximo">): number {
  if (producto.stockMaximo <= 0) return producto.stockActual > 0 ? 100 : 0
  return Math.min(100, Math.round((producto.stockActual / producto.stockMaximo) * 100))
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}
