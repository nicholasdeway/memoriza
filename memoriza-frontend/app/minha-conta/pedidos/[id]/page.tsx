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
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getOrderDetail, requestRefund } from "@/lib/api/orders"
import type { OrderDetailResponse } from "@/types/orders"
import { toast } from "sonner"
import { getRefundStatusLabel } from "@/lib/utils"

import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"

// Mapeamento de status para timeline
const statusTimeline: { status: string; icon: React.ElementType; label: string }[] = [
  { status: "Aprovado", icon: CheckCircle, label: "Aprovado" },
  { status: "Em produção", icon: Clock, label: "Em Produção" },
  { status: "À caminho", icon: Truck, label: "À Caminho" },
  { status: "Finalizado", icon: Package, label: "Entregue" },
]

const statusOrder: string[] = ["Aprovado", "Em produção", "À caminho", "Finalizado"]

// Cores para cada status
const orderStatusColors: Record<string, string> = {
  "Pendente": "bg-yellow-100 text-yellow-700",
  "Aprovado": "bg-green-100 text-green-700",
  "Em produção": "bg-blue-100 text-blue-700",
  "À caminho": "bg-purple-100 text-purple-700",
  "Finalizado": "bg-emerald-100 text-emerald-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Reembolsado": "bg-orange-100 text-orange-700",
}

