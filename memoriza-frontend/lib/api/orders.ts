import type {
    OrderSummaryResponse,
    OrderDetailResponse,
    CreateOrderRequest,
    CheckoutInitResponse,
    RefundRequest,
    RefundStatusResponse,
} from "@/types/orders"

const API_BASE_URL = "/api-proxy";

/**
 * Busca todos os pedidos do usuário logado
 */
export async function getMyOrders(): Promise<OrderSummaryResponse[]> {
    const res = await fetch(`${API_BASE_URL}/api/user/orders`, {
        credentials: "include",
    })

    if (!res.ok) {
        throw new Error(`Erro ao buscar pedidos: ${res.status}`)
    }

    return res.json()
}

/**
 * Busca detalhes de um pedido específico
 */
export async function getOrderDetail(
    orderId: string
): Promise<OrderDetailResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}`, {
        credentials: "include",
    })

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Pedido não encontrado")
        }
        throw new Error(`Erro ao buscar detalhes do pedido: ${res.status}`)
    }

    return res.json()
}

/**
 * Realiza checkout e cria pedido com integração Mercado Pago
 */
export async function checkout(
    request: CreateOrderRequest
): Promise<CheckoutInitResponse> {

    const res = await fetch(`${API_BASE_URL}/api/user/orders/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    })

    const contentType = res.headers.get("content-type") || ""

    if (!res.ok) {
        let errorMessage =
            `Erro ${res.status}: Não foi possível finalizar o pedido.`

        try {
            if (contentType.includes("application/json")) {
                const errorData = await res.json().catch(() => null)

                if (errorData && typeof errorData === "object") {
                    // array de erros
                    if (Array.isArray(errorData)) {
                        errorMessage = errorData.join(", ")
                    }
                    // { message, error }
                    else if (errorData.message || errorData.error) {
                        errorMessage = errorData.message || errorData.error
                    }
                    // { errors: { campo: [..] } }
                    else if (errorData.errors) {
                        const messages = Object.values(errorData.errors).flat() as string[]
                        errorMessage = messages.join(", ")
                    }
                    // ProblemDetails
                    else if (errorData.title) {
                        errorMessage = errorData.title
                    }
                }
            } else {
                // 🔥 Aqui cobre o caso atual: text/plain
                const text = await res.text().catch(() => "")
                if (text) errorMessage = text
            }
        } catch (parseErr) {
            // Silently handle parse errors
        }

        throw new Error(errorMessage)
    }

    // sucesso → sempre JSON
    const data = (await res.json()) as CheckoutInitResponse
    return data
}

/**
 * Solicita reembolso para um pedido
 */
export async function requestRefund(
    orderId: string,
    reason: string
): Promise<RefundStatusResponse> {
    const request: RefundRequest = {
        orderId,
        reason,
    }

    const res = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}/refund`, {
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

        throw new Error("Não foi possível solicitar o reembolso. Tente novamente.")
    }

    return res.json()
}

/**
 * Processa pagamento direto (Checkout Transparente)
 */
export async function processPayment(
    orderId: string,
    request: import("@/types/orders").ProcessPaymentRequest
): Promise<import("@/types/orders").ProcessPaymentResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}/process-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        credentials: "include",
    })

    const contentType = res.headers.get("content-type") || ""

    if (!res.ok) {
        let errorMessage = `Erro ${res.status}: Não foi possível processar o pagamento.`

        try {
            if (contentType.includes("application/json")) {
                const errorData = await res.json().catch(() => null)

                if (errorData && typeof errorData === "object") {
                    // Array de erros
                    if (Array.isArray(errorData)) {
                        errorMessage = errorData.join(", ")
                    }
                    // { message, error }
                    else if (errorData.message || errorData.error) {
                        errorMessage = errorData.message || errorData.error
                    }
                    // { errors: { campo: [...] } } - Validation errors
                    else if (errorData.errors) {
                        const messages = Object.values(errorData.errors).flat() as string[]
                        errorMessage = messages.join(", ")
                    }
                    // ProblemDetails
                    else if (errorData.title) {
                        errorMessage = errorData.title
                    }
                }
            } else {
                // Plain text response
                const text = await res.text().catch(() => "")
                if (text) errorMessage = text
            }
        } catch (parseErr) {
            console.error("Error parsing error response:", parseErr)
        }

        throw new Error(errorMessage)
    }

    return res.json()
}
