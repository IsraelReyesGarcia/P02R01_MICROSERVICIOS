"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/api/clients"
import { categoriasService, productosService } from "@/lib/api/inventario"
import type { CategoriaPayload, ProductoPayload } from "@/lib/api/types"

export const inventarioKeys = {
  categorias: ["inventario", "categorias"] as const,
  productos: ["inventario", "productos"] as const,
}

// ===== Categorías =====
export function useCategorias() {
  return useQuery({ queryKey: inventarioKeys.categorias, queryFn: categoriasService.getAll })
}

export function useSaveCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: CategoriaPayload }) =>
      id ? categoriasService.update(id, payload) : categoriasService.create(payload).then(() => undefined),
    onSuccess: (_, { id }) => {
      toast.success(id ? "Categoría actualizada" : "Categoría creada")
      queryClient.invalidateQueries({ queryKey: inventarioKeys.categorias })
      queryClient.invalidateQueries({ queryKey: inventarioKeys.productos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriasService.remove(id),
    onSuccess: () => {
      toast.success("Categoría eliminada")
      queryClient.invalidateQueries({ queryKey: inventarioKeys.categorias })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

// ===== Productos =====
export function useProductos() {
  return useQuery({ queryKey: inventarioKeys.productos, queryFn: productosService.getAll })
}

export function useSaveProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: ProductoPayload }) =>
      id ? productosService.update(id, payload) : productosService.create(payload).then(() => undefined),
    onSuccess: (_, { id }) => {
      toast.success(id ? "Producto actualizado" : "Producto creado")
      queryClient.invalidateQueries({ queryKey: inventarioKeys.productos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productosService.remove(id),
    onSuccess: () => {
      toast.success("Producto eliminado")
      queryClient.invalidateQueries({ queryKey: inventarioKeys.productos })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
