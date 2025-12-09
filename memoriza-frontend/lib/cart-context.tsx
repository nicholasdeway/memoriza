"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import * as cartApi from "@/lib/api/cart"
import type { CartItemDto } from "@/types/cart"

const CART_STORAGE_KEY = "memoriza_cart_v1"

// ==== Tipos ====

export interface CartItem {
  id: string
  productId: string
  name: string
  imageUrl?: string | null
  price: number
  quantity: number

  // customização
  sizeId?: number
  sizeName?: string
  colorId?: number
  colorName?: string
  personalizationText?: string
}

interface CartContextValue {
  items: CartItem[]
  itemsCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void
  removeItem: (lineId: string) => void
  /**
   * Atualiza quantidade de um item levando em conta
   * produto + tamanho + cor + texto de personalização
   */
  updateQuantity: (
    productId: string,
    quantity: number,
    sizeId?: number,
    colorId?: number,
    personalizationText?: string,
  ) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// ==== Helpers ====

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value
  if (typeof value === "string") {
    const normalized = value.replace(",", ".")
    const parsed = Number(normalized)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) return []

    // garante que o que vem do storage está coerente
    return parsed.map((item: any): CartItem => ({
      id: String(item.id ?? crypto.randomUUID()),
      productId: String(item.productId ?? ""),
      name: String(item.name ?? "Produto"),
      imageUrl: item.imageUrl ?? null,
      price: normalizeNumber(item.price),
      quantity:
        typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1,
      sizeId: typeof item.sizeId === "number" ? item.sizeId : undefined,
      sizeName: item.sizeName ?? undefined,
      colorId: typeof item.colorId === "number" ? item.colorId : undefined,
      colorName: item.colorName ?? undefined,
      personalizationText: item.personalizationText ?? undefined,
    }))
  } catch {
    return []
  }
}

// ==== Provider ====

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  
  // começa sempre vazio no SSR e no cliente
  const [items, setItems] = useState<CartItem[]>([])
  const [syncing, setSyncing] = useState(false)

  // carrega do localStorage só depois que o componente está montado (cliente)
  useEffect(() => {
    const initial = loadInitialCart()
    setItems(initial)
  }, [])

  // 🔄 Sincroniza com backend quando usuário loga
  useEffect(() => {
    if (!token || syncing) return

    const syncWithBackend = async () => {
      setSyncing(true)
      try {
        const backendCart = await cartApi.getCart(token)
        
        // Converte items do backend para formato do frontend
        const backendItems: CartItem[] = backendCart.items.map((item: CartItemDto) => ({
          id: item.cartItemId,
          productId: item.productId,
          name: item.productName,
          imageUrl: item.thumbnailUrl,
          price: item.unitPrice,
          quantity: item.quantity,
          // Backend não tem size/color/personalization, então deixa undefined
        }))

        // Backend é a fonte da verdade quando logado
        setItems(backendItems)
      } catch (error) {
        console.error("Erro ao sincronizar carrinho:", error)
        // Mantém localStorage em caso de erro
      } finally {
        setSyncing(false)
      }
    }

    void syncWithBackend()
  }, [token])

  // salva no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + normalizeNumber(item.price) * item.quantity,
    0,
  )

  const addItem: CartContextValue["addItem"] = (incoming) => {
    const price = normalizeNumber(incoming.price)

    // chave para considerar o mesmo "tipo" de item (produto + tamanho + cor + texto)
    const matchKey = (item: CartItem) =>
      item.productId === incoming.productId &&
      item.sizeId === incoming.sizeId &&
      item.colorId === incoming.colorId &&
      (item.personalizationText ?? "") ===
        (incoming.personalizationText ?? "")

    // 🔄 Atualiza UI imediatamente (optimistic update)
    setItems((prev) => {
      const existingIndex = prev.findIndex(matchKey)

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (incoming.quantity || 1),
          price,
        }
        return updated
      }

      const lineId = incoming.id ?? crypto.randomUUID()

      const newItem: CartItem = {
        id: lineId,
        productId: incoming.productId,
        name: incoming.name,
        imageUrl: incoming.imageUrl ?? null,
        price,
        quantity: incoming.quantity > 0 ? incoming.quantity : 1,
        sizeId: incoming.sizeId,
        sizeName: incoming.sizeName,
        colorId: incoming.colorId,
        colorName: incoming.colorName,
        personalizationText: incoming.personalizationText,
      }

      return [...prev, newItem]
    })

    // 🔄 Sincroniza com backend se autenticado
    if (token) {
      cartApi.addCartItem(
        {
          productId: incoming.productId,
          quantity: incoming.quantity > 0 ? incoming.quantity : 1,
        },
        token
      ).catch((error) => {
        console.error("Erro ao sincronizar item com backend:", error)
        toast.error("Item adicionado localmente, mas não foi sincronizado")
      })
    }
  }

  const removeItem: CartContextValue["removeItem"] = (lineId) => {
    // Atualiza UI imediatamente
    setItems((prev) => prev.filter((item) => item.id !== lineId))

    // Sincroniza com backend se autenticado
    if (token) {
      cartApi.removeCartItem({ cartItemId: lineId }, token).catch((error) => {
        console.error("Erro ao remover item do backend:", error)
        toast.error("Item removido localmente, mas não foi sincronizado")
      })
    }
  }

  const updateQuantity: CartContextValue["updateQuantity"] = (
    productId,
    quantity,
    sizeId,
    colorId,
    personalizationText,
  ) => {
    const safeQuantity = quantity > 0 ? quantity : 1

    setItems((prev) =>
      prev.map((item) => {
        const sameProduct = item.productId === productId
        const sameSize = (item.sizeId ?? undefined) === (sizeId ?? undefined)
        const sameColor =
          (item.colorId ?? undefined) === (colorId ?? undefined)
        const sameText =
          (item.personalizationText ?? "") ===
          (personalizationText ?? "")

        if (!(sameProduct && sameSize && sameColor && sameText)) {
          return item
        }

        // Sincroniza com backend se autenticado
        if (token) {
          cartApi.updateCartItemQuantity(
            { cartItemId: item.id, quantity: safeQuantity },
            token
          ).catch((error) => {
            console.error("Erro ao atualizar quantidade no backend:", error)
          })
        }

        return {
          ...item,
          quantity: safeQuantity,
        }
      }),
    )
  }

  const clearCart: CartContextValue["clearCart"] = () => {
    setItems([])

    // Sincroniza com backend se autenticado
    if (token) {
      cartApi.clearCart(token).catch((error) => {
        console.error("Erro ao limpar carrinho no backend:", error)
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemsCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ==== Hook ====

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}