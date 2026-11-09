"use client"

import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { findNavItem } from "./nav-config"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  const pathname = usePathname()
  const current = findNavItem(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:rounded-t-xl">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
      <nav aria-label="Ruta" className="flex min-w-0 items-center gap-1 text-sm">
        <span className="hidden text-muted-foreground sm:inline">{current?.group ?? "General"}</span>
        <ChevronRightIcon className="hidden size-3.5 text-muted-foreground sm:inline" aria-hidden />
        <span className="truncate font-medium">{current?.title ?? "Dashboard"}</span>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
