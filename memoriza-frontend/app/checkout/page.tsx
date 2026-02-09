"use client"

import { useState, useEffect, FormEvent, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, X, Check } from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { checkout } from "@/lib/api/orders"
import type { CreateOrderRequest } from "@/types/orders"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const API_BASE_URL = "/api-proxy"

type PaymentMethod = "pix" | "card"

interface AddressResponseApi {
  id: string
  label: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  createdAt: string
}

interface Endereco {
  id: string
  apelido: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  principal: boolean
}

interface ShippingOption {
  code: string
  name: string
  price: number
  estimatedDays: number
  isFreeShipping: boolean
}

// Tipos da BrasilAPI
interface BrasilApiCepSuccess {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
}

interface BrasilApiError {
  name: "BadRequestError" | "NotFoundError" | "InternalError"
  message: string
  type: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()

  // Detectar ambiente MercadoPago
  const isMercadoPagoTest = process.env.NEXT_PUBLIC_MERCADOPAGO_ENV === 'test'

  // Estado para armazenar dados do PIX gerado
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string; paymentId: number; orderId: string } | null>(null)

  const [hydrated, setHydrated] = useState(false)
  
  useEffect(() => {
    setHydrated(true)
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? "", {
      locale: "pt-BR",
    })
  }, [])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")

  // Estados para seleção de endereço
  const [addresses, setAddresses] = useState<Endereco[]>([])
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Estados para frete
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [pickupInStore, setPickupInStore] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  
  // Controle para evitar redirect de carrinho vazio após sucesso
  const [isRedirecting, setIsRedirecting] = useState(false)
  // Controle para manter a UI enquanto processa o pedido e limpa o carrinho
  const [isProcessing, setIsProcessing] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
    orderId: "",
    cpf: "",
  })

  // Estado para persistir o resumo do pedido mesmo após limpar o carrinho
  const [orderSummary, setOrderSummary] = useState<{
    items: typeof items;
    subtotal: number;
    shipping: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    // Se ainda não temos um resumo salvo e o carrinho tem itens, atualizamos o resumo
    if (items.length > 0 && !orderSummary) {
       // Recalcula totais locais
       const currentShipping = pickupInStore ? 0 : (selectedShipping?.price ?? 0);
       const currentTotal = subtotal + currentShipping;

       setOrderSummary({
         items: items,
         subtotal: subtotal,
         shipping: currentShipping,
         total: currentTotal
       });
    }
  }, [items, subtotal, pickupInStore, selectedShipping, orderSummary]);

  // Use o resumo persistido se disponível (durante processamento/sucesso), senão use o carrinho atual
  const displayItems = orderSummary?.items ?? items;
  const displaySubtotal = orderSummary?.subtotal ?? subtotal;
  // O frete pode mudar se o usuário trocar a opção, então só usamos o persistido se o carrinho estiver vazio (pós-compra)
  const displayShipping = (items.length === 0 && orderSummary) ? orderSummary.shipping : (pickupInStore ? 0 : (selectedShipping?.price ?? 0));
  const displayTotal = displaySubtotal + displayShipping;

  useEffect(() => {
    if (!user) return

    const fullName =
      user.fullName ??
      [user.firstName, user.lastName].filter(Boolean).join(" ")

    setForm((prev) => ({
      ...prev,
      fullName: fullName || prev.fullName,
      email: (user.email as string) || prev.email,
    }))
  }, [user])

  useEffect(() => {
    if (!pixData?.orderId || !user) return

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/orders/${pixData.orderId}`, {
           credentials: "include"
        })
        if (res.ok) {
          const order = await res.json()
          console.log("🔍 Status do Pedido:", order.status)
          
          if (order.status !== 'Pendente' && order.status !== 'Cancelado') {
             toast.dismiss()
             toast.success("Pagamento aprovado! Redirecionando...")
             router.push(`/payment/success?order_id=${pixData.orderId}&payment_type=pix`)
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status do Pix:", error)
      }
    }

    // Verifica a cada 3 segundos
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [pixData, user, router, clearCart])

  // Busca endereços do usuário
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      console.log("Checkout: Usuário não logado para buscar endereços")
      return
    }

    const fetchAddresses = async () => {
      try {
        console.log("Checkout: Buscando endereços...")
        setLoadingAddresses(true)
        setLoadingAddresses(true)
        const res = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
          credentials: "include",
        })

        if (res.ok) {
          const data: AddressResponseApi[] = await res.json()
          console.log("Checkout: Endereços encontrados:", data)
          const mapped: Endereco[] = data.map((a) => ({
            id: a.id,
            apelido: a.label,
            cep: a.zipCode,
            rua: a.street,
            numero: a.number,
            complemento: a.complement ?? "",
            bairro: a.neighborhood,
            cidade: a.city,
            estado: a.state,
            principal: a.isDefault,
          }))
          setAddresses(mapped)

          // ✅ Auto-preencher com endereço principal
          const defaultAddress = mapped.find((addr) => addr.principal)
          if (defaultAddress) {
            console.log("Checkout: Preenchendo endereço principal automaticamente")
            setSelectedAddressId(defaultAddress.id)
            setForm((prev) => ({
              ...prev,
              street: defaultAddress.rua,
              number: defaultAddress.numero,
              complement: defaultAddress.complemento,
              neighborhood: defaultAddress.bairro,
              city: defaultAddress.cidade,
              state: defaultAddress.estado,
              zipCode: defaultAddress.cep,
            }))
          }
        } else {
          console.error("Checkout: Erro ao buscar endereços", res.status)
        }
      } catch (error) {
        console.error("Checkout: Erro ao buscar endereços:", error)
      } finally {
        setLoadingAddresses(false)
      }
    }

    void fetchAddresses()
  }, [user, authLoading])

  const handleSelectAddress = (addr: Endereco) => {
    setSelectedAddressId(addr.id)
    setForm((prev) => ({
      ...prev,
      street: addr.rua,
      number: addr.numero,
      complement: addr.complemento,
      neighborhood: addr.bairro,
      city: addr.cidade,
      state: addr.estado,
      zipCode: addr.cep,
    }))
    setAddressModalOpen(false)
  }

  // Calcular frete quando CEP estiver disponível
  useEffect(() => {
    const cepClean = form.zipCode.replace(/\D/g, "")
    if (cepClean.length !== 8) {
      setShippingOptions([])
      setSelectedShipping(null)
      return
    }

    const calculateShipping = async () => {
      setLoadingShipping(true)
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/shipping/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cep: cepClean,
            pickupInStore: pickupInStore,
            cartSubtotal: subtotal,
          }),
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          setShippingOptions(data.options || [])

          // Auto-seleciona a primeira opção
          if (data.options && data.options.length > 0) {
            setSelectedShipping(data.options[0])
          } else {
            toast.error("CEP não encontrado. Verifique se o CEP está correto.")
          }
        } else {
          // Tratar erros específicos
          if (res.status === 400) {
            toast.error("CEP inválido. Por favor, verifique o formato do CEP.")
          } else if (res.status === 404) {
            toast.error("CEP não encontrado. Verifique se o CEP está correto.")
          } else {
            toast.error("Erro ao calcular frete. Tente novamente.")
          }
          setShippingOptions([])
          setSelectedShipping(null)
        }
      } catch (error) {
        console.error("Erro ao calcular frete:", error)
        toast.error("Erro de conexão ao buscar CEP. Verifique sua internet.")
        setShippingOptions([])
        setSelectedShipping(null)
      } finally {
        setLoadingShipping(false)
      }
    }

    void calculateShipping()
  }, [form.zipCode, pickupInStore, subtotal, user])

  // ===== CEP helpers =====

  // Mantém só números, até 8 dígitos
  const sanitizeCep = (value: string) => {
    return (value || "").replace(/\D/g, "").slice(0, 8)
  }

  // Aplica máscara 00000-000 apenas para exibição
  const formatCepMask = (value: string) => {
    const digits = sanitizeCep(value)
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)}-${digits.slice(5)}`
  }

  const handleCepChange = (value: string) => {
    setCepError(null)
    const sanitized = sanitizeCep(value)
    setForm((prev) => ({ ...prev, zipCode: sanitized }))
  }

  const handleBuscarCep = async () => {
    const cep = sanitizeCep(form.zipCode)

    if (!cep || cep.length !== 8) {
      if (cep.length > 0 && cep.length < 8) {
        setCepError("CEP deve conter exatamente 8 dígitos.")
      }
      return
    }

    setCepLoading(true)
    setCepError(null)

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
      const data = await res.json()

      if (!res.ok) {
        const err = data as BrasilApiError
        if (err.name === "BadRequestError") {
          setCepError("CEP inválido. Verifique e tente novamente.")
        } else if (err.name === "NotFoundError") {
          setCepError("CEP não encontrado.")
        } else {
          setCepError("Erro ao consultar CEP. Tente novamente em instantes.")
        }
        return
      }

      const address = data as BrasilApiCepSuccess

      setForm((prev) => ({
        ...prev,
        zipCode: sanitizeCep(address.cep),
        street: address.street ?? "",
        neighborhood: address.neighborhood ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
      }))
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setCepError("Erro de conexão ao buscar CEP.")
    } finally {
      setCepLoading(false)
    }
  }

  // ===== Phone helpers =====

  // Mantém só números, até 11 dígitos
  const sanitizePhone = (value: string) => {
    return (value || "").replace(/\D/g, "").slice(0, 11)
  }

  // Aplica máscara (00) 00000-0000 ou (00) 0000-0000
  const formatPhoneMask = (value: string) => {
    const digits = sanitizePhone(value)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handlePhoneChange = (value: string) => {
    const sanitized = sanitizePhone(value)
    setForm((prev) => ({ ...prev, phone: sanitized }))
  }

  if (!hydrated) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-foreground/60 text-sm">
            Carregando checkout...
          </p>
        </div>
        <Footer />
      </>
    )
  }

  // Se já tiver dados do PIX, mostra o Modal
  if (pixData) {
     // Mantemos o render normal abaixo, e o modal será exibido por cima
  }

  // se não tiver itens, manda pro carrinho
  if (items.length === 0 && !isProcessing && !isRedirecting && !pixData) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-foreground/70">
            Seu carrinho está vazio. Adicione algum produto antes de finalizar a compra.
          </p>
          <Link
            href="/products"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar Produtos
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  // Cálculo real de frete
  const shipping = pickupInStore ? 0 : (selectedShipping?.price ?? 0)
  const total = subtotal + shipping

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Criar endereço automaticamente se necessário
  const createAddressIfNeeded = async (): Promise<string | null> => {
    // Se já tem endereço selecionado, usa ele
    if (selectedAddressId) {
      return selectedAddressId
    }

    // Se for retirada na loja, não precisa de endereço
    if (pickupInStore) {
      return null
    }

    // Criar endereço automaticamente
    try {
      const payload = {
        label: "Endereço de entrega",
        street: form.street,
        number: form.number,
        complement: form.complement || null,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: formatCepMask(form.zipCode),
        country: "Brasil",
        isDefault: false,
      }

      const res = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Erro ao salvar endereço")
      }

      const createdAddress = await res.json()
      return createdAddress.id
    } catch (error) {
      console.error("Erro ao criar endereço:", error)
      return null
    }
  }

  // Função unificada de validação e criação de endereço
  const validateAndPrepareOrder = async (): Promise<CreateOrderRequest | null> => {
     // Validação: usuário deve estar logado
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra.")
      // router.push("/login") // Opcional, ou deixa o usuario clicar
      return null
    }

    // Validação: nome completo obrigatório
    if (!form.fullName || form.fullName.trim() === "") {
      toast.error("Por favor, preencha seu nome completo.")
      return null
    }

    // Validação: telefone obrigatório
    if (!form.phone || sanitizePhone(form.phone).length < 10) {
      toast.error("Por favor, preencha um telefone válido com DDD.")
      return null
    }

    // Validação: campos de endereço obrigatórios (se não for retirada na loja)
    if (!pickupInStore) {
      if (!form.street || !form.number || !form.neighborhood || !form.city || !form.state || !form.zipCode) {
        toast.error("Por favor, preencha todos os campos obrigatórios do endereço.")
        return null
      }
      
      if (sanitizeCep(form.zipCode).length !== 8) {
        toast.error("Por favor, preencha um CEP válido.")
        return null
      }
    }

    // Validar se frete foi selecionado (exceto se for retirada)
    if (!pickupInStore && !selectedShipping) {
      toast.error("Por favor, selecione uma opção de frete ou marque 'Retirar na loja'.")
      return null
    }

    // Criar endereço se necessário
    let addressId = selectedAddressId

    if (!pickupInStore && !addressId) {
      toast.loading("Salvando endereço...")
      addressId = await createAddressIfNeeded()
      toast.dismiss()

      if (!addressId) {
        toast.error("Erro ao salvar endereço. Tente novamente.")
        return null
      }
    }

    return {
      shippingAmount: pickupInStore ? 0 : shipping,
      shippingCode: pickupInStore ? "" : (selectedShipping?.code ?? ""),
      shippingName: pickupInStore ? "" : (selectedShipping?.name ?? ""),
      shippingEstimatedDays: pickupInStore ? 0 : (selectedShipping?.estimatedDays ?? 0),
      pickupInStore: pickupInStore,
      shippingAddressId: addressId || "",
      shippingPhone: sanitizePhone(form.phone),
    }
  }


  const handleCardSubmit = async (cardFormData: any) => {
      // 1. Validar e preparar dados do pedido
      if (!user) return; // Garantir que user existe

      const orderRequest = await validateAndPrepareOrder();
      if (!orderRequest) return; // Se falhou na validação, para tudo

      // SALVAR RESUMO ANTES DE LIMPAR
      setOrderSummary({
        items: items,
        subtotal: subtotal,
        shipping: pickupInStore ? 0 : (selectedShipping?.price ?? 0),
        total: subtotal + (pickupInStore ? 0 : (selectedShipping?.price ?? 0))
      });

      setIsProcessing(true) // Ativa estado de processamento

      try {
        toast.loading("Processando pagamento com cartão...")

        // 2. Criar o pedido no Backend (Status: Pending)
        const orderResponse = await checkout(orderRequest);
        console.log("Pedido criado para cartão:", orderResponse.orderNumber);
        
        // Limpar carrinho no frontend imediatamente após criar o pedido
        clearCart();

        // 3. Enviar Token para Pagamento
        const paymentResponse = await fetch(`${API_BASE_URL}/api/user/orders/${orderResponse.orderId}/pay-card`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(cardFormData),
          credentials: "include",
        });

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok) {
          console.error("Erro detalhado do Cartão:", paymentResult);
          throw new Error(paymentResult.message || JSON.stringify(paymentResult) || "Falha no pagamento com cartão");
        }

        if (paymentResult.status === 'rejected' || paymentResult.status === 'cancelled') {
          console.warn("Pagamento Recusado/Cancelado:", paymentResult); 
          
          // Traduzir mensagem de erro do Mercado Pago
          const statusDetail = paymentResult.status_detail || paymentResult.message;
          let message = "O pagamento foi recusado.";

          switch (statusDetail) {
              case "cc_rejected_bad_filled_card_number":
                  message = "Revise o número do cartão.";
                  break;
              case "cc_rejected_bad_filled_date":
                  message = "Revise a data de vencimento.";
                  break;
              case "cc_rejected_bad_filled_other":
                  message = "Revise os dados do cartão.";
                  break;
              case "cc_rejected_bad_filled_security_code":
                  message = "Revise o código de segurança do cartão.";
                  break;
              case "cc_rejected_blacklist":
                  message = "Não pudemos processar seu pagamento.";
                  break;
              case "cc_rejected_call_for_authorize":
                  message = "Você deve autorizar o pagamento com o emissor do cartão.";
                  break;
              case "cc_rejected_card_disabled":
                  message = "Ligue para o emissor do cartão para ativar seu cartão.";
                  break;
              case "cc_rejected_card_error":
                  message = "Não conseguimos processar seu pagamento.";
                  break;
              case "cc_rejected_duplicated_payment":
                  message = "Você já efetuou um pagamento com esse valor. Caso precise pagar novamente, utilize outro cartão ou outra forma de pagamento.";
                  break;
              case "cc_rejected_high_risk":
                  message = "Seu pagamento foi recusado. Escolha outra forma de pagamento.";
                  break;
              case "cc_rejected_insufficient_amount":
                  message = "Seu cartão possui saldo insuficiente.";
                  break;
              case "cc_rejected_invalid_installments":
                  message = "O cartão não processa pagamentos em parcelas.";
                  break;
              case "cc_rejected_max_attempts":
                  message = "Você atingiu o limite de tentativas permitidas.";
                  break;
              case "cc_rejected_other_reason":
                  message = "O emissor do cartão não processou o pagamento.";
                  break;
              default:
                  message = "O pagamento foi recusado. Por favor, tente outra forma de pagamento.";
                  break;
          }

          toast.dismiss();
          router.push(`/payment/failure?order_id=${orderResponse.orderId}&message=${encodeURIComponent(message)}`);
          return; // Interrompe o fluxo aqui, MANTÉM CARRINHO
        }
        console.log("Pagamento Processado com Sucesso:", paymentResult);
        toast.dismiss();

        // 4. Limpar e Redirecionar APENAS se aprovado ou em análise
        if (paymentResult.status === 'approved' || paymentResult.status === 'in_process') {
            setIsRedirecting(true) 
            // clearCart(); // Removido pois já limpamos na criação do pedido
        
            if (paymentResult.status === 'approved') {
              toast.success("Pagamento aprovado com sucesso! 🎉");
              router.push(`/payment/success?order_id=${orderResponse.orderId}&collection_id=${paymentResult.paymentId}&status=${paymentResult.status}&payment_type=credit_card`);
            } else {
              toast.info("Pagamento em análise. Aguarde a confirmação.");
              router.push(`/payment/pending?order_id=${orderResponse.orderId}&collection_id=${paymentResult.paymentId}&status=${paymentResult.status}&payment_type=credit_card`);
            }
        } else {
           // Fallback para outros status desconhecidos que não sejam sucesso
           console.warn("Status desconhecido:", paymentResult.status);
           const message = "Ocorreu um erro no processamento. Tente novamente.";
           router.push(`/payment/failure?order_id=${orderResponse.orderId}&message=${encodeURIComponent(message)}`);
        }

      } catch (error: any) {
        toast.dismiss();
        console.error("Erro no fluxo de cartão:", error);
        toast.error(error.message || "Erro ao processar cartão. Verifique os dados.");
        // Não damos throw aqui para não quebrar o visual do Brick
      } finally {
        // Só desativa o loading se NÃO estiver redirecionando para sucesso
        // Se estiver redirecionando, deixa o loading ativo até a pagina mudar
        if (!isRedirecting) {
           setIsProcessing(false)
        }
      }
  }

