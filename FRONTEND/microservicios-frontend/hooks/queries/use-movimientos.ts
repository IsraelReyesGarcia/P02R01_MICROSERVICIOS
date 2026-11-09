"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/api/clients"
import { productosService } from "@/lib/api/inventario"
import { empleadosService, movimientosService } from "@/lib/api/movimientos"
import type { EmpleadoPayload, MovimientoPayload } from "@/lib/api/types"
import { inventarioKeys } from "./use-inventario"

export const movimientosKeys = {
  empleados: ["movimientos", "empleados"] as const,
  movimientos: ["movimientos", "movimientos"] as const,
}

// ===== Empleados =====
export function useEmpleados() {
  return useQuery({ queryKey: movimientosKeys.empleados, queryFn: empleadosService.getAll })
}

export function useSaveEmpleado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: EmpleadoPayload }) =>
      id ? empleadosService.update(id, payload) : empleadosService.create(payload).then(() => undefined),
    onSuccess: (_, { id }) => {
      toast.success(id ? "Empleado actualizado" : "Empleado registrado")
      queryClient.invalidateQueries({ queryKey: movimientosKeys.empleados })
      queryClient.invalidateQueries({ queryKey: movimientosKeys.movimientos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteEmpleado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => empleadosService.remove(id),
    onSuccess: () => {
      toast.success("Empleado eliminado")
      queryClient.invalidateQueries({ queryKey: movimientosKeys.empleados })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

// ===== Movimientos =====
export function useMovimientos() {
  return useQuery({ queryKey: movimientosKeys.movimientos, queryFn: movimientosService.getAll })
}

/**
 * Orquesta ambos microservicios: primero ajusta el stock en Inventario
 * (valida existencias en salidas) y después registra el movimiento.
 * Si el registro falla, se revierte el ajuste de stock.
 */
export function useCreateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: MovimientoPayload) => {
      await productosService.updateStock(payload.productoId, {
        tipoMovimiento: payload.tipoMovimiento,
        cantidad: payload.cantidad,
      })
      try {
        return await movimientosService.create(payload)
      } catch (error) {
        await productosService
          .updateStock(payload.productoId, {
            tipoMovimiento: payload.tipoMovimiento === "Entrada" ? "Salida" : "Entrada",
            cantidad: payload.cantidad,
          })
          .catch(() => undefined)
        throw error
      }
    },
    onSuccess: (movimiento) => {
      toast.success(`${movimiento.tipoMovimiento} registrada`, {
        description: `${movimiento.cantidad} × ${movimiento.productoNombre}`,
      })
      queryClient.invalidateQueries({ queryKey: movimientosKeys.movimientos })
      queryClient.invalidateQueries({ queryKey: inventarioKeys.productos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => movimientosService.remove(id),
    onSuccess: () => {
      toast.success("Movimiento eliminado del historial")
      queryClient.invalidateQueries({ queryKey: movimientosKeys.movimientos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
