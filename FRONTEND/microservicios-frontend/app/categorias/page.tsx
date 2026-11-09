import type { Metadata } from "next"
import { CategoriasView } from "@/components/features/categorias/categorias-view"

export const metadata: Metadata = { title: "Categorías" }

export default function CategoriasPage() {
  return <CategoriasView />
}
