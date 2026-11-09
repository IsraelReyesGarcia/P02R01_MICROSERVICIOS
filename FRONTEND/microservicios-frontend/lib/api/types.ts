// ===== Microservicio Inventario =====
export interface Categoria {
  categoriaId: number
  nombre: string
  descripcion: string
  activo: boolean
  fechaCreacion: string
}

export interface CategoriaPayload {
  nombre: string
  descripcion: string
  activo: boolean
}

export interface Producto {
  productoId: number
  categoriaId: number
  categoriaNombre: string
  codigo: string
  nombre: string
  descripcion: string
  marca: string
  talla: string
  stockActual: number
  stockMaximo: number
  precio: number
  activo: boolean
  fechaCreacion: string
}

export interface ProductoPayload {
  categoriaId: number
  codigo: string
  nombre: string
  descripcion: string
  marca: string
  talla: string
  stockActual: number
  stockMaximo: number
  precio: number
  activo: boolean
}

export type TipoMovimiento = "Entrada" | "Salida"

export interface StockPayload {
  tipoMovimiento: TipoMovimiento
  cantidad: number
}

// ===== Microservicio Movimientos =====
export interface Empleado {
  empleadoId: number
  numEmpleado: string
  nombre: string
  apellidos: string
  nombreCompleto: string
  departamento: string
  puesto: string
  activo: boolean
  fechaAlta: string
}

export interface EmpleadoPayload {
  numEmpleado: string
  nombre: string
  apellidos: string
  departamento: string
  puesto: string
  activo: boolean
}

export interface Movimiento {
  movimientoId: number
  tipoMovimiento: TipoMovimiento
  productoId: number
  productoNombre: string
  empleadoId: number | null
  empleadoNombre: string
  empleadoNumero: string
  cantidad: number
  motivo: string
  fechaMovimiento: string
  registrador: string
}

export interface MovimientoPayload {
  tipoMovimiento: TipoMovimiento
  productoId: number
  productoNombre: string
  empleadoId: number | null
  cantidad: number
  motivo: string
  registrador: string
}