export default function PedidoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reembolsoModalOpen, setReembolsoModalOpen] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [submittingRefund, setSubmittingRefund] = useState(false)
  const [activeStep, setActiveStep] = useState<string>("Aprovado")
  
  const [document, setDocument] = useState("")
  const [email, setEmail] = useState("")

  // Estado para controlar qual método de pagamento está selecionado na UI da página de detalhes
  // 'pix' (default) ou 'card'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"pix" | "card">("pix")

  // Inicializar Mercado Pago
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "", {
      locale: "pt-BR",
    })
  }, [])
  
  // Preencher dados do usuário
  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user])

  // PIX QR Code Modal
  const [pixModalOpen, setPixModalOpen] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState<string | null>(null)

  // Buscar detalhes do pedido
  useEffect(() => {
    if (authLoading) return
    if (!user || !params.id) {
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getOrderDetail(params.id as string)
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
  }, [user, authLoading, params.id])

  // Polling para verificar status do pagamento (a cada 5 segundos)
  useEffect(() => {
    if (!user || !params.id || !order || order.status !== "Pendente") return

    const interval = setInterval(async () => {
      try {
        const updatedOrder = await getOrderDetail(params.id as string)
        if (updatedOrder.status !== "Pendente") {
          setOrder(updatedOrder)
          setActiveStep(updatedOrder.status)
          toast.success("Pagamento confirmado!")
          
          if (pixModalOpen) {
            setPixModalOpen(false)
          }
        }
      } catch (err) {
        console.error("Erro no polling de status:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, params.id, order, pixModalOpen])

  const handleReembolso = async () => {
    if (!motivo.trim()) {
      toast.error("Por favor, descreva o motivo do reembolso.")
      return
    }

    if (!order || !user) return

    try {
      setSubmittingRefund(true)
      
      await requestRefund(order.orderId, motivo)
      
      toast.success("Solicitação de reembolso enviada com sucesso!")
      setReembolsoModalOpen(false)
      setMotivo("")
      
      // Recarregar pedido para atualizar status
      const updatedOrder = await getOrderDetail(order.orderId)
      setOrder(updatedOrder)
    } catch (err) {
      console.error("Erro ao solicitar reembolso:", err)
      toast.error(err instanceof Error ? err.message : "Erro ao solicitar reembolso")
    } finally {
      setSubmittingRefund(false)
    }
  }

  // 🔹 Handler para Pagamento com Cartão (Chamado pelo Brick)
  const handleCardSubmit = async (cardFormData: any) => {
    if (!order || !user) return;

    try {
      toast.loading("Processando pagamento com cartão...")

      // Usa a URL base do ambiente ou padrão
      const API_BASE_URL = "/api-proxy"

      const paymentResponse = await fetch(`${API_BASE_URL}/api/user/orders/${order.orderId}/pay-card`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cardFormData),
        credentials: "include",
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        console.error("❌ Erro detalhado do Cartão:", paymentResult);
        throw new Error(paymentResult.message || JSON.stringify(paymentResult) || "Falha no pagamento com cartão");
      }

      if (paymentResult.status === 'rejected' || paymentResult.status === 'cancelled') {
        console.warn("⚠️ Pagamento Recusado/Cancelado:", paymentResult); 
        
        // Traduzir mensagem de erro do Mercado Pago
        const statusDetail = paymentResult.status_detail || paymentResult.message;
        let message = "O pagamento foi recusado.";

        switch (statusDetail) {
            case "cc_rejected_bad_filled_card_number": message = "Revise o número do cartão."; break;
            case "cc_rejected_bad_filled_date": message = "Revise a data de vencimento."; break;
            case "cc_rejected_bad_filled_other": message = "Revise os dados do cartão."; break;
            case "cc_rejected_bad_filled_security_code": message = "Revise o código de segurança do cartão."; break;
            case "cc_rejected_blacklist": message = "Não pudemos processar seu pagamento."; break;
            case "cc_rejected_call_for_authorize": message = "Você deve autorizar o pagamento com o emissor do cartão."; break;
            case "cc_rejected_card_disabled": message = "Ligue para o emissor do cartão para ativar seu cartão."; break;
            case "cc_rejected_card_error": message = "Não conseguimos processar seu pagamento."; break;
            case "cc_rejected_duplicated_payment": message = "Você já efetuou um pagamento com esse valor."; break;
            case "cc_rejected_high_risk": message = "Seu pagamento foi recusado. Escolha outra forma de pagamento."; break;
            case "cc_rejected_insufficient_amount": message = "Seu cartão possui saldo insuficiente."; break;
            case "cc_rejected_invalid_installments": message = "O cartão não processa pagamentos em parcelas."; break;
            case "cc_rejected_max_attempts": message = "Você atingiu o limite de tentativas permitidas."; break;
            case "cc_rejected_other_reason": message = "O emissor do cartão não processou o pagamento."; break;
            default: message = "O pagamento foi recusado. Por favor, tente outra forma de pagamento."; break;
        }

        toast.dismiss();
        toast.error(message);
        return; 
      }

      console.log("✅ Pagamento Processado com Sucesso:", paymentResult);
      toast.dismiss();

      if (paymentResult.status === 'approved' || paymentResult.status === 'in_process') {
          if (paymentResult.status === 'approved') {
            toast.success("Pagamento aprovado com sucesso! 🎉");
          } else {
            toast.info("Pagamento em análise. Aguarde a confirmação.");
          }
          
          // Refresh order
          const updatedOrder = await getOrderDetail(order.orderId)
          setOrder(updatedOrder)
      } else {
         toast.error("Ocorreu um erro no processamento. Tente novamente.");
      }

    } catch (error: any) {
      toast.dismiss();
      console.error("❌ Erro no fluxo de cartão:", error);
      toast.error(error.message || "Erro ao processar cartão. Verifique os dados.");
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

      case "Em produção":
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

      case "À caminho":
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

      case "Finalizado":
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

      {/* Payment Section - Checkout Transparente */}
      {order.status === "Pendente" && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-6">
            <CreditCard className="text-blue-600 mt-0.5" size={24} />
            <div>
              <h3 className="font-medium text-blue-900">Pagamento Pendente</h3>
              <p className="text-sm text-blue-700 mt-1">
                Escolha como deseja pagar seu pedido. O pagamento é processado de forma segura.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="document" className="block text-sm font-medium text-blue-900 mb-1">
                CPF do Pagador (Obrigatório)
              </label>
              <input
                type="text"
                id="document"
                placeholder="000.000.000-00"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={document}
                onChange={(e) => {
                  // Remove non-digits and cap at 11 chars
                  const val = e.target.value.replace(/\D/g, "").slice(0, 11)
                  // Simple mask
                  let masked = val
                  if (val.length > 9) masked = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                  else if (val.length > 6) masked = val.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3")
                  else if (val.length > 3) masked = val.replace(/(\d{3})(\d{3})/, "$1.$2")
                  
                  setDocument(masked)
                }}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
                Email para Comprovante
              </label>
              <input
                type="email"
                id="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Seleção de Método de Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedPaymentMethod("pix")}
              className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selectedPaymentMethod === "pix"
                  ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                  : "border-transparent bg-white hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">PIX</p>
                <p className="text-xs text-gray-500">Aprovação imediata</p>
              </div>
            </button>

            <button
               onClick={() => setSelectedPaymentMethod("card")}
               className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selectedPaymentMethod === "card"
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-transparent bg-white hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <CreditCard size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                <p className="text-xs text-gray-500">Até 12x no cartão</p>
              </div>
            </button>
          </div>

          {/* Área de Conteúdo do Pagamento */}
          <div className="bg-white/50 rounded-xl p-4 border border-white/60">
            {selectedPaymentMethod === "pix" && (
              <div className="text-center space-y-4">
                 <p className="text-sm text-gray-600">
                    Clique no botão abaixo para gerar o QR Code do PIX. O pagamento é aprovado instantaneamente.
                 </p>
                 <button
                  onClick={async () => {
                    const cleanDoc = document.replace(/\D/g, "")
                    if (cleanDoc.length !== 11) {
                      toast.error("Por favor, digite um CPF válido")
                      return
                    }

                    if (!email) {
                      toast.error("Por favor, informe um email válido")
                      return
                    }

                    try {
                      toast.loading("Processando pagamento PIX...")
                      
                      const { processPayment } = await import("@/lib/api/orders")
                      
                      const paymentRequest = {
                        payment_method_id: "pix",
                        email: email, 
                        installments: 1,
                        payer: {
                            email: email,
                            identification: {
                                type: "CPF",
                                number: cleanDoc
                            }
                        }
                      }
                      
                      console.log("Enviando requisição de pagamento (DEBUG):", JSON.stringify(paymentRequest, null, 2))
                      
                      const response = await processPayment(
                        order.orderId,
                        paymentRequest
                      )
                      
                      console.log("Resposta do pagamento:", response)
                      
                      toast.dismiss()
                      
                      if (response.status === "pending" && response.qrCode) {
                        setPixQrCode(response.qrCode)
                        setPixQrCodeBase64(response.qrCodeBase64 || null)
                        setPixModalOpen(true)
                        toast.success("QR Code PIX gerado!")
                      } else if (response.status === "approved") {
                        toast.success("Pagamento aprovado!")
                        const updatedOrder = await getOrderDetail(order.orderId)
                        setOrder(updatedOrder)
                      } else if (response.status === "rejected") {
                        toast.error(response.message || "Pagamento recusado")
                      } else {
                        toast.info(response.message || `Status: ${response.status}`)
                      }
                    } catch (err) {
                      toast.dismiss()
                      console.error("Erro ao processar PIX:", err)
                      toast.error(err instanceof Error ? err.message : "Erro ao processar pagamento PIX")
                    }
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  Gerar PIX e Pagar R$ {order.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </button>
              </div>
            )}

            {selectedPaymentMethod === "card" && (
                  <div className="brick-container">
                    <CardPayment
                    initialization={{
                        amount: order.totalAmount,
                        payer: {
                            email: email || user?.email || "email@teste.com",
                        },
                    }}
                    customization={{
                        paymentMethods: {
                            minInstallments: 1,
                            maxInstallments: 12,
                        },
                        visual: {
                            style: {
                                theme: 'default',
                            },
                            hidePaymentButton: false,
                        },
                    }}
                    onSubmit={async (param) => {
                        console.log("💳 Dados do cartão recebidos:", param);
                        await handleCardSubmit(param);
                    }}
                    onError={async (error) => {
                        // Tenta extrair qualquer informação útil do erro
                        console.error("❌ Erro no Brick de Cartão (Raw):", error);
                        console.error("❌ Erro no Brick de Cartão (JSON):", JSON.stringify(error, null, 2));
                        
                        // Tenta acessar propriedades comuns de erro do MP se existirem
                        // @ts-ignore
                        if (error?.message) console.error("Message:", error.message);
                        // @ts-ignore
                        if (error?.cause) console.error("Cause:", error.cause);

                        toast.error("Erro ao validar cartão de crédito. Verifique o console.");
                    }}
                  />
                </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-white/60 rounded-lg">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p>
                <strong>Pagamento 100% seguro.</strong> Seus dados são protegidos e criptografados. 
                Processamento via MercadoPago sem necessidade de login.
              </p>
            </div>
          </div>
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
                Status: {getRefundStatusLabel(order.refundStatus) || "Em processamento"}
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
                    <div className="flex flex-wrap gap-2 text-xs text-foreground/60 mt-1">
                      <p>Qtd: {item.quantity}</p>
                      {item.sizeName ? (
                        <p>• Tamanho: {item.sizeName}</p>
                      ) : (
                        item.sizeId && <p>• Tamanho ID: {item.sizeId}</p>
                      )}
                      {item.colorName ? (
                        <p>• Cor: {item.colorName}</p>
                      ) : (
                        item.colorId && <p>• Cor ID: {item.colorId}</p>
                      )}
                    </div>
                    {item.personalizationText && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm italic text-foreground/80">
                         " {item.personalizationText} "
                      </div>
                    )}
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

      {/* PIX QR Code Modal */}
      {pixModalOpen && pixQrCode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pagamento via PIX</h3>
              <button
                onClick={() => {
                  setPixModalOpen(false)
                  setPixQrCode(null)
                  setPixQrCodeBase64(null)
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg border border-border">
                {pixQrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${pixQrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    QR Code indisponível
                  </div>
                )}
              </div>

              <div className="text-center space-y-2 w-full">
                <p className="text-sm text-foreground/80">
                  Escaneie o QR Code acima com o app do seu banco ou copie o código abaixo.
                </p>
                
                <div className="relative">
                  <input
                    readOnly
                    value={pixQrCode}
                    className="w-full text-xs bg-muted p-3 pr-24 rounded border border-input font-mono truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixQrCode)
                      toast.success("Código PIX copiado!")
                    }}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                O pagamento será processado em instantes após a confirmação.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}