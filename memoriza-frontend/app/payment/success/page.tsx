"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, Home, Loader2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

const API_BASE_URL = "/api-proxy";

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

function PaymentSuccessPageContent() {
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
            status: data.status,
            createdAt: data.createdAt,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar pedido:", error);
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
          
          {/* Icon Animation Container */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
                <Check className="w-8 h-8 text-green-600 stroke-[3]" />
              </div>
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Pagamento Confirmado
          </h1>
          
          <p className="text-muted-foreground mb-8 text-base font-light">
            Obrigado por sua compra. Seu pedido foi recebido e está sendo processado.
          </p>

          {!loading && order && (
            <div className="bg-muted/30 rounded-xl p-5 mb-8 text-left border border-border/30">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Pedido</span>
                <span className="font-mono text-sm font-medium">#{order.id.substring(0, 8).toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-border/30">
                <span className="text-sm text-muted-foreground">Data</span>
                <span className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">
                  R$ {order.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {loading && (
             <div className="mb-8 flex justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
             </div>
          )}

          <div className="flex flex-col gap-3">
             <Link
                href="/minha-conta/pedidos"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Acompanhar Pedido <ArrowRight className="ml-2 w-4 h-4" />
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}