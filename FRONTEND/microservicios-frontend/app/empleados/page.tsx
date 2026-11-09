import type { Metadata } from "next"
import { EmpleadosView } from "@/components/features/empleados/empleados-view"

export const metadata: Metadata = { title: "Empleados" }

export default function EmpleadosPage() {
  return <EmpleadosView />
}
