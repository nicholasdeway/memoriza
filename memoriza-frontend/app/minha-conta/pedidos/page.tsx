"use client"

import { useState, useEffect, Suspense } from "react"
import { Package, ChevronRight, Search, X } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getRefundStatusLabel } from "@/lib/utils"

function PedidosPageInner() {
  const { user, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusFilter = searchParams.get("status")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estados para dados da API
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar pedidos da API
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { getMyOrders } = await import("@/lib/api/orders")
        const data = await getMyOrders() // Cookie auth
        
        // Mapear para formato esperado pelo componente
        const mappedOrders = data.map((order) => ({
          id: order.orderNumber,
          orderId: order.orderId,
          createdAt: order.createdAt,
          total: order.totalAmount,
          status: order.status,
          isRefundable: order.isRefundable,
          refundStatus: order.refundStatus,
          items: [], // Não temos items no summary, mas precisamos para a busca
        }))
        
        setOrders(mappedOrders)
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar pedidos")
      } finally {
        setLoading(false)
      }
    }

    void fetchOrders()
  }, [user, authLoading])

  // Mapeamento de status para cores (mantendo compatibilidade)
  const orderStatusColors: Record<string, string> = {
    "Pendente": "bg-yellow-100 text-yellow-700",
    "Aprovado": "bg-green-100 text-green-700",
    "Em Produção": "bg-blue-100 text-blue-700",
    "À Caminho": "bg-purple-100 text-purple-700",
    "Entregue": "bg-emerald-100 text-emerald-700",
    "Cancelado": "bg-red-100 text-red-700",
    "Reembolsado": "bg-orange-100 text-orange-700",
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? order.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const clearFilter = () => {
    router.push("/minha-conta/pedidos")
  }

  if (loading) {
    return (
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="text-center py-12 text-foreground/60">
          <Package size={48} className="mx-auto mb-4 opacity-50 animate-pulse" />
          <p>Carregando seus pedidos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="text-center py-12 text-foreground/60">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-accent hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-medium text-foreground">Meus Pedidos</h2>
          <p className="text-sm text-foreground/60">
            Acompanhe seus pedidos e histórico de compras
          </p>
          {statusFilter && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded-md">
                Filtro: {statusFilter}
              </span>
              <button
                onClick={clearFilter}
                className="text-foreground/60 hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pedido..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Link
            key={order.orderId}
            href={`/minha-conta/pedidos/${order.orderId}`}
            className="block border border-border rounded-xl p-4 hover:border-accent/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Package size={24} className="text-foreground/60" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {order.refundStatus && order.refundStatus !== "None" && (
                    <p className="text-xs text-orange-600 mt-1">
                      {getRefundStatusLabel(order.refundStatus)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      orderStatusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="font-semibold text-foreground mt-2">
                    R${" "}
                    {order.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <ChevronRight size={20} className="text-foreground/40" />
              </div>
            </div>
          </Link>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

// useSearchParams
export default function PedidosPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background border border-border rounded-xl p-6">
          <div className="text-center py-12 text-foreground/60">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>Carregando seus pedidos...</p>
          </div>
        </div>
      }
    >
      <PedidosPageInner />
    </Suspense>
  )
}