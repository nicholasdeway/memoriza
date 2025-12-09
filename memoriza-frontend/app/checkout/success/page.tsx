import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface CheckoutPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutPageProps) {
  const paymentId = searchParams.payment_id
  const status = searchParams.status
  const externalReferenceRaw = searchParams.external_reference

  const externalReference = Array.isArray(externalReferenceRaw)
    ? externalReferenceRaw[0]
    : externalReferenceRaw ?? null

  const orderId = externalReference ?? null

  console.log("✅ Pagamento aprovado:", { paymentId, status, externalReference })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-green-50 to-background">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Ícone de sucesso */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-foreground">
              Pagamento Aprovado!
            </h1>
            <p className="text-foreground/70">
              Seu pedido foi confirmado com sucesso.
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

          {/* Próximos passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-medium text-blue-900">Próximos passos:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Você receberá um e-mail de confirmação</li>
              <li>✓ Acompanhe seu pedido em &quot;Meus Pedidos&quot;</li>
              <li>✓ Enviaremos atualizações sobre a entrega</li>
            </ul>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            {orderId && (
              <Link
                href={`/minha-conta/pedidos/${orderId}`}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Ver Detalhes do Pedido
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