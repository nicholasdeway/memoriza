"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, Package, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const status = searchParams.get("status")
    const externalReference = searchParams.get("external_reference")
    
    console.log("⏳ Pagamento pendente:", { paymentId, status, externalReference })
    
    if (externalReference) {
      setOrderId(externalReference)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-yellow-50 to-background">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Ícone de pendente */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-foreground">
              Pagamento Pendente
            </h1>
            <p className="text-foreground/70">
              Estamos aguardando a confirmação do seu pagamento.
            </p>
          </div>

          {/* Informações do pedido */}
          {orderId && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                <Package size={16} />
                <span>Número do pedido</span>
              </div>
              <p className="font-mono text-lg font-medium text-foreground">
                #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          {/* Informações sobre pagamento pendente */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-medium text-yellow-900">O que acontece agora?</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>⏳ Aguardando confirmação do pagamento</li>
              <li>📧 Você receberá um e-mail quando for aprovado</li>
              <li>🔍 Acompanhe o status em "Meus Pedidos"</li>
              <li>⚡ PIX: aprovação em até 1 hora</li>
              <li>📄 Boleto: aprovação em 1-3 dias úteis</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            {orderId && (
              <Link
                href={`/minha-conta/pedidos/${orderId}`}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Acompanhar Pedido
                <ArrowRight size={18} />
              </Link>
            )}
            
            <Link
              href="/products"
              className="w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors block"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
