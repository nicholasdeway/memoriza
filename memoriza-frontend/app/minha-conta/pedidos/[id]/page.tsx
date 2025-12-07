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
import { mockOrders, orderStatusLabels, orderStatusColors, type OrderStatus } from "@/lib/mock-data"

const statusTimeline: { status: OrderStatus; icon: React.ElementType; label: string }[] = [
  { status: "aprovado", icon: CheckCircle, label: "Aprovado" },
  { status: "em_producao", icon: Clock, label: "Em Produção" },
  { status: "a_caminho", icon: Truck, label: "À Caminho" },
  { status: "entregue", icon: Package, label: "Entregue" },
]

const statusOrder: OrderStatus[] = ["aprovado", "em_producao", "a_caminho", "entregue"]

export default function PedidoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [reembolsoModalOpen, setReembolsoModalOpen] = useState(false)
  const [motivo, setMotivo] = useState("")

  const order = mockOrders.find((o) => o.id === params.id)

  const [activeStep, setActiveStep] = useState<OrderStatus>(order ? (order.status as OrderStatus) : "aprovado")

  // Atualiza o passo ativo quando o pedido muda (ex: carregamento inicial)
  useEffect(() => {
    if (order) {
      setActiveStep(order.status as OrderStatus)
    }
  }, [order])

  if (!order) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <Package size={48} className="mx-auto mb-4 text-foreground/40" />
        <p className="text-foreground/60">Pedido não encontrado</p>
        <Link href="/minha-conta/pedidos" className="text-accent hover:underline mt-4 inline-block">
          Voltar para Meus Pedidos
        </Link>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(order.status as OrderStatus)
  const canRequestRefund = order.status === "entregue"

  const handleReembolso = () => {
    alert(`Solicitação de reembolso enviada!\nMotivo: ${motivo}`)
    setReembolsoModalOpen(false)
    setMotivo("")
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case "aprovado":
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
                    <span className="text-foreground/60">Método de Pagamento</span>
                    <span className="font-medium text-foreground">{order.pagamento}</span>
                  </div>
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
                      R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "em_producao":
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

      case "a_caminho":
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

                {(order as any).codigoRastreio ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg space-y-3 mb-4">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-foreground/60">Código de Rastreio</span>
                        <span className="font-mono font-medium text-foreground">{(order as any).codigoRastreio}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-foreground/60">Transportadora</span>
                        <span className="font-medium text-foreground">{(order as any).transportadora}</span>
                      </div>
                    </div>

                    <a
                      href={(order as any).urlRastreamento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Truck size={18} />
                      Rastrear Entrega
                    </a>
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

      case "entregue":
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
                
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-foreground/60" />
                    <span className="text-sm font-medium text-foreground">Entregue em:</span>
                  </div>
                  <p className="text-sm text-foreground/70 ml-6">
                    {order.endereco.rua}, {order.endereco.bairro}
                    <br />
                    {order.endereco.cidade} - {order.endereco.estado}
                  </p>
                </div>

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
            <h1 className="text-2xl font-medium text-foreground">{order.id}</h1>
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
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${orderStatusColors[order.status]}`}
          >
            {orderStatusLabels[order.status]}
          </span>
        </div>
      </div>

      {/* Status Timeline Navigation */}
      {order.status !== "reembolsado" && order.status !== "cancelado" && (
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
      {order.status !== "reembolsado" && order.status !== "cancelado" && renderStepContent()}

      {/* Cancelled/Refunded Status */}
      {(order.status === "reembolsado" || order.status === "cancelado") && (
        <div
          className={`border rounded-xl p-6 ${
            order.status === "reembolsado" ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {order.status === "reembolsado" ? (
              <RefreshCcw className="text-orange-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className={`font-medium ${order.status === "reembolsado" ? "text-orange-700" : "text-red-700"}`}>
                {order.status === "reembolsado" ? "Pedido Reembolsado" : "Pedido Cancelado"}
              </p>
              <p className={`text-sm ${order.status === "reembolsado" ? "text-orange-600" : "text-red-600"}`}>
                Atualizado em {new Date(order.updatedAt).toLocaleDateString("pt-BR")}
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
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-foreground/40" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.produtoNome}</p>
                    <p className="text-sm text-foreground/60">Qtd: {item.quantidade}</p>
                  </div>
                </div>
                <p className="font-medium text-foreground">
                  R${" "}
                  {(item.precoUnitario * item.quantidade).toLocaleString("pt-BR", {
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
                {order.frete === 0
                  ? "Grátis"
                  : `R$ ${order.frete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span>R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-foreground/60" />
              <h3 className="font-medium text-foreground">Endereço de Entrega</h3>
            </div>
            <p className="text-sm text-foreground/70">{order.endereco.rua}</p>
            <p className="text-sm text-foreground/70">
              {order.endereco.bairro} - {order.endereco.cidade}/{order.endereco.estado}
            </p>
            <p className="text-sm text-foreground/70">CEP: {order.endereco.cep}</p>
          </div>

          {/* Payment */}
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-foreground/60" />
              <h3 className="font-medium text-foreground">Pagamento</h3>
            </div>
            <p className="text-sm text-foreground/70">{order.pagamento}</p>
          </div>

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
                  <p className="text-sm text-foreground/60">Pedido {order.id}</p>
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
                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReembolso}
                disabled={!motivo.trim()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
