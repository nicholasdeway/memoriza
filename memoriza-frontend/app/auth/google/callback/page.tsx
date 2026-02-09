"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function GoogleCallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const oauthError = params.get("error");
    const returnUrlFromServer = params.get("returnUrl") || "/";

    if (oauthError) {
      router.replace(
        `/auth/login?googleError=${encodeURIComponent(oauthError)}`
      );
      return;
    }

    // Apenas verifica se o cookie foi setado
    checkAuth()
      .then(() => {
         // Se sucesso (usuário veio), redireciona
         router.replace(returnUrlFromServer);
      })
      .catch(() => {
         // Se falha, o backend não setou cookie ou algo deu errado
         router.replace("/auth/login?googleError=auth_check_failed");
      });

  }, [params, router, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Conectando com o Google, aguarde...
      </p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Preparando conexão com o Google...
          </p>
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}