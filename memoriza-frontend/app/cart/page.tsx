"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, ArrowRight } from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"

const FREE_SHIPPING_THRESHOLD = 200

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2)}`
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  const shipping =
    subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? 15 : 0
  const total = subtotal + shipping
  const missingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            Seu Carrinho
          </h1>
        </div>
      </section>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => {
                    const lineTotal = item.price * item.quantity

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {item.name}
                          </h3>

                          {/* Infos adicionais do item */}
                          <div className="mt-1 text-xs text-foreground/60 space-y-1">
                            <p>
                              Preço unitário: {formatCurrency(item.price)}
                            </p>

                            {item.sizeName && (
                              <p>Tamanho: {item.sizeName}</p>
                            )}
                            {item.colorName && (
                              <p>Cor: {item.colorName}</p>
                            )}
                            {item.personalizationText && (
                              <p>Texto: {item.personalizationText}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                className="px-3 py-1 text-foreground hover:bg-muted"
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    Math.max(1, item.quantity - 1),
                                    item.sizeId,
                                    item.colorId,
                                    item.personalizationText,
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-l border-r border-border">
                                {item.quantity}
                              </span>
                              <button
                                className="px-3 py-1 text-foreground hover:bg-muted"
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                    item.sizeId,
                                    item.colorId,
                                    item.personalizationText,
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                            <p className="font-medium text-foreground">
                              {formatCurrency(lineTotal)}
                            </p>
                          </div>
                        </div>

                        <button
                          className="p-2 text-foreground/60 hover:text-destructive transition-colors"
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remover item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors font-medium mt-6"
                >
                  <span>←</span>
                  <span>Continuar Comprando</span>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-border rounded-lg p-6 space-y-4 sticky top-24">
                  <h2 className="text-lg font-medium text-foreground">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-2 border-b border-border pb-4 text-sm">
                    <div className="flex justify-between text-foreground/70">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-foreground/70">
                      <span>Frete</span>
                      <span>
                        {shipping === 0
                          ? "Grátis"
                          : formatCurrency(shipping)}
                      </span>
                    </div>
                    {missingForFreeShipping > 0 && (
                      <p className="text-xs text-accent mt-2">
                        Adicione{" "}
                        {formatCurrency(missingForFreeShipping)} para frete
                        grátis
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-lg font-medium text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Ir para Checkout</span>
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/products"
                    className="w-full border-2 border-primary text-primary py-2 rounded-lg font-medium hover:bg-primary/5 transition-colors text-center block"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/70 mb-6">
                Seu carrinho está vazio
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90"
              >
                <span>Explorar Produtos</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}