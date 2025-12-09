import type {
    OrderSummaryResponse,
    OrderDetailResponse,
    CreateOrderRequest,
    CheckoutInitResponse,
    RefundRequest,
    RefundStatusResponse,
} from "@/types/orders"

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

/**
 * Busca todos os pedidos do usuário logado
 */
export async function getMyOrders(
    token: string
): Promise<OrderSummaryResponse[]> {
    const res = await fetch(`${API_BASE_URL}/api/user/orders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    orderId: string,
    token: string
): Promise<OrderDetailResponse> {
    const res = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    request: CreateOrderRequest,
    token: string
): Promise<CheckoutInitResponse> {
    console.log("🚀 Checkout request payload:", JSON.stringify(request, null, 2))
    console.log("🔑 Token presente:", token ? "Sim" : "Não")
    console.log("🔑 Token (primeiros 20 chars):", token?.substring(0, 20))
    console.log("🌐 API URL:", `${API_BASE_URL}/api/user/orders/checkout`)

    const res = await fetch(`${API_BASE_URL}/api/user/orders/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
    })

    console.log("📡 Response status:", res.status)
    console.log("📡 Response headers:", Object.fromEntries(res.headers.entries()))

    const contentType = res.headers.get("content-type") || ""

    if (!res.ok) {
        let errorMessage =
            `Erro ${res.status}: Não foi possível finalizar o pedido.`

        try {
            if (contentType.includes("application/json")) {
                const errorData = await res.json().catch(() => null)
                console.error("❌ Checkout error (JSON):", errorData)

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
                console.error("❌ Checkout error (texto):", text)
                if (text) errorMessage = text
            }
        } catch (parseErr) {
            console.error("❌ Erro ao ler corpo de erro:", parseErr)
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
    reason: string,
    token: string
): Promise<RefundStatusResponse> {
    const request: RefundRequest = {
        orderId,
        reason,
    }

    const res = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}/refund`, {
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

        throw new Error("Não foi possível solicitar o reembolso. Tente novamente.")
    }

    return res.json()
}
