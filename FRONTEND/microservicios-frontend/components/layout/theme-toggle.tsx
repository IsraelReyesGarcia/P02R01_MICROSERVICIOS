"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "epp-theme"

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark)
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  } catch {
    // almacenamiento no disponible
  }
}

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cambiar tema"
      onClick={() => applyTheme(!document.documentElement.classList.contains("dark"))}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}

/** Script inline que aplica el tema guardado antes de pintar (evita parpadeo) */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`
