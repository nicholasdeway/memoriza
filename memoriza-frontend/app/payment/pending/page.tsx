"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight, Home, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const API_BASE_URL = "/api-proxy";

interface OrderDetails {
  id: string;
  totalAmount: number;
}

function PaymentPendingPageContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = searchParams?.get("external_reference") || 
                       searchParams?.get("preference_id") ||
                       searchParams?.get("collection_id");

        if (!orderId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrder({
            id: data.id,
            totalAmount: data.totalAmount,
          });
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [searchParams]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8 text-center">
          
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-8 h-8 text-amber-500 stroke-[2]" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Em Análise
          </h1>
          
          <p className="text-muted-foreground mb-8 text-base font-light">
            Estamos aguardando a confirmação do pagamento. Você receberá um email assim que for aprovado.
          </p>

          {!loading && order && (
            <div className="bg-muted/30 border border-border/30 rounded-xl p-6 mb-8 shadow-sm text-center">
              <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
              <p className="text-2xl font-semibold text-foreground">
                 R$ {order.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                 Pedido #{order.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
             <Link
                href="/minha-conta/pedidos"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Meus Pedidos <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
              >
                Voltar para Loja
              </Link>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <PaymentPendingPageContent />
    </Suspense>
  );
}