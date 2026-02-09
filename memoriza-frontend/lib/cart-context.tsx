"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartApi,
} from "@/lib/api/cart"
import type { CartItemDto } from "@/types/cart"
import { toast } from "sonner"

const API_BASE_URL = "/api-proxy";

// Local cart item structure (for localStorage)
export interface LocalCartItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
  sizeId?: number
  sizeName?: string
  colorId?: number
  colorName?: string
  personalizationText?: string
}

type CartContextValue = {
  items: LocalCartItem[]
  itemsCount: number
  subtotal: number
  addItem: (params: {
    productId: string
    name: string
    price: number
    imageUrl: string | null
    quantity?: number
    sizeId?: number
    sizeName?: string
    colorId?: number
    colorName?: string
    personalizationText?: string
  }) => Promise<void>
  updateQuantity: (
    productId: string,
    quantity: number,
    sizeId?: number,
    colorId?: number,
    personalizationText?: string
  ) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const CART_STORAGE_KEY = "memoriza_cart"

/* ======================================================
   Helper: Generate unique cart item ID
====================================================== */
function generateCartItemId(
  productId: string,
  sizeId?: number,
  colorId?: number,
  personalizationText?: string
): string {
  const parts = [productId]
  if (sizeId) parts.push(`s${sizeId}`)
  if (colorId) parts.push(`c${colorId}`)
  if (personalizationText) parts.push(`p${personalizationText}`)
  return parts.join("-")
}

/* ======================================================
   Helper: Convert backend DTO to local cart item
====================================================== */
function convertDtoToLocalItem(dto: CartItemDto): LocalCartItem {
  return {
    id: dto.cartItemId,
    productId: dto.productId,
    name: dto.productName,
    price: dto.unitPrice,
    imageUrl: dto.thumbnailUrl,
    quantity: dto.quantity,
    sizeId: dto.sizeId,
    sizeName: dto.sizeName,
    colorId: dto.colorId,
    colorName: dto.colorName,
    personalizationText: dto.personalizationText,
  }
}

/* ======================================================
   CartProvider
====================================================== */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<LocalCartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMigratedCart, setHasMigratedCart] = useState(false)

  /* ======================================================
     Load cart from localStorage (for non-logged users)
  ====================================================== */
  const loadLocalCart = useCallback(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as LocalCartItem[]
      }
    } catch (error) {
      // Silently handle localStorage errors
    }
    return []
  }, [])

  /* ======================================================
     Save cart to localStorage
  ====================================================== */
  const saveLocalCart = useCallback((cartItems: LocalCartItem[]) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [])

  /* ======================================================
     Clear localStorage cart
  ====================================================== */
  const clearLocalCart = useCallback(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [])

  /* ======================================================
     Fetch cart from backend (for logged users)
  ====================================================== */
  const fetchBackendCart = useCallback(async () => {
    try {
      const response = await getCart()
      const backendItems = response.items.map(convertDtoToLocalItem)
      setItems(backendItems)
      return backendItems
    } catch (error) {
      // Silently handle cart fetch errors
      return []
    }
  }, [])

  /* ======================================================
     Migrate local cart to backend after login
  ====================================================== */
  const migrateLocalCartToBackend = useCallback(
    async (localItems: LocalCartItem[]) => {
      if (localItems.length === 0) return

      try {
        // Add each local item to backend
        for (const item of localItems) {
          await addCartItem(
            {
              productId: item.productId,
              quantity: item.quantity,
              sizeId: item.sizeId,
              colorId: item.colorId,
              sizeName: item.sizeName,
              colorName: item.colorName,
              personalizationText: item.personalizationText,
            }
          )
        }

        // Clear local storage after successful migration
        clearLocalCart()
        
        // Fetch updated cart from backend
        await fetchBackendCart()
      } catch (error) {
        toast.error("Erro ao sincronizar carrinho")
      }
    },
    [clearLocalCart, fetchBackendCart]
  )

  /* ======================================================
     Initialize cart on mount and when auth changes
  ====================================================== */
  useEffect(() => {
    // Wait for auth to initialize
    if (authLoading) return

    const initializeCart = async () => {
      setIsLoading(true)

      if (user) {
        // User is logged in
        const localItems = loadLocalCart()
        
        // Fetch backend cart first
        const backendItems = await fetchBackendCart()
        
        // If we have local items and haven't migrated yet, do it now
        if (localItems.length > 0 && !hasMigratedCart) {
          await migrateLocalCartToBackend(localItems)
          setHasMigratedCart(true)
        }
      } else {
        // User is not logged in, load from localStorage
        const localItems = loadLocalCart()
        setItems(localItems)
        setHasMigratedCart(false)
      }

      setIsLoading(false)
    }

    void initializeCart()
  }, [user, authLoading, loadLocalCart, fetchBackendCart, migrateLocalCartToBackend, hasMigratedCart])

  /* ======================================================
     Save to localStorage whenever items change (for non-logged users)
  ====================================================== */
  useEffect(() => {
    if (!user && !isLoading) {
      saveLocalCart(items)
    }
  }, [items, user, isLoading, saveLocalCart])

  /* ======================================================
     ADD ITEM
  ====================================================== */
  const addItem = useCallback(
    async (params: {
      productId: string
      name: string
      price: number
      imageUrl: string | null
      quantity?: number
      sizeId?: number
      sizeName?: string
      colorId?: number
      colorName?: string
      personalizationText?: string
    }) => {
      const {
        productId,
        name,
        price,
        imageUrl,
        quantity = 1,
        sizeId,
        sizeName,
        colorId,
        colorName,
        personalizationText,
      } = params

      if (user) {
        // User is logged in, use backend
        try {
          const response = await addCartItem(
            {
              productId,
              quantity,
              sizeId,
              colorId,
              sizeName,
              colorName,
              personalizationText,
            }
          )
          const backendItems = response.items.map(convertDtoToLocalItem)
          setItems(backendItems)
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erro ao adicionar produto ao carrinho"
          )
        }
      } else {
        // User is not logged in, use localStorage
        const itemId = generateCartItemId(
          productId,
          sizeId,
          colorId,
          personalizationText
        )

        setItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === itemId)

          if (existingItem) {
            // Update quantity of existing item
            return prevItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            // Add new item
            const newItem: LocalCartItem = {
              id: itemId,
              productId,
              name,
              price,
              imageUrl,
              quantity,
              sizeId,
              sizeName,
              colorId,
              colorName,
              personalizationText,
            }
            return [...prevItems, newItem]
          }
        })
      }
    },
    [user]
  )

  /* ======================================================
     UPDATE QUANTITY
  ====================================================== */
  const updateQuantity = useCallback(
    async (
      productId: string,
      quantity: number,
      sizeId?: number,
      colorId?: number,
      personalizationText?: string
    ) => {
      if (quantity < 1) return

      if (user) {
        // User is logged in, use backend
        try {
          // Find the cart item ID from current items
          const itemId = generateCartItemId(
            productId,
            sizeId,
            colorId,
            personalizationText
          )
          const item = items.find((i) => i.id === itemId)

          if (!item) {
            return
          }

          const response = await updateCartItemQuantity(
            {
              cartItemId: item.id,
              quantity,
            }
          )
          const backendItems = response.items.map(convertDtoToLocalItem)
          setItems(backendItems)
        } catch (error) {
          toast.error("Erro ao atualizar quantidade")
        }
      } else {
        // User is not logged in, use localStorage
        const itemId = generateCartItemId(
          productId,
          sizeId,
          colorId,
          personalizationText
        )

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        )
      }
    },
    [user, items]
  )

  /* ======================================================
     REMOVE ITEM
  ====================================================== */
  const removeItem = useCallback(
    async (itemId: string) => {
      if (user) {
        // User is logged in, use backend
        try {
          const response = await removeCartItem(
            {
              cartItemId: itemId,
            }
          )
          const backendItems = response.items.map(convertDtoToLocalItem)
          setItems(backendItems)
          toast.success("Produto removido do carrinho")
        } catch (error) {
          toast.error("Erro ao remover produto")
        }
      } else {
        // User is not logged in, use localStorage
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
        toast.success("Produto removido do carrinho")
      }
    },
    [user]
  )

  /* ======================================================
     CLEAR CART
  ====================================================== */
  const clearCart = useCallback(async () => {
    if (user) {
      // User is logged in, use backend
      try {
        await clearCartApi()
        setItems([])
        toast.success("Carrinho limpo")
      } catch (error) {
        toast.error("Erro ao limpar carrinho")
      }
    } else {
      // User is not logged in, use localStorage
      setItems([])
      clearLocalCart()
      toast.success("Carrinho limpo")
    }
  }, [user, clearLocalCart])

  /* ======================================================
     Calculate derived values
  ====================================================== */
  const itemsCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemsCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isLoading,
    }),
    [items, itemsCount, subtotal, addItem, updateQuantity, removeItem, clearCart, isLoading]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* ======================================================
   useCart Hook
====================================================== */
export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart deve ser utilizado dentro de um CartProvider")
  }
  return ctx
}