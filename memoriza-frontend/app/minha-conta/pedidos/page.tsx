"use client"

import { useState, useEffect, Suspense } from "react"
import { Package, ChevronRight, Search, X } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { mockOrders, orderStatusLabels, orderStatusColors } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function PedidosPageInner() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusFilter = searchParams.get("status")
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar pedidos do usuário atual (usando pedidos da Maria para demo)
  const userOrders = mockOrders.filter(
    (order) => order.clienteId === user?.id || order.clienteId === "2"
  )

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus = statusFilter ? order.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const clearFilter = () => {
    router.push("/minha-conta/pedidos")
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
                Filtro:{" "}
                {orderStatusLabels[statusFilter as keyof typeof orderStatusLabels]}
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
            key={order.id}
            href={`/minha-conta/pedidos/${order.id}`}
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
                  <p className="text-sm text-foreground/60 mt-1">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "itens"}
                  </p>
                  {order.status === "a_caminho" &&
                    (order as any).codigoRastreio && (
                      <div className="mt-2 text-xs text-accent">
                        <p className="font-medium">
                          Código: {(order as any).codigoRastreio}
                        </p>
                        <p className="text-foreground/60">
                          {(order as any).transportadora}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      orderStatusColors[order.status]
                    }`}
                  >
                    {orderStatusLabels[order.status]}
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