"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight, Home, AlertCircle, RefreshCcw } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const API_BASE_URL = "/api-proxy";

interface OrderDetails {
  id: string;
  totalAmount: number;
}

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = searchParams?.get("external_reference") || 
                       searchParams?.get("preference_id") ||
                       searchParams?.get("collection_id") ||
                       searchParams?.get("order_id");

        const msg = searchParams?.get("message");
        if (msg) setErrorMessage(decodeURIComponent(msg));

        if (!orderId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/user/orders/${orderId}`, {
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
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
              <X className="w-8 h-8 text-red-500 stroke-[3]" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Pagamento não Aprovado
          </h1>
          
          <p className="text-muted-foreground mb-8 text-base font-light">
            Houve um problema ao processar seu pagamento. Nenhuma cobrança foi realizada.
          </p>

          {errorMessage && (
             <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 mb-8 text-sm text-red-800 flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
             </div>
          )}

          <div className="flex flex-col gap-3">
             <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Tentar Novamente <RefreshCcw className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
              >
                Voltar para Loja
              </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Precisa de ajuda? Entre em contato com nosso suporte.
          </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}