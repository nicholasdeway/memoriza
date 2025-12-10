"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, MapPin, Package, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const menuItems = [
  { href: "/minha-conta/perfil", label: "Meu Perfil", icon: User },
  { href: "/minha-conta/enderecos", label: "Endereços", icon: MapPin },
  { href: "/minha-conta/pedidos", label: "Meus Pedidos", icon: Package },
  { href: "/cart", label: "Meu Carrinho", icon: ShoppingCart },
];

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, token, isLoading } = useAuth();

  // garante que estamos no browser antes de tomar decisão
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // controla redirecionamento SOMENTE depois de tudo carregar
  useEffect(() => {
    if (!hydrated) return;
    if (isLoading) return;

    // se não tiver token depois de carregar tudo → manda pro login
    if (!token) {
      router.replace("/auth/login");
    }
  }, [hydrated, isLoading, token, router]);

  // enquanto está carregando / hidratando, mostra só um placeholder
  if (!hydrated || isLoading || !user) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-foreground/60 text-sm">
            Carregando sua conta...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para a loja
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="font-medium text-foreground">
                    {user.fullName ??
                      [user.firstName, user.lastName].filter(Boolean).join(" ")}
                  </p>
                  <p className="text-sm text-foreground/60">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground/70 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}