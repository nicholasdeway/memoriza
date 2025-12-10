"use client"

import { useState, useEffect, FormEvent } from "react"
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

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
  const { user, token } = useAuth()

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

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
  })

  // pré-preenche com dados do usuário logado, se tiver
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

  // Busca endereços do usuário
  useEffect(() => {
    if (!token) {
      console.log("Checkout: Sem token para buscar endereços")
      return
    }

    const fetchAddresses = async () => {
      try {
        console.log("Checkout: Buscando endereços...")
        setLoadingAddresses(true)
        const res = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  }, [token])

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
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            cep: cepClean,
            pickupInStore: pickupInStore,
            cartSubtotal: subtotal,
          }),
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
  }, [form.zipCode, pickupInStore, subtotal, token])

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

  // se não tiver itens, manda pro carrinho
  if (items.length === 0) {
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

  // ✅ Cálculo real de frete
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validação: usuário deve estar logado
    if (!token) {
      toast.error("Você precisa estar logado para finalizar a compra.")
      router.push("/login")
      return
    }

    // Validação: nome completo obrigatório
    if (!form.fullName || form.fullName.trim() === "") {
      toast.error("Por favor, preencha seu nome completo.")
      return
    }

    // Validação: telefone obrigatório
    if (!form.phone || sanitizePhone(form.phone).length < 10) {
      toast.error("Por favor, preencha um telefone válido com DDD.")
      return
    }

    // Validação: campos de endereço obrigatórios (se não for retirada na loja)
    if (!pickupInStore) {
      if (!form.street || !form.number || !form.neighborhood || !form.city || !form.state || !form.zipCode) {
        toast.error("Por favor, preencha todos os campos obrigatórios do endereço.")
        return
      }
      
      if (sanitizeCep(form.zipCode).length !== 8) {
        toast.error("Por favor, preencha um CEP válido.")
        return
      }
    }

    // Validar se frete foi selecionado (exceto se for retirada)
    if (!pickupInStore && !selectedShipping) {
      toast.error("Por favor, selecione uma opção de frete ou marque 'Retirar na loja'.")
      return
    }

    // Criar endereço se necessário
    let addressId = selectedAddressId

    if (!pickupInStore && !addressId) {
      toast.loading("Salvando endereço...")
      addressId = await createAddressIfNeeded()
      toast.dismiss()

      if (!addressId) {
        toast.error("Erro ao salvar endereço. Tente novamente.")
        return
      }
    }

    // Preparar payload simplificado conforme DTO do backend
    const orderRequest: CreateOrderRequest = {
      shippingAmount: pickupInStore ? 0 : shipping,
      shippingCode: pickupInStore ? "" : (selectedShipping?.code ?? ""),
      shippingName: pickupInStore ? "" : (selectedShipping?.name ?? ""),
      shippingEstimatedDays: pickupInStore ? 0 : (selectedShipping?.estimatedDays ?? 0),
      pickupInStore: pickupInStore,
      shippingAddressId: addressId || "",
    }

    try {
      toast.loading("Processando pedido...")
      
      const response = await checkout(orderRequest, token)
      
      toast.dismiss()
      toast.success("Pedido criado com sucesso!")
      
      console.log("✅ Pedido criado:", response)
      
      // Limpar carrinho
      clearCart()
      
      // ✅ SEMPRE usar initPoint (PRODUÇÃO)
      const paymentUrl = response.initPoint
      
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        // Fallback: redirecionar para página de pedidos
        router.push(`/minha-conta/pedidos/${response.orderId}`)
      }
    } catch (err) {
      toast.dismiss()
      console.error("Erro no checkout:", err)
      
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Erro ao conectar com o servidor. Tente novamente.")
      }
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
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`w-full px-4 py-3 rounded-lg border text-sm flex items-center justify-between ${
                          paymentMethod === "pix"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background text-foreground/80 hover:bg-muted/60"
                        } transition-colors`}
                      >
                        <span>Pix</span>
                        <span className="text-xs text-foreground/60">
                          Mais rápido
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`w-full px-4 py-3 rounded-lg border text-sm flex items-center justify-between ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background text-foreground/80 hover:bg-muted/60"
                        } transition-colors`}
                      >
                        <span>Cartão de crédito</span>
                        <span className="text-xs text-foreground/60">
                          Em até 12x
                        </span>
                      </button>
                    </div>

                    <p className="text-xs text-foreground/60">
                      Depois de confirmar o pedido, você será direcionado para a
                      tela de pagamento correspondente.
                    </p>
                  </section>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-4"
                  >
                    Confirmar pedido
                  </button>
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
                  {items.map((item) => {
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
                    <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Frete</span>
                    <span>
                      {loadingShipping ? (
                        <span className="text-accent">Calculando...</span>
                      ) : pickupInStore || (selectedShipping && (selectedShipping.isFreeShipping || selectedShipping.price === 0)) ? (
                        <span className="text-green-600">Grátis</span>
                      ) : selectedShipping ? (
                        `R$ ${shipping.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      ) : (
                        <span className="text-orange-600">A calcular</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-medium text-foreground pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
    </>
  )
}