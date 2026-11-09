import { movimientosApi } from "./clients"
import type { Empleado, EmpleadoPayload, Movimiento, MovimientoPayload } from "./types"

export const empleadosService = {
  getAll: async () => (await movimientosApi.get<Empleado[]>("/Empleados")).data,
  getById: async (id: number) => (await movimientosApi.get<Empleado>(`/Empleados/${id}`)).data,
  create: async (payload: EmpleadoPayload) =>
    (await movimientosApi.post<Empleado>("/Empleados", payload)).data,
  update: async (id: number, payload: EmpleadoPayload) => {
    await movimientosApi.patch(`/Empleados/${id}`, payload)
  },
  remove: async (id: number) => {
    await movimientosApi.delete(`/Empleados/${id}`)
  },
}

export const movimientosService = {
  getAll: async () => (await movimientosApi.get<Movimiento[]>("/Movimientos")).data,
  getById: async (id: number) =>
    (await movimientosApi.get<Movimiento>(`/Movimientos/${id}`)).data,
  getByEmpleado: async (empleadoId: number) =>
    (await movimientosApi.get<Movimiento[]>(`/Movimientos/Empleado/${empleadoId}`)).data,
  getByProducto: async (productoId: number) =>
    (await movimientosApi.get<Movimiento[]>(`/Movimientos/Producto/${productoId}`)).data,
  create: async (payload: MovimientoPayload) =>
    (await movimientosApi.post<Movimiento>("/Movimientos", payload)).data,
  remove: async (id: number) => {
    await movimientosApi.delete(`/Movimientos/${id}`)
  },
}
