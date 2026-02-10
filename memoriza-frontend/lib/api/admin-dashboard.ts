const API_BASE_URL = "/api-proxy";

export interface DashboardSummary {
    totalSales: number;
    totalRefunds: number;
    totalOrders: number;
    ordersAwaitingPayment: number;
    ordersPaid: number;
    ordersCancelled: number;
    ordersInProduction: number;
    ordersFinished: number;
}

export interface TopProduct {
    productId: string;
    productName: string;
    quantitySold: number;
    totalAmount: number;
}

export interface RecentOrder {
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

export interface SalesByMonth {
    month: string;
    sales: number;
}

/**
 * Busca o resumo do dashboard com métricas agregadas
 * @param from Data inicial (opcional, padrão: 30 dias atrás)
 * @param to Data final (opcional, padrão: hoje)
 */
export async function getDashboardSummary(
    from?: Date,
    to?: Date
): Promise<DashboardSummary> {
    const params = new URLSearchParams();

    if (from) {
        params.append("from", from.toISOString());
    }
    if (to) {
        params.append("to", to.toISOString());
    }

    const url = `${API_BASE_URL}/api/admin/dashboard/summary${params.toString() ? `?${params.toString()}` : ""
        }`;

    const res = await fetch(url, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Falha ao buscar resumo do dashboard");
    }

    return res.json();
}

/**
 * Busca os produtos mais vendidos
 * @param from Data inicial (opcional, padrão: 30 dias atrás)
 * @param to Data final (opcional, padrão: hoje)
 * @param limit Número de produtos a retornar (padrão: 5)
 */
export async function getTopProducts(
    from?: Date,
    to?: Date,
    limit: number = 5
): Promise<TopProduct[]> {
    const params = new URLSearchParams();

    if (from) {
        params.append("from", from.toISOString());
    }
    if (to) {
        params.append("to", to.toISOString());
    }
    params.append("limit", limit.toString());

    const url = `${API_BASE_URL}/api/admin/dashboard/top-products?${params.toString()}`;

    const res = await fetch(url, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Falha ao buscar produtos mais vendidos");
    }

    return res.json();
}

/**
 * Busca os pedidos mais recentes
 * @param limit Número de pedidos a retornar (padrão: 5)
 */
export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    const url = `${API_BASE_URL}/api/admin/dashboard/recent-orders?${params.toString()}`;

    const res = await fetch(url, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Falha ao buscar pedidos recentes");
    }

    return res.json();
}

/**
 * Busca vendas agregadas por mês
 * @param from Data inicial (opcional, padrão: 30 dias atrás)
 * @param to Data final (opcional, padrão: hoje)
 */
export async function getSalesByMonth(
    from?: Date,
    to?: Date
): Promise<SalesByMonth[]> {
    const params = new URLSearchParams();

    if (from) {
        params.append("from", from.toISOString());
    }
    if (to) {
        params.append("to", to.toISOString());
    }

    const url = `${API_BASE_URL}/api/admin/dashboard/sales-by-month${params.toString() ? `?${params.toString()}` : ""
        }`;

    const res = await fetch(url, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Falha ao buscar vendas por mês");
    }

    return res.json();
}
