"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { 
  fetchInstallmentsFromAPI, 
  getBestInstallmentDisplay,
  type InstallmentsResponse 
} from "@/lib/installment-calculator"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

// ===== Tipos da API =====
type PageParams = { id: string }

interface ProductImageDto {
  id: string
  productId: string
  url: string
  altText?: string | null
  isPrimary: boolean
  displayOrder: number
  createdAt: string
}

interface ProductSizeDto {
  sizeId: number
  sizeName: string
  price: number | null
  promotionalPrice: number | null
}

interface ProductResponseDto {
  id: string
  categoryId: string
  name: string
  description?: string | null
  price: number
  promotionalPrice?: number | null
  sizeIds: number[]
  colorIds: number[]
  sizes: ProductSizeDto[]
  isPersonalizable: boolean
  isActive: boolean
  createdAt: string
  images: ProductImageDto[]
}

interface CategoryApi {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

interface SizeApi {
  id: number
  name: string
  isActive: boolean
  createdAt: string
}

interface ColorApi {
  id: number
  name: string
  hexCode: string | null
  isActive: boolean
  createdAt: string
}

// ===== Modelos de tela =====
interface SizeOption {
  id: number
  nome: string
}

interface ColorOption {
  id: number
  nome: string
  codigoHex: string | null
}

interface Product {
  id: string
  nome: string
  descricao: string
  preco: number
  precoPromocional: number | null
  categoriaId: string
  categoriaNome: string
  tamanhos: SizeOption[]
  cores: ColorOption[]
  sizes: ProductSizeDto[]
  personalizavel: boolean
  imagens: ProductImageDto[]
}

// =====================
export default function ProductDetailPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { id } = use(params)

  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // estados de customização
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null)
  const [personalizationText, setPersonalizationText] = useState("")
  const [errors, setErrors] = useState<{ color?: string; size?: string }>({})
  const [isAdding, setIsAdding] = useState(false)

  // Estado para parcelamento
  const [installments, setInstallments] = useState<InstallmentsResponse | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)

        const [prodRes, catRes, sizeRes, colorRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products/${id}`, {
            cache: "no-store",
          }),
          fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/sizes`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/colors`, { cache: "no-store" }),
        ])

        if (!prodRes.ok) {
          console.error(
            "Erro ao buscar produto:",
            prodRes.status,
            await prodRes.text(),
          )
          setProduct(null)
          return
        }

        const prodJson: ProductResponseDto = await prodRes.json()
        const categories: CategoryApi[] = catRes.ok ? await catRes.json() : []
        const sizesApi: SizeApi[] = sizeRes.ok ? await sizeRes.json() : []
        const colorsApi: ColorApi[] = colorRes.ok ? await colorRes.json() : []

        const categoriaNome =
          categories.find((c) => c.id === prodJson.categoryId)?.name ?? ""

        const tamanhos: SizeOption[] = (prodJson.sizeIds ?? [])
          .map((sizeId) => {
            const s = sizesApi.find((x) => x.id === sizeId && x.isActive)
            return s
              ? {
                  id: s.id,
                  nome: s.name,
                }
              : null
          })
          .filter((x): x is SizeOption => x !== null)

        const cores: ColorOption[] = (prodJson.colorIds ?? [])
          .map((colorId) => {
            const c = colorsApi.find((x) => x.id === colorId && x.isActive)
            return c
              ? {
                  id: c.id,
                  nome: c.name,
                  codigoHex: c.hexCode,
                }
              : null
          })
          .filter((x): x is ColorOption => x !== null)

        const imagensOrdenadas = (prodJson.images ?? [])
          .slice()
          .sort((a: ProductImageDto, b: ProductImageDto) => {
            if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1
            return a.displayOrder - b.displayOrder
          })

        const mapped: Product = {
          id: prodJson.id,
          nome: prodJson.name,
          descricao: prodJson.description ?? "",
          preco: prodJson.price,
          precoPromocional: prodJson.promotionalPrice ?? null,
          categoriaId: prodJson.categoryId,
          categoriaNome,
          tamanhos,
          cores,
          sizes: prodJson.sizes ?? [],
          personalizavel: prodJson.isPersonalizable,
          imagens: imagensOrdenadas,
        }

        setProduct(mapped)

        // auto-seleciona cor/tamanho se tiver apenas 1 opção
        if (mapped.cores.length === 1) {
          setSelectedColorId(mapped.cores[0].id)
        }
        if (mapped.tamanhos.length === 1) {
          setSelectedSizeId(mapped.tamanhos[0].id)
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [id])

  // NOVO: Calcular preço baseado no tamanho selecionado
  const getSelectedSizePrice = (): { price: number; promoPrice: number | null } => {
    if (!product) return { price: 0, promoPrice: null }
    
    // Se não tiver tamanho selecionado, usa preço base
    if (!selectedSizeId) {
      return { price: product.preco, promoPrice: product.precoPromocional }
    }
    
    // Buscar dados de preço do tamanho selecionado
    const sizeData = product.sizes?.find(s => s.sizeId === selectedSizeId)
    
    // Se não encontrar dados ou não tiver preço específico, usa preço base
    if (!sizeData || (sizeData.price === null && sizeData.promotionalPrice === null)) {
      return { price: product.preco, promoPrice: product.precoPromocional }
    }
    
    // Usa preço específico do tamanho (fallback para preço base se null)
    return {
      price: sizeData.price ?? product.preco,
      promoPrice: sizeData.promotionalPrice ?? product.precoPromocional
    }
  }

  const { price: currentPrice, promoPrice: currentPromoPrice } = getSelectedSizePrice()

  // Buscar parcelamento quando o produto ou tamanho selecionado mudar
  useEffect(() => {
    if (!product) return;

    const fetchInstallments = async () => {
      const finalPrice = currentPromoPrice ?? currentPrice;
      const installmentsData = await fetchInstallmentsFromAPI(finalPrice);
      setInstallments(installmentsData);
    };

    void fetchInstallments();
  }, [product, selectedSizeId, currentPrice, currentPromoPrice]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-foreground/60">
          Carregando produto...
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-foreground/60">
          Produto não encontrado.
        </div>
        <Footer />
      </div>
    )
  }

  const imagens = product.imagens.length
    ? product.imagens
    : [
        {
          id: "placeholder",
          productId: product.id,
          url: "/placeholder.svg",
          altText: null,
          isPrimary: true,
          displayOrder: 0,
          createdAt: new Date().toISOString(),
        },
      ]

  const mainImage = imagens[selectedImageIndex]?.url ?? "/placeholder.svg"

  const selectedColor = product.cores.find((c) => c.id === selectedColorId)
  const selectedSize = product.tamanhos.find((t) => t.id === selectedSizeId)

  // ===== handler: adicionar ao carrinho =====
  const handleAddToCart = () => {
    if (!product) return

    if (!user) {
      toast.info("Faça login para adicionar produtos ao carrinho.")
      router.push("/auth/login")
      return
    }

    const newErrors: { color?: string; size?: string } = {}

    const requiresColor =
      product.personalizavel && product.cores && product.cores.length > 0
    const requiresSize =
      product.personalizavel && product.tamanhos && product.tamanhos.length > 0

    if (requiresColor && !selectedColorId) {
      newErrors.color = "Selecione uma cor para continuar."
    }

    if (requiresSize && !selectedSizeId) {
      newErrors.size = "Selecione um tamanho para continuar."
    }

    setErrors(newErrors)

    const hasErrors = Object.keys(newErrors).length > 0
    if (hasErrors) {
      toast.error(
        "Preencha as opções obrigatórias antes de adicionar ao carrinho.",
      )
      return
    }

    try {
      setIsAdding(true)

      // NOVO: Recalcular preço do tamanho selecionado no momento de adicionar
      let priceToUse = product.preco
      let promoToUse = product.precoPromocional

      if (selectedSizeId) {
        const sizeData = product.sizes?.find(s => s.sizeId === selectedSizeId)
        if (sizeData) {
          // Se o tamanho tiver preço específico, usa ele
          if (sizeData.price !== null) {
            priceToUse = sizeData.price
          }
          if (sizeData.promotionalPrice !== null) {
            promoToUse = sizeData.promotionalPrice
          }
        }
      }

      const finalPrice = promoToUse ?? priceToUse

      console.log('Adding to cart:', {
        sizeId: selectedSizeId,
        sizeName: selectedSize?.nome,
        priceToUse,
        promoToUse,
        finalPrice
      })

      addItem({
        productId: product.id,
        name: product.nome,
        price: finalPrice,
        imageUrl: mainImage,
        quantity,
        colorId: selectedColor?.id,
        colorName: selectedColor?.nome,
        sizeId: selectedSize?.id,
        sizeName: selectedSize?.nome,
        personalizationText: personalizationText.trim() || undefined,
      })

      // pequeno delay garante que o toast não seja perdido em algum re-render
      setTimeout(() => {
        toast.success("Produto adicionado ao carrinho!", {
          description: `${quantity}x ${product.nome}`,
          action: {
            label: "Ver carrinho",
            onClick: () => router.push("/cart"),
          },
        })
      }, 10)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
      toast.error("Não foi possível adicionar o produto ao carrinho.")
    } finally {
      setIsAdding(false)
    }
  }

  // ===== Render principal =====
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="py-4 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto text-sm text-foreground/60">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          /
          <Link href="/products" className="hover:text-foreground ml-1">
            Produtos
          </Link>{" "}
          /<span className="ml-1 text-foreground">{product.nome}</span>
        </div>
      </div>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                <Image
                  src={mainImage}
                  alt={product.nome}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {imagens.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {imagens.slice(0, 4).map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(i)}
                      className={`aspect-square rounded-lg overflow-hidden bg-muted border border-border ${
                        i === selectedImageIndex
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                    >
                      <Image
                        src={img.url || "/placeholder.svg"}
                        alt={`${product.nome} ${i + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-foreground/60">
                    {product.categoriaNome || "Categoria"}
                  </p>
                  <div className="flex items-center space-x-2 ml-auto">
                  </div>
                </div>
                <h1 className="text-4xl font-light text-foreground mb-3">
                  {product.nome}
                </h1>
              </div>

              <div className="border-t border-b border-border py-6 space-y-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-medium text-accent">
                    R$ {(currentPromoPrice ?? currentPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-normal text-foreground/60">à vista no PIX</span>
                  </span>
                  {currentPromoPrice && (
                    <>
                      <span className="text-lg text-foreground/50 line-through">
                        R$ {currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded">
                        -{Math.round(((currentPrice - currentPromoPrice) / currentPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-foreground/70">
                  Frete grátis para compras acima de R$ 200,00
                </p>
                
                {/* Parcelamento */}
                {installments && (() => {
                  const installmentInfo = getBestInstallmentDisplay(installments);
                  return (
                    <p className="text-sm text-foreground/80 font-medium">
                      {installmentInfo.text}
                    </p>
                  );
                })()}
              </div>

              {/* Descrição */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">
                  Sobre este produto
                </h3>
                <p className="text-sm text-foreground/70">
                  {product.descricao}
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start space-x-2">
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-accent"
                    />
                    <span>Material premium de alta qualidade</span>
                  </li>
                  {product.personalizavel && (
                    <li className="flex items-start space-x-2">
                      <Check
                        size={16}
                        className="mt-0.5 flex-shrink-0 text-accent"
                      />
                      <span>Completamente customizável e personalizável</span>
                    </li>
                  )}
                  <li className="flex items-start space-x-2">
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-accent"
                    />
                    <span>Entrega em até 15 dias úteis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-accent"
                    />
                    <span>Garantia de satisfação de 100%</span>
                  </li>
                </ul>
              </div>

              {/* Opções de Personalização */}
              {product.personalizavel ? (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium text-foreground">
                    Opções de Personalização
                  </h3>

                  {/* Cor */}
                  {product.cores.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Cor <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center flex-wrap gap-3">
                        {product.cores.map((color) => {
                          const isSelected = selectedColorId === color.id
                          return (
                            <button
                              key={color.id}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                isSelected
                                  ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-background"
                                  : "border-border hover:border-accent"
                              }`}
                              style={{
                                backgroundColor: color.codigoHex || "#ffffff",
                              }}
                              title={color.nome}
                              type="button"
                              onClick={() => {
                                setSelectedColorId(color.id)
                                setErrors((prev) => ({
                                  ...prev,
                                  color: undefined,
                                }))
                              }}
                            />
                          )
                        })}
                      </div>
                      {errors.color && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.color}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tamanho */}
                  {product.tamanhos.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tamanho <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm ${
                          errors.size ? "border-red-500" : "border-border"
                        }`}
                        value={selectedSizeId ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          setSelectedSizeId(value ? Number(value) : null)
                          setErrors((prev) => ({
                            ...prev,
                            size: undefined,
                          }))
                        }}
                      >
                        <option value="">Selecione um tamanho</option>
                        {product.tamanhos.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nome}
                          </option>
                        ))}
                      </select>
                      {errors.size && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.size}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Texto/Personalização (opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Personalização de Texto{" "}
                      <span className="text-foreground/50 text-xs">
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Seu texto aqui"
                      value={personalizationText}
                      onChange={(e) => setPersonalizationText(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder-foreground/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm text-foreground/70">
                    Este produto não possui opções de personalização
                    disponíveis.
                  </p>
                </div>
              )}

              {/* Quantidade e Adicionar ao Carrinho */}
              <div className="flex gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                    type="button"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors"
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAdding ? "Adicionando..." : "Adicionar ao Carrinho"}
                </button>
              </div>

              {/* Botão Customizar */}
              {product.personalizavel && (
                <p className="text-center w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors">
                  Entrar em contato via WhatsApp para personalizar
                </p>
              )}

              {/* Informações Adicionais */}
              <div className="space-y-2 text-xs text-foreground/60">
                <p>Categoria: {product.categoriaNome || "-"}</p>
                <p>Marca: Memoriza</p>
              </div>
            </div>
          </div>

          {/* Produtos Relacionados – depois a gente pode puxar do backend */}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}