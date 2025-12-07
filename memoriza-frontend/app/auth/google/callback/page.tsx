"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function GoogleCallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const oauthError = params.get("error");
    const tokenFromServer = params.get("token");
    const returnUrlFromServer = params.get("returnUrl") || "/";

    if (oauthError && !tokenFromServer) {
      router.replace(
        `/auth/login?googleError=${encodeURIComponent(oauthError)}`
      );
      return;
    }

    if (tokenFromServer) {
      loginWithToken(tokenFromServer);

      if (typeof window !== "undefined" && window.history?.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }

      router.replace(returnUrlFromServer);
      return;
    }

    router.replace("/auth/login?googleError=missing_token");
  }, [params, router, loginWithToken]);

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