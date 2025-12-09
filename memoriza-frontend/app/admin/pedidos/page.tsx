"use client"

import { useState, useEffect } from "react"
import { Search, Eye, X, ChevronDown, Truck } from "lucide-react"
import {
  type OrderStatus,
  orderStatusLabels,
  orderStatusColors,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { usePermissions } from "@/lib/use-permissions"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

// =======================
// Tipos da API (backend)
// =======================

type BackendOrderStatus =
  | "Pending"
  | "Paid"
  | "InProduction"
  | "Shipped"
  | "Delivered"
  | "Refunded"
  | "Cancelled"

interface OrderListItemApi {
  id: string
  customerName: string
  subtotal: number
  freightValue: number
  total: number
  status: BackendOrderStatus
  createdAt: string
  trackingCode?: string | null
  trackingCompany?: string | null
  trackingUrl?: string | null
}

interface OrderItemApi {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

interface OrderDetailApi {
  id: string
  userId: string
  customerName: string

  subtotal: number
  freightValue: number
  total: number

  status: BackendOrderStatus
  personalizationNotes?: string | null
  createdAt: string

  trackingCode?: string | null
  trackingCompany?: string | null
  trackingUrl?: string | null
  deliveredAt?: string | null

  shippingAddressId?: string | null
  shippingStreet?: string | null
  shippingNumber?: string | null
  shippingComplement?: string | null
  shippingNeighborhood?: string | null
  shippingCity?: string | null
  shippingState?: string | null
  shippingZipCode?: string | null
  shippingCountry?: string | null

  items: OrderItemApi[]
}

// =======================
// Tipos internos (frontend)
// =======================

type OrderListItem = {
  id: string
  customerName: string
  subtotal: number
  freightValue: number
  total: number
  status: OrderStatus
  createdAt: string
}

type OrderDetail = {
  id: string
  userId: string
  customerName: string

  subtotal: number
  freightValue: number
  total: number

  status: OrderStatus
  personalizationNotes?: string | null
  createdAt: string

  trackingCode?: string | null
  trackingCompany?: string | null
  trackingUrl?: string | null
  deliveredAt?: string | null

  shippingAddressId?: string | null
  shippingStreet?: string | null
  shippingNumber?: string | null
  shippingComplement?: string | null
  shippingNeighborhood?: string | null
  shippingCity?: string | null
  shippingState?: string | null
  shippingZipCode?: string | null
  shippingCountry?: string | null

  items: {
    productId: string
    productName: string
    unitPrice: number
    quantity: number
    lineTotal: number
  }[]
}

// fluxo visual (mantive o mock)
const statusFlow: OrderStatus[] = [
  "aprovado",
  "em_producao",
  "a_caminho",
  "entregue",
]

// =======================
// Helpers de mapeamento
// =======================

const backendToUiStatus = (
  status: BackendOrderStatus | string,
): OrderStatus => {
  switch (status) {
    case "Pending":
      return "aguardando_pagamento" as OrderStatus
    case "Paid":
      return "aprovado"
    case "InProduction":
      return "em_producao"
    case "Shipped":
      return "a_caminho"
    case "Delivered":
      return "entregue"
    case "Refunded":
      return "reembolsado"
    case "Cancelled":
      return "cancelado"
    default:
      return "aguardando_pagamento" as OrderStatus
  }
}

const uiToBackendStatus = (status: OrderStatus): BackendOrderStatus => {
  const map: Record<string, BackendOrderStatus> = {
    aguardando_pagamento: "Pending",
    aprovado: "Paid",
    em_producao: "InProduction",
    a_caminho: "Shipped",
    entregue: "Delivered",
    reembolsado: "Refunded",
    cancelado: "Cancelled",
  }

  return map[status as string] ?? "Pending"
}

export default function AdminPedidos() {
  const { token, user } = useAuth()
  const { canEdit, canUpdateStatus } = usePermissions('orders')

  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("")

  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)

  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(
    null,
  )
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState<OrderDetail | null>(null)
  const [trackingData, setTrackingData] = useState({
    trackingCode: "",
    trackingCompany: "",
    trackingUrl: "",
  })

  // ===========================
  // Fetch listagem de pedidos
  // ===========================
  const fetchOrders = async () => {
    if (!token) return

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        console.error("Erro API:", res.status, res.statusText)
        try {
          const errorBody = await res.text()
          console.error("Error Body:", errorBody)
        } catch {
          // ignore
        }
        throw new Error(
          `Falha ao carregar pedidos: ${res.status} ${res.statusText}`,
        )
      }

      const data: OrderListItemApi[] = await res.json()

      const mapped: OrderListItem[] = data.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        subtotal: o.subtotal,
        freightValue: o.freightValue,
        total: o.total,
        status: backendToUiStatus(o.status),
        createdAt: o.createdAt,
      }))

      setOrders(mapped)
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error)
      toast.error("Não foi possível carregar os pedidos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchOrders()
  }, [token])

  // ===========================
  // Fetch detalhe de 1 pedido
  // ===========================
  const fetchOrderDetail = async (id: string): Promise<OrderDetail | null> => {
    if (!token) return null

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error("Falha ao carregar detalhes do pedido")
      }

      const data: OrderDetailApi = await res.json()

      const detail: OrderDetail = {
        id: data.id,
        userId: data.userId,
        customerName: data.customerName,
        subtotal: data.subtotal,
        freightValue: data.freightValue,
        total: data.total,
        status: backendToUiStatus(data.status),
        personalizationNotes: data.personalizationNotes,
        createdAt: data.createdAt,
        trackingCode: data.trackingCode ?? null,
        trackingCompany: data.trackingCompany ?? null,
        trackingUrl: data.trackingUrl ?? null,
        deliveredAt: data.deliveredAt ?? null,
        shippingAddressId: data.shippingAddressId ?? null,
        shippingStreet: data.shippingStreet ?? null,
        shippingNumber: data.shippingNumber ?? null,
        shippingComplement: data.shippingComplement ?? null,
        shippingNeighborhood: data.shippingNeighborhood ?? null,
        shippingCity: data.shippingCity ?? null,
        shippingState: data.shippingState ?? null,
        shippingZipCode: data.shippingZipCode ?? null,
        shippingCountry: data.shippingCountry ?? null,
        items: data.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        })),
      }

      return detail
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error)
      toast.error("Não foi possível carregar os detalhes do pedido.")
      return null
    }
  }

  // ===========================
  // Filtro na lista
  // ===========================
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = !filterStatus || o.status === filterStatus

    return matchSearch && matchStatus
  })

  // ===========================
  // Atualizar status (PUT /status)
  // ===========================
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return

    if (!canUpdateStatus) {
      toast.error("Você não tem permissão para atualizar status de pedidos")
      return
    }

    const previousOrders = [...orders]
    const previousSelected = selectedOrder

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
    setShowStatusDropdown(null)

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }

    try {
      const adminUserId =
        (user?.id as string | undefined) ??
        "00000000-0000-0000-0000-000000000000"

      const body = {
        newStatus: uiToBackendStatus(newStatus),
        adminUserId,
        note: null as string | null,
      }

      const res = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      )

      if (!res.ok) {
        throw new Error("Falha ao atualizar status")
      }

      toast.success("Status atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast.error("Erro ao atualizar status do pedido.")
      setOrders(previousOrders)
      setSelectedOrder(previousSelected)
    }
  }

  // ===========================
  // Abrir modal de detalhes
  // ===========================
  const openDetailModal = async (orderId: string) => {
    const detail = await fetchOrderDetail(orderId)
    if (!detail) return
    setSelectedOrder(detail)
  }

  // ===========================
  // Tracking: abrir modal
  // ===========================
  const openTrackingModal = async (orderId: string) => {
    if (!canEdit) {
      toast.error("Você não tem permissão para editar informações de rastreamento")
      return
    }

    const detail = await fetchOrderDetail(orderId)
    if (!detail) return

    setTrackingOrder(detail)
    setTrackingData({
      trackingCode: detail.trackingCode ?? "",
      trackingCompany: detail.trackingCompany ?? "",
      trackingUrl: detail.trackingUrl ?? "",
    })
    setShowTrackingModal(true)
  }

  // ===========================
  // Tracking: salvar (PUT /tracking)
  // ===========================
  const saveTracking = async () => {
    if (!trackingOrder || !token) return

    if (!canEdit) {
      toast.error("Você não tem permissão para editar informações de rastreamento")
      return
    }

    const previousOrders = [...orders]

    try {
      const dto: OrderDetailApi = {
        id: trackingOrder.id,
        userId: trackingOrder.userId,
        customerName: trackingOrder.customerName,
        subtotal: trackingOrder.subtotal,
        freightValue: trackingOrder.freightValue,
        total: trackingOrder.total,
        status: uiToBackendStatus(trackingOrder.status),
        personalizationNotes: trackingOrder.personalizationNotes ?? null,
        createdAt: trackingOrder.createdAt,
        trackingCode: trackingData.trackingCode,
        trackingCompany: trackingData.trackingCompany,
        trackingUrl: trackingData.trackingUrl,
        deliveredAt: trackingOrder.deliveredAt ?? null,
        items: trackingOrder.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        })),
      }

      const res = await fetch(
        `${API_BASE_URL}/api/admin/orders/${trackingOrder.id}/tracking`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dto),
        },
      )

      if (!res.ok) {
        throw new Error("Falha ao salvar rastreamento")
      }

      const newStatus = "a_caminho" as OrderStatus

      setOrders((prev) =>
        prev.map((o) =>
          o.id === trackingOrder.id ? { ...o, status: newStatus } : o,
        ),
      )

      if (selectedOrder?.id === trackingOrder.id) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          trackingCode: trackingData.trackingCode,
          trackingCompany: trackingData.trackingCompany,
          trackingUrl: trackingData.trackingUrl,
        })
      }

      setTrackingOrder({
        ...trackingOrder,
        status: newStatus,
        trackingCode: trackingData.trackingCode,
        trackingCompany: trackingData.trackingCompany,
        trackingUrl: trackingData.trackingUrl,
      })

      toast.success("Rastreamento salvo com sucesso!")
      setShowTrackingModal(false)
      setTrackingOrder(null)
      setTrackingData({
        trackingCode: "",
        trackingCompany: "",
        trackingUrl: "",
      })
    } catch (error) {
      console.error("Erro ao salvar rastreamento:", error)
      toast.error("Erro ao salvar informações de rastreamento.")
      setOrders(previousOrders)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-foreground/60">Carregando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-foreground">Pedidos</h1>
        <p className="text-foreground/60">
          Gerencie e acompanhe os pedidos dos clientes
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
          />
          <input
            type="text"
            placeholder="Buscar por ID ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as OrderStatus | "")
          }
          className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Todos os status</option>
          {Object.entries(orderStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Resumo por status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(orderStatusLabels).map(([status, label]) => {
          const typedStatus = status as OrderStatus
          const count = orders.filter((o) => o.status === typedStatus).length
          return (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(
                  filterStatus === typedStatus ? "" : typedStatus,
                )
              }
              className={`p-4 rounded-xl border transition-all ${
                filterStatus === typedStatus
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card hover:border-accent/50"
              }`}
            >
              <p className="text-2xl font-semibold text-foreground">{count}</p>
              <p className="text-sm text-foreground/60">{label}</p>
            </button>
          )
        })}
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Pedido
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-foreground/60"
                  >
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  // 👉 Só mostra valor real se estiver aprovado
                  const displayTotal =
                    order.status === "aprovado"
                      ? order.total && order.total > 0
                        ? order.total
                        : order.subtotal + (order.freightValue ?? 0)
                      : 0

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">
                          {order.customerName}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        R{"$ "}
                        {displayTotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          {canUpdateStatus ? (
                            <>
                              <button
                                onClick={() =>
                                  setShowStatusDropdown(
                                    showStatusDropdown === order.id
                                      ? null
                                      : order.id,
                                  )
                                }
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                  orderStatusColors[order.status]
                                }`}
                              >
                                {orderStatusLabels[order.status]}
                                <ChevronDown size={14} />
                              </button>

                              {showStatusDropdown === order.id && (
                                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]">
                                  {Object.entries(orderStatusLabels).map(
                                    ([status, label]) => (
                                      <button
                                        key={status}
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            status as OrderStatus,
                                          )
                                        }
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                          order.status === (status as OrderStatus)
                                            ? "bg-muted font-medium"
                                            : ""
                                        }`}
                                      >
                                        <span
                                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                            orderStatusColors[
                                              status as OrderStatus
                                            ]
                                              .replace("text-", "bg-")
                                              .split(" ")[0]
                                          }`}
                                        ></span>
                                        {label}
                                      </button>
                                    ),
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <span
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                orderStatusColors[order.status]
                              }`}
                            >
                              {orderStatusLabels[order.status]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => void openDetailModal(order.id)}
                            className="p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => void openTrackingModal(order.id)}
                              className="p-2 text-foreground/60 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                              title="Adicionar/Editar rastreio"
                            >
                              <Truck size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhes do Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Pedido {selectedOrder.id}
                </h2>
                <p className="text-sm text-foreground/60">
                  Criado em{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Status do Pedido
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orderStatusColors[selectedOrder.status]
                  }`}
                >
                  {orderStatusLabels[selectedOrder.status]}
                </span>
              </div>

              {/* Fluxo de status */}
              <div className="flex items-center justify-between">
                {statusFlow.map((status, idx) => {
                  const currentIndex = statusFlow.indexOf(
                    selectedOrder.status as OrderStatus,
                  )
                  const isActive = currentIndex >= idx
                  const isCurrent = selectedOrder.status === status

                  return (
                    <div key={status} className="flex items-center">
                      <div
                        className={`flex flex-col items-center ${
                          idx > 0 ? "ml-2" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            isActive
                              ? "bg-accent text-white"
                              : "bg-muted text-foreground/50"
                          } ${
                            isCurrent ? "ring-2 ring-accent ring-offset-2" : ""
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-xs text-foreground/60 mt-1">
                          {orderStatusLabels[status]}
                        </span>
                      </div>
                      {idx < statusFlow.length - 1 && (
                        <div
                          className={`w-12 h-0.5 mx-2 ${
                            isActive ? "bg-accent" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Dados Básicos do Cliente */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">
                  Dados do Cliente
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60">Nome</p>
                    <p className="text-foreground">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/60">ID do Usuário</p>
                    <p className="text-foreground">{selectedOrder.userId}</p>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {selectedOrder.shippingStreet && (
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">
                    Endereço de Entrega
                  </h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-foreground/60">Rua: </span>
                      <span className="text-foreground">
                        {selectedOrder.shippingStreet}
                        {selectedOrder.shippingNumber && `, ${selectedOrder.shippingNumber}`}
                      </span>
                    </div>
                    {selectedOrder.shippingComplement && (
                      <div>
                        <span className="text-foreground/60">Complemento: </span>
                        <span className="text-foreground">{selectedOrder.shippingComplement}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-foreground/60">Bairro: </span>
                      <span className="text-foreground">{selectedOrder.shippingNeighborhood}</span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Cidade: </span>
                      <span className="text-foreground">
                        {selectedOrder.shippingCity} - {selectedOrder.shippingState}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground/60">CEP: </span>
                      <span className="text-foreground">{selectedOrder.shippingZipCode}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Itens */}
              <div>
                <h3 className="font-medium text-foreground mb-3">
                  Itens do Pedido
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-foreground">{item.productName}</p>
                        <p className="text-sm text-foreground/60">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-foreground">
                        R{"$ "}
                        {item.lineTotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="text-foreground">
                      R{"$ "}
                      {selectedOrder.subtotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Frete</span>
                    <span className="text-foreground">
                      {selectedOrder.freightValue === 0
                        ? "Grátis"
                        : `R$ ${selectedOrder.freightValue.toLocaleString(
                            "pt-BR",
                            { minimumFractionDigits: 2 },
                          )}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">
                      R{"$ "}
                      {selectedOrder.total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rastreamento */}
      {showTrackingModal && trackingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  Adicionar Rastreamento
                </h2>
                <p className="text-sm text-foreground/60">
                  Pedido {trackingOrder.id}
                </p>
              </div>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Código de Rastreio
                </label>
                <input
                  type="text"
                  value={trackingData.trackingCode}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      trackingCode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ex: BR123456789BR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Transportadora
                </label>
                <input
                  type="text"
                  value={trackingData.trackingCompany}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      trackingCompany: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ex: Correios"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL de Rastreamento
                </label>
                <input
                  type="url"
                  value={trackingData.trackingUrl}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      trackingUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://rastreamento.correios.com.br"
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-foreground/70">
                  Ao salvar, o status do pedido pode ser atualizado para
                  &quot;A Caminho&quot; no painel.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveTracking}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                disabled={
                  !trackingData.trackingCode ||
                  !trackingData.trackingCompany ||
                  !trackingData.trackingUrl
                }
              >
                Salvar Rastreamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}