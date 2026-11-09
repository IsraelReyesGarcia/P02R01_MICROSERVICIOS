import { inventarioApi } from "./clients"
import type {
  Categoria,
  CategoriaPayload,
  Producto,
  ProductoPayload,
  StockPayload,
} from "./types"

export const categoriasService = {
  getAll: async () => (await inventarioApi.get<Categoria[]>("/Categorias")).data,
  getById: async (id: number) => (await inventarioApi.get<Categoria>(`/Categorias/${id}`)).data,
  create: async (payload: CategoriaPayload) =>
    (await inventarioApi.post<Categoria>("/Categorias", payload)).data,
  update: async (id: number, payload: CategoriaPayload) => {
    await inventarioApi.patch(`/Categorias/${id}`, payload)
  },
  remove: async (id: number) => {
    await inventarioApi.delete(`/Categorias/${id}`)
  },
}

export const productosService = {
  getAll: async () => (await inventarioApi.get<Producto[]>("/Productos")).data,
  getById: async (id: number) => (await inventarioApi.get<Producto>(`/Productos/${id}`)).data,
  search: async (search: string) =>
    (await inventarioApi.get<Producto[]>("/Productos/Buscar", { params: { search } })).data,
  create: async (payload: ProductoPayload) =>
    (await inventarioApi.post<Producto>("/Productos", payload)).data,
  update: async (id: number, payload: ProductoPayload) => {
    await inventarioApi.patch(`/Productos/${id}`, payload)
  },
  updateStock: async (id: number, payload: StockPayload) =>
    (await inventarioApi.patch<Producto>(`/Productos/${id}/Stock`, payload)).data,
  remove: async (id: number) => {
    await inventarioApi.delete(`/Productos/${id}`)
  },
}
