"use client"

import { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, X, Check } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

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

  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // validação simples
    if (!form.fullName || !form.email || !form.street || !form.city) {
      alert("Preencha pelo menos nome, e-mail, rua e cidade.")
      return
    }

    const orderPayload = {
      customerName: form.fullName,
      email: form.email,
      phone: form.phone || null,
      paymentMethod,
      shippingAddress: {
        label: "Principal",
        street: form.street,
        number: form.number,
        complement: form.complement || null,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country,
        isDefault: true,
      },
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        // no carrinho já temos o preço final unitário (normal ou promocional)
        unitPrice: item.price,
        promotionalPrice: null, // se o seu DTO permitir null; senão remova essa propriedade
        sizeId: item.sizeId ?? null,
        colorId: item.colorId ?? null,
        personalizationText: item.personalizationText ?? null,
      })),
      totals: {
        subtotal,
        shipping,
        total,
      },
    }

    //Confiogurar backend ainda
    console.log("Order payload (frontend):", orderPayload)

    try {
      // Exemplo de chamada (ajuste a rota e DTO):
      /*
      const res = await fetch(`${API_BASE_URL}/api/store/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) {
        console.error("Erro ao criar pedido")
        alert("Não foi possível finalizar o pedido. Tente novamente.")
        return
      }

      const createdOrder = await res.json()
      */

      // Por enquanto, fluxo mockado:
      alert("Pedido criado (mock)! Veja o payload no console.")
      clearCart()
      router.push("/minha-conta/pedidos")
    } catch (err) {
      console.error("Erro no checkout:", err)
      alert("Erro ao conectar com o servidor.")
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
                          Nome completo
                        </label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={(e) =>
                            handleChange("fullName", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="(00) 00000-0000"
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
                          Rua / Avenida
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
                          Número
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
                          Bairro
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
                          CEP
                        </label>
                        <input
                          type="text"
                          value={form.zipCode}
                          onChange={(e) =>
                            handleChange("zipCode", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="00000-000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Cidade
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
                          UF
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
                              {item.price.toFixed(2)}
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
                            R$ {lineTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Frete</span>
                    <span>
                      {shipping === 0
                        ? "Grátis"
                        : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-medium text-foreground pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
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