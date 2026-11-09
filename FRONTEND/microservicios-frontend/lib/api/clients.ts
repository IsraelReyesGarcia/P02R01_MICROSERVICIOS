import axios, { AxiosError } from "axios"

export const inventarioApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_INVENTARIO_API ?? "http://localhost:5236/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

export const movimientosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MOVIMIENTOS_API ?? "http://localhost:5198/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

type ModelStateErrors = Record<string, string[] | string>

/**
 * Convierte cualquier error de los microservicios (.NET ModelState,
 * ValidationProblemDetails, texto plano o red) en un mensaje legible.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return "No se pudo conectar con el servicio. Verifica que la API esté en ejecución."
    }
    const data = error.response.data as unknown
    if (typeof data === "string" && data.trim()) return data
    if (data && typeof data === "object") {
      const obj = data as { errors?: ModelStateErrors; title?: string } & ModelStateErrors
      const source: ModelStateErrors = obj.errors ?? obj
      const messages = Object.entries(source)
        .filter(([key]) => key !== "title" && key !== "status" && key !== "traceId" && key !== "type")
        .flatMap(([, value]) => (Array.isArray(value) ? value : typeof value === "string" ? [value] : []))
      if (messages.length) return messages.join(" ")
      if (typeof obj.title === "string") return obj.title
    }
    return `Error ${error.response.status}`
  }
  if (error instanceof Error) return error.message
  return "Ocurrió un error inesperado"
}
