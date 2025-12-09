import type {
    CartSummaryResponse,
    CartItemDto,
    AddCartItemRequest,
    UpdateCartItemQuantityRequest,
    RemoveCartItemRequest,
} from "@/types/cart"

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

/**
 * Busca o carrinho do usuário logado
 */
export async function getCart(token: string): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        throw new Error(`Erro ao buscar carrinho: ${res.status}`)
    }

    return res.json()
}

/**
 * Adiciona um item ao carrinho
 */
export async function addCartItem(
    request: AddCartItemRequest,
    token: string
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => null)

        if (errorData && typeof errorData === "object") {
            if (Array.isArray(errorData)) {
                throw new Error(errorData.join(", "))
            }
            if (errorData.message || errorData.error) {
                throw new Error(errorData.message || errorData.error)
            }
        }

        throw new Error("Não foi possível adicionar item ao carrinho.")
    }

    return res.json()
}

/**
 * Atualiza a quantidade de um item no carrinho
 */
export async function updateCartItemQuantity(
    request: UpdateCartItemQuantityRequest,
    token: string
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        throw new Error("Não foi possível atualizar quantidade.")
    }

    return res.json()
}

/**
 * Remove um item do carrinho
 */
export async function removeCartItem(
    request: RemoveCartItemRequest,
    token: string
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    })

    if (!res.ok) {
        throw new Error("Não foi possível remover item.")
    }

    return res.json()
}

/**
 * Limpa todo o carrinho
 */
export async function clearCart(token: string): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/clear`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirm: true }),
    })

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Erro desconhecido")
        console.error("Erro ao limpar carrinho:", errorText)
        throw new Error("Não foi possível limpar carrinho.")
    }

    return res.json()
}
