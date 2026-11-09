import {
  ArrowLeftRightIcon,
  LayoutDashboardIcon,
  PackageIcon,
  TagsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export interface NavGroup {
  label: string
  service?: "inventario" | "movimientos"
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboardIcon,
        description: "Resumen general del inventario y los movimientos de EPP",
      },
    ],
  },
  {
    label: "Inventario",
    service: "inventario",
    items: [
      {
        title: "Productos",
        href: "/productos",
        icon: PackageIcon,
        description: "Catálogo de equipo de protección personal y existencias",
      },
      {
        title: "Categorías",
        href: "/categorias",
        icon: TagsIcon,
        description: "Clasificación de los productos de EPP",
      },
    ],
  },
  {
    label: "Movimientos",
    service: "movimientos",
    items: [
      {
        title: "Movimientos",
        href: "/movimientos",
        icon: ArrowLeftRightIcon,
        description: "Entradas y salidas de EPP del almacén",
      },
      {
        title: "Empleados",
        href: "/empleados",
        icon: UsersIcon,
        description: "Personal que recibe equipo de protección",
      },
    ],
  },
]

export const allNavItems = navGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label }))
)

export function findNavItem(pathname: string) {
  return (
    allNavItems.find((item) => item.href === pathname) ??
    allNavItems.find((item) => item.href !== "/" && pathname.startsWith(item.href))
  )
}
