import type { Metadata } from "next"
import { ProductosView } from "@/components/features/productos/productos-view"

export const metadata: Metadata = { title: "Productos" }

export default function ProductosPage() {
  return <ProductosView />
}
