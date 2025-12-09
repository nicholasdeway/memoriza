"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const status = searchParams.get("status")
    const externalReference = searchParams.get("external_reference")
    
    console.log("❌ Pagamento recusado:", { paymentId, status, externalReference })
    
    if (externalReference) {
      setOrderId(externalReference)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-red-50 to-background">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Ícone de erro */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-foreground">
              Pagamento Não Aprovado
            </h1>
            <p className="text-foreground/70">
              Não foi possível processar seu pagamento.
            </p>
          </div>

          {/* Motivos comuns */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-medium text-orange-900">Possíveis motivos:</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Saldo ou limite insuficiente</li>
              <li>• Dados do cartão incorretos</li>
              <li>• Pagamento cancelado pelo usuário</li>
              <li>• Problema na operadora do cartão</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            {orderId && (
              <Link
                href={`/minha-conta/pedidos/${orderId}`}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Tentar Novamente
              </Link>
            )}
            
            <Link
              href="/cart"
              className="w-full border-2 border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar ao Carrinho
            </Link>
          </div>

          {/* Ajuda */}
          <p className="text-sm text-foreground/60">
            Precisa de ajuda?{" "}
            <Link href="/contato" className="text-primary hover:underline">
              Entre em contato
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
