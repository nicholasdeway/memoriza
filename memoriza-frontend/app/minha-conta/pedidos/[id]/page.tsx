"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getOrderDetail, requestRefund } from "@/lib/api/orders"
import type { OrderDetailResponse } from "@/types/orders"
import { toast } from "sonner"

// Mapeamento de status para timeline
const statusTimeline: { status: string; icon: React.ElementType; label: string }[] = [
  { status: "Aprovado", icon: CheckCircle, label: "Aprovado" },
  { status: "Em Produção", icon: Clock, label: "Em Produção" },
  { status: "À Caminho", icon: Truck, label: "À Caminho" },
  { status: "Entregue", icon: Package, label: "Entregue" },
]

const statusOrder: string[] = ["Aprovado", "Em Produção", "À Caminho", "Entregue"]

// Cores para cada status
const orderStatusColors: Record<string, string> = {
  "Pendente": "bg-yellow-100 text-yellow-700",
  "Aprovado": "bg-green-100 text-green-700",
  "Em Produção": "bg-blue-100 text-blue-700",
  "À Caminho": "bg-purple-100 text-purple-700",
  "Entregue": "bg-emerald-100 text-emerald-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Reembolsado": "bg-orange-100 text-orange-700",
}

export default function PedidoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reembolsoModalOpen, setReembolsoModalOpen] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [submittingRefund, setSubmittingRefund] = useState(false)
  const [activeStep, setActiveStep] = useState<string>("Aprovado")

  // Buscar detalhes do pedido
  useEffect(() => {
    if (!token || !params.id) {
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getOrderDetail(params.id as string, token)
        setOrder(data)
        setActiveStep(data.status)
      } catch (err) {
        console.error("Erro ao buscar pedido:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar pedido")
      } finally {
        setLoading(false)
      }
    }

    void fetchOrder()
  }, [token, params.id])

  const handleReembolso = async () => {
    if (!motivo.trim()) {
      toast.error("Por favor, descreva o motivo do reembolso.")
      return
    }

    if (!order || !token) return

    try {
      setSubmittingRefund(true)
      
      await requestRefund(order.orderId, motivo, token)
      
      toast.success("Solicitação de reembolso enviada com sucesso!")
      setReembolsoModalOpen(false)
      setMotivo("")
      
      // Recarregar pedido para atualizar status
      const updatedOrder = await getOrderDetail(order.orderId, token)
      setOrder(updatedOrder)
    } catch (err) {
      console.error("Erro ao solicitar reembolso:", err)
      toast.error(err instanceof Error ? err.message : "Erro ao solicitar reembolso")
    } finally {
      setSubmittingRefund(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          href="/minha-conta/pedidos"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar para Meus Pedidos
        </Link>
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-foreground/40 animate-pulse" />
          <p className="text-foreground/60">Carregando detalhes do pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/minha-conta/pedidos"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          Voltar para Meus Pedidos
        </Link>
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-foreground/40" />
          <p className="text-foreground/60 mb-4">{error || "Pedido não encontrado"}</p>
          <Link href="/minha-conta/pedidos" className="text-accent hover:underline">
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)
  const canRequestRefund = order.isRefundable && (!order.refundStatus || order.refundStatus === "None")
  const hasRefundRequest = order.refundStatus && order.refundStatus !== "None"

  const renderStepContent = () => {
    switch (activeStep) {
      case "Aprovado":
        return (
          <div className="bg-background border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Pagamento Aprovado</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Seu pagamento foi confirmado e o pedido foi encaminhado para produção.
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Data de Aprovação</span>
                    <span className="font-medium text-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Total Pago</span>
                    <span className="font-medium text-foreground">
                      R$ {order.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Em Produção":
        return (
          <div className="bg-background border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Em Produção</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Seus itens estão sendo preparados com carinho pela nossa equipe.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-foreground/70 italic">
                    "A qualidade leva tempo. Estamos garantindo que tudo saia perfeito para você!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case "À Caminho":
        return (
          <div className="bg-background border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
                <Truck size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Pedido Enviado</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Seu pedido já está com a transportadora e logo chegará até você.
                </p>

                {order.trackingCode ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg space-y-3 mb-4">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-foreground/60">Código de Rastreio</span>
                        <span className="font-mono font-medium text-foreground">{order.trackingCode}</span>
                      </div>
                      {order.trackingCompany && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-sm text-foreground/60">Transportadora</span>
                          <span className="font-medium text-foreground">{order.trackingCompany}</span>
                        </div>
                      )}
                    </div>

                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      >
                        <Truck size={18} />
                        Rastrear Entrega
                      </a>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                    Aguardando informações de rastreamento.
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "Entregue":
        return (
          <div className="bg-background border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                <Package size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Pedido Entregue</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Oba! Seu pedido foi entregue. Esperamos que você ame seus produtos!
                </p>
                
                {order.shippingAddress && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-foreground/60" />
                      <span className="text-sm font-medium text-foreground">Entregue em:</span>
                    </div>
                    <p className="text-sm text-foreground/70 ml-6">
                      {order.shippingAddress.street}, {order.shippingAddress.number}
                      <br />
                      {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}
                    </p>
                  </div>
                )}

                {canRequestRefund && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg text-xs text-orange-700">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <p>Precisa devolver? Você tem até 7 dias após o recebimento para solicitar o cancelamento ou reembolso.</p>
                    </div>
                    <button
                      onClick={() => setReembolsoModalOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 border border-orange-300 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                    >
                      <RefreshCcw size={18} />
                      Solicitar Reembolso
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/minha-conta/pedidos"
        className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} />
        Voltar para Meus Pedidos
      </Link>

      {/* Header */}
      <div className="bg-background border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-foreground">{order.orderNumber}</h1>
            <p className="text-foreground/60 mt-1">
              Realizado em{" "}
              {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              orderStatusColors[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Payment Recovery Actions */}
      {order.status === "Pendente" && order.canResume && order.initPoint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="text-yellow-600 mt-0.5" size={24} />
            <div>
              <h3 className="font-medium text-yellow-900">Pagamento Pendente</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Seu pedido foi criado, mas o pagamento ainda não foi confirmado.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (order.initPoint) {
                window.location.href = order.initPoint
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            <CreditCard size={18} />
            Concluir Compra
          </button>

        </div>
      )}

      {/* Status Timeline Navigation */}
      {order.status !== "Reembolsado" && order.status !== "Cancelado" && (
        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Linha do Tempo</h3>
          <div className="flex items-center justify-between relative">
             {/* Connecting Line Container - Spans from center of first to center of last item (12.5% to 87.5%) */}
            <div className="absolute top-6 left-[12.5%] right-[12.5%] h-1 -z-0">
              {/* Background Line */}
              <div className="absolute inset-0 bg-border" />
              
              {/* Active Progress Line */}
              <div 
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-500 "
                style={{ 
                  width: `${(currentStatusIndex / (statusTimeline.length - 1)) * 100}%` 
                }} 
              />
            </div>

            {statusTimeline.map((step, idx) => {
              const Icon = step.icon
              const isCompleted = currentStatusIndex >= idx
              const isActive = activeStep === step.status
              const isClickable = isCompleted

              return (
                <button
                  key={step.status}
                  onClick={() => isClickable && setActiveStep(step.status)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center flex-1 group relative z-10 ${
                    isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-accent text-accent-foreground scale-110 ring-4 ring-accent/30 shadow-lg"
                        : isCompleted
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "bg-muted text-foreground/40"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <p
                    className={`text-xs mt-3 text-center font-medium transition-colors ${
                      isActive ? "text-accent" : isCompleted ? "text-foreground" : "text-foreground/50"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <div className="absolute -bottom-6 w-3 h-3 bg-accent rotate-45 rounded-[1px]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Dynamic Step Content */}
      {order.status !== "Reembolsado" && order.status !== "Cancelado" && renderStepContent()}

      {/* Cancelled/Refunded Status */}
      {(order.status === "Reembolsado" || order.status === "Cancelado") && (
        <div
          className={`border rounded-xl p-6 ${
            order.status === "Reembolsado" ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {order.status === "Reembolsado" ? (
              <RefreshCcw className="text-orange-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className={`font-medium ${order.status === "Reembolsado" ? "text-orange-700" : "text-red-700"}`}>
                {order.status === "Reembolsado" ? "Pedido Reembolsado" : "Pedido Cancelado"}
              </p>
              <p className={`text-sm ${order.status === "Reembolsado" ? "text-orange-600" : "text-red-600"}`}>
                Status: {order.refundStatus || "Processando"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Status */}
      {hasRefundRequest && order.status !== "Reembolsado" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <RefreshCcw className="text-orange-600" size={24} />
            <div>
              <p className="font-medium text-orange-700">Solicitação de Reembolso</p>
              <p className="text-sm text-orange-600">
                Status: {order.refundStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-background border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-4">Itens do Pedido</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={24} className="text-foreground/40" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.productName}</p>
                    <p className="text-sm text-foreground/60">Qtd: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-foreground">
                  R${" "}
                  {(item.unitPrice * item.quantity).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Subtotal</span>
              <span>R$ {order.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Frete</span>
              <span>
                {order.shippingAmount === 0
                  ? "Grátis"
                  : `R$ ${order.shippingAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>R$ {order.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Delivery Address */}
          {order.shippingAddress && (
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-foreground/60" />
                <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
              </div>
              <p className="text-sm text-foreground/70">{order.shippingAddress.street}, {order.shippingAddress.number}</p>
              {order.shippingAddress.complement && (
                <p className="text-sm text-foreground/70">{order.shippingAddress.complement}</p>
              )}
              <p className="text-sm text-foreground/70">
                {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}
              </p>
              <p className="text-sm text-foreground/70">CEP: {order.shippingAddress.zipCode}</p>
            </div>
          )}

          {/* Shipping Info */}
          {order.shippingOption && (
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={18} className="text-foreground/60" />
                <h3 className="font-medium text-foreground">Frete</h3>
              </div>
              <p className="text-sm text-foreground/70">{order.shippingOption.name}</p>
              <p className="text-sm text-foreground/60">
                Prazo: {order.shippingOption.estimatedDays} dias úteis
              </p>
            </div>
          )}

          {/* Refund Button */}
          {canRequestRefund && (
            <div className="space-y-3">
              <button
                onClick={() => setReembolsoModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 border border-orange-300 text-orange-600 px-4 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors"
              >
                <RefreshCcw size={18} />
                Solicitar Reembolso
              </button>
              <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg text-xs text-orange-700">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <p>Você tem até 7 dias após o recebimento para solicitar o cancelamento ou reembolso deste pedido.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {reembolsoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Solicitar Reembolso</h3>
                  <p className="text-sm text-foreground/60">Pedido {order.orderNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Motivo da solicitação</label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  placeholder="Descreva o motivo do reembolso..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <p className="text-xs text-foreground/60">
                Após a solicitação, nossa equipe analisará seu pedido e entrará em contato em até 48 horas úteis.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setReembolsoModalOpen(false)
                  setMotivo("")
                }}
                disabled={submittingRefund}
                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReembolso}
                disabled={!motivo.trim() || submittingRefund}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRefund ? "Enviando..." : "Enviar Solicitação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
