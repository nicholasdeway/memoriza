const API_BASE_URL = "/api-proxy";

export interface AdminOrder {
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
    paymentMethod: string
    itemsCount: number
}

export interface UpdateOrderStatusDto {
    newStatus: string
    note?: string
    adminUserId?: string // Optional if backend takes from token
}

export interface UpdateTrackingDto {
    trackingCode: string
    trackingCompany?: string
    trackingUrl?: string
}

export async function getAdminOrders() {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao buscar pedidos")
    return res.json()
}

export async function getAdminOrderById(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao buscar detalhe do pedido")
    return res.json()
}

export async function updateOrderStatus(
    id: string,
    data: UpdateOrderStatusDto
) {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao atualizar status")
    return true
}

export async function updateOrderTracking(
    id: string,
    data: UpdateTrackingDto
) {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/tracking`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao atualizar rastreamento")
    return true
}

export async function approveRefund(
    id: string,
    adminUserId: string,
    note?: string
) {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/refund/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminUserId, note }),
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao aprovar reembolso")
    return true
}

export async function rejectRefund(
    id: string,
    adminUserId: string,
    note?: string
) {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/refund/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminUserId, note }),
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao recusar reembolso")
    return true
}

export async function getPaidOrdersCount() {
    const res = await fetch(`${API_BASE_URL}/api/admin/orders/count/paid`, {
        credentials: "include",
    })
    if (!res.ok) throw new Error("Falha ao buscar contagem de pedidos")
    const data = await res.json()
    return data.count as number
}
