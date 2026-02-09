import type {
    CartSummaryResponse,
    CartItemDto,
    AddCartItemRequest,
    UpdateCartItemQuantityRequest,
    RemoveCartItemRequest,
} from "@/types/cart"

const API_BASE_URL = "/api-proxy";

/**
 * Busca o carrinho do usuário logado
 */
export async function getCart(): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart`, {
        credentials: "include",
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
    request: AddCartItemRequest
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
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
    request: UpdateCartItemQuantityRequest
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
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
    request: RemoveCartItemRequest
): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/items`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    })

    if (!res.ok) {
        throw new Error("Não foi possível remover item.")
    }

    return res.json()
}

/**
 * Limpa todo o carrinho
 */
export async function clearCart(): Promise<CartSummaryResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/cart/clear`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirm: true }),
        credentials: "include",
    })

    if (!res.ok) {
        const errorText = await res.text().catch(() => "Erro desconhecido")
        throw new Error("Não foi possível limpar carrinho.")
    }

    return res.json()
}