// Função auxiliar para máscara de CPF
const formatCpfMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

  const handleCpfChange = (value: string) => {
    setForm((prev) => ({ ...prev, cpf: formatCpfMask(value) }))
  }

  // Handler para Pagamento Pix (Formulário padrão)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validar CPF se for PIX
    if (paymentMethod === "pix") {
       if (!form.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
         toast.error("Por favor, preencha um CPF válido para gerar o PIX.")
         return
       }
    }

    const orderRequest = await validateAndPrepareOrder();
    if (!orderRequest) return;
    
    // SALVAR RESUMO ANTES DE LIMPAR
    setOrderSummary({
      items: items,
      subtotal: subtotal,
      shipping: pickupInStore ? 0 : (selectedShipping?.price ?? 0),
      total: subtotal + (pickupInStore ? 0 : (selectedShipping?.price ?? 0))
    });

    setIsProcessing(true) // Ativa estado de processamento

    try {
      toast.loading("Gerando PIX...")
      
      // 1. Criar Pedido (Pendente)
      const response = await checkout(orderRequest)
      console.log("Pedido criado para PIX:", response.orderNumber)
      
      // Limpar carrinho no frontend imediatamente após criar o pedido
      clearCart();

      // 2. Processar Pagamento PIX
      // Usamos o mesmo endpoint de pagar com cartão, mas passando método 'pix'
      const pixPayload = {
        token: null,
        payment_method_id: "pix",
        installments: 1,
        issuer_id: null,
        payer: {
          email: form.email || "email@teste.com", // Fallback seguro
          identification: {
            type: "CPF",
            number: form.cpf.replace(/\D/g, "") // Remove formatação
          }
        }
      }

      const paymentResponse = await fetch(`${API_BASE_URL}/api/user/orders/${response.orderId}/pay-card`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pixPayload),
        credentials: "include",
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        console.error("Erro detalhado do PIX:", paymentResult);
        throw new Error(paymentResult.message || JSON.stringify(paymentResult) || "Erro ao gerar PIX");
      }

      console.log("PIX Gerado:", paymentResult);
      
      toast.dismiss()
      toast.success("PIX gerado com sucesso!")
      
      // 3. Mostrar QR Code na tela (sem redirecionar)
      setPixData({
        qrCode: paymentResult.qrCode,
        qrCodeBase64: paymentResult.qrCodeBase64,
        paymentId: paymentResult.paymentId,
        orderId: response.orderId
      })
      
      // NÃO Limpar carrinho aqui! Esperar pagamento.
      // clearCart() 
      
    } catch (err) {
      toast.dismiss()
      console.error("Erro no checkout PIX:", err)
      
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Erro ao conectar com o servidor. Tente novamente.")
      }
    } finally {
        setIsProcessing(false) // Desativa estado, permitindo renderizar empty state se falhar
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Voltar */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para o carrinho
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Coluna esquerda – Dados + Endereço + Pagamento */}
            <main className="flex-1">
              <div className="bg-background border border-border rounded-xl p-6 space-y-6">
                <h1 className="text-2xl font-light text-foreground mb-2">
                  Finalizar Compra
                </h1>

                {/* Badge de Ambiente de Teste */}
                {isMercadoPagoTest && (
                  <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-700 font-bold text-sm">⚠️ MODO TESTE</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Você está em ambiente de testes. Use cartões de teste do MercadoPago.
                    </p>
                  </div>
                )}

                <p className="text-sm text-foreground/60 mb-4">
                  Preencha seus dados para concluir o pedido.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Dados pessoais */}
                  <section className="space-y-4">
                    <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Dados do comprador
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Nome completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={(e) =>
                            handleChange("fullName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          CPF <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.cpf}
                          onChange={(e) => handleCpfChange(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                         {paymentMethod === "pix" && !form.cpf && (
                            <p className="text-[10px] text-accent mt-1">Obrigatório para gerar o Pix</p>
                         )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Telefone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formatPhoneMask(form.phone)}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                    </div>
                  </section>

                  {/* Endereço */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                        Endereço de entrega
                      </h2>
                      <button
                        type="button"
                        onClick={() => setAddressModalOpen(true)}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        <MapPin size={14} />
                        Meus Endereços
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Rua / Avenida <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.street}
                          onChange={(e) =>
                            handleChange("street", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Número <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.number}
                          onChange={(e) =>
                            handleChange("number", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={form.complement}
                          onChange={(e) =>
                            handleChange("complement", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="Apartamento, bloco, referência..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Bairro <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.neighborhood}
                          onChange={(e) =>
                            handleChange("neighborhood", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          CEP <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formatCepMask(form.zipCode)}
                          onChange={(e) => handleCepChange(e.target.value)}
                          onBlur={handleBuscarCep}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="00000-000"
                          disabled={cepLoading}
                        />
                        {cepLoading && (
                          <p className="mt-1 text-xs text-accent">Buscando CEP...</p>
                        )}
                        {cepError && (
                          <p className="mt-1 text-xs text-red-500">{cepError}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Cidade <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) =>
                            handleChange("city", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">
                          UF <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) =>
                            handleChange("state", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="MG, SP..."
                        />
                      </div>
                    </div>
                  </section>

                  {/* Método de Entrega */}
                  <section className="space-y-4">
                    <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Método de entrega
                    </h2>

                    {/* Checkbox Retirar na Loja */}
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={pickupInStore}
                        onChange={(e) => setPickupInStore(e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Retirar na loja</span>
                        <p className="text-xs text-foreground/60">Grátis • Respeitar o tempo de produção do pedido</p>
                      </div>
                    </label>

                    {/* Opções de Frete */}
                    {!pickupInStore && (
                      <div className="space-y-2">
                        {loadingShipping ? (
                          <div className="p-4 text-center text-sm text-foreground/60 border border-border rounded-lg">
                            Calculando frete...
                          </div>
                        ) : shippingOptions.length === 0 ? (
                          <div className="p-4 text-center text-sm text-foreground/60 border border-border rounded-lg">
                            Informe o CEP para calcular o frete
                          </div>
                        ) : (
                          shippingOptions.map((option) => (
                            <button
                              key={option.code}
                              type="button"
                              onClick={() => setSelectedShipping(option)}
                              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                                selectedShipping?.code === option.code
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">{option.name}</p>
                                  <p className="text-xs text-foreground/60">
                                    Entrega em {option.estimatedDays} dias úteis
                                  </p>
                                  {option.isFreeShipping && (
                                    <p className="text-xs text-green-600 font-medium mt-1">
                                      ✓ Frete grátis aplicado
                                    </p>
                                  )}
                                </div>
                                <p className="font-medium">
                                  {option.price === 0 || option.isFreeShipping
                                    ? "Grátis"
                                    : `R$ ${option.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </section>



                  {/* Pagamento */}
                  <section className="space-y-4">
                    <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Forma de pagamento
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Opção Pix */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`p-4 rounded-lg border text-left transition-all relative ${
                          paymentMethod === "pix"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                         {paymentMethod === "pix" && (
                          <div className="absolute top-3 right-3 text-primary">
                            <Check size={18} />
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground text-sm">Pix</h3>
                            <p className="text-xs text-foreground/60 mt-1">Aprovação imediata</p>
                            <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              Recomendado
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Opção Cartão */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-lg border text-left transition-all relative ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <div className="absolute top-3 right-3 text-primary">
                            <Check size={18} />
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground text-sm">Cartão de Crédito</h3>
                            <p className="text-xs text-foreground/60 mt-1">Até 12x no cartão</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Área do Brick de Cartão */}
                    {paymentMethod === "card" && (
                      <div className="mt-6 p-1 bg-white rounded-lg border border-border">
                        <CardPayment
                          initialization={{
                            amount: (() => {
                                console.log("🔍 Brick Init - Amount:", total, "Email:", form.email);
                                return total;
                            })(), // Valor total do pedido
                            payer: {
                              email: form.email,
                            },
                          }}
                          customization={{
                            paymentMethods: {
                              minInstallments: 1,
                              maxInstallments: 12,
                            },
                            visual: {
                              style: {
                                theme: "default", // 'default' | 'dark' | 'bootstrap' | 'flat'
                              },
                              hidePaymentButton: false, // Botão nativo do Brick
                            },
                          }}
                          onSubmit={async (param) => {
                            console.log("💳 Dados do cartão recebidos (Token gerado):", JSON.stringify(param, null, 2));
                            
                            // Dispara o fluxo de criação do pedido + pagamento
                            await handleCardSubmit(param);
                          }}
                          onError={async (error) => {
                             console.error("❌ Erro no Brick de Cartão:", error);
                             toast.error("Erro ao processar dados do cartão. Verifique as informações.");
                          }}
                        />
                      </div>
                    )}

                    {paymentMethod === "pix" && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-blue-900">
                          Ao confirmar, você receberá um <strong>QR Code</strong> para pagamento instantâneo.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Botão de Confirmar (Apenas se for PIX - Cartão tem botão próprio no Brick) */}
                  {paymentMethod === "pix" && (
                    <button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-4"
                    >
                      Gerar Pix e Finalizar
                    </button>
                  )}
                </form>
              </div>
            </main>

            {/* Coluna direita – Resumo do pedido */}
            <aside className="lg:w-80 shrink-0">
              <div className="bg-background border border-border rounded-xl p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-medium text-foreground mb-2">
                  Resumo do pedido
                </h2>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-sm">
                  {displayItems.map((item) => {
                    const lineTotal = item.price * item.quantity

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-3 border-b border-border/60 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground line-clamp-2">
                            {item.name}
                          </p>

                          <div className="text-xs text-foreground/60 mt-1 space-y-0.5">
                            <p>
                              Qtde: {item.quantity} · Unitário: R${" "}
                              {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            {item.sizeName && (
                              <p>Tamanho: {item.sizeName}</p>
                            )}
                            {item.colorName && <p>Cor: {item.colorName}</p>}
                            {item.personalizationText && (
                              <p>Texto: {item.personalizationText}</p>
                            )}
                          </div>

                          <p className="text-sm font-medium text-foreground mt-1">
                            R$ {lineTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>R$ {displaySubtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Frete</span>
                    <span>
                      {loadingShipping ? (
                        <span className="text-accent">Calculando...</span>
                      ) : (displayShipping === 0) ? (
                        <span className="text-green-600">Grátis</span>
                      ) : (
                        `R$ ${displayShipping.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-medium text-foreground pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span>R$ {displayTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <p className="text-xs text-foreground/60">
                  Ao confirmar o pedido, você concorda com nossos termos de
                  uso e política de privacidade.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />

      {/* Modal de Seleção de Endereço */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-medium">Selecionar Endereço</h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {loadingAddresses ? (
                <div className="text-center py-8 text-foreground/60">
                  Carregando endereços...
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-foreground/60">
                  Nenhum endereço encontrado.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {addr.apelido}
                            {addr.principal && (
                              <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                                Principal
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-foreground/70 mt-1">
                            {addr.rua}, {addr.numero}
                            {addr.complemento && ` - ${addr.complemento}`}
                          </p>
                          <p className="text-sm text-foreground/70">
                            {addr.bairro} - {addr.cidade}/{addr.estado}
                          </p>
                          <p className="text-xs text-foreground/50 mt-1">
                            CEP: {addr.cep}
                          </p>
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100">
                          <Check size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal do PIX */}
      <Dialog open={!!pixData} onOpenChange={(open) => {
          if(!open) {
             // Redireciona para pedidos ao fechar, pois o pedido já foi criado
             router.push("/minha-conta/pedidos")
          }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Check size={24} />
              </div>
              Pedido Criado!
            </DialogTitle>
            <DialogDescription className="text-center">
              Escaneie o QR Code abaixo para pagar via Pix.
            </DialogDescription>
          </DialogHeader>

          {pixData && (
            <div className="space-y-6 py-4">
              {/* QR Code Imagem Base64 */}
              {pixData.qrCodeBase64 && (
                <div className="flex justify-center">
                  <img 
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
                    alt="QR Code Pix"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              )}

              {/* Código Copia e Cola */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/60 uppercase text-center">Código Copia e Cola</p>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={pixData.qrCode} 
                    className="flex-1 bg-muted px-3 py-2 rounded border border-border text-xs font-mono text-foreground/80 truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.qrCode)
                      toast.success("Código copiado!")
                    }}
                    className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors"
                    title="Copiar"
                  >
                   <Check size={16} /> 
                  </button>
                </div>
              </div>

               <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-sm text-foreground/60 animate-pulse mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Aguardando pagamento...
                </div>

                <p className="text-xs text-center text-foreground/50">
                  O pagamento é aprovado instantaneamente. A tela atualizará automaticamente.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}