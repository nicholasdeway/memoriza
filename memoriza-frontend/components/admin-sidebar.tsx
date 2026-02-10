"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Palette,
  Store,
  ArrowLeft,
  Users,
  Shield,
  FileText,
  Image,
  Truck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  module?: string;
};

const menuSections: {
  title: string;
  items: MenuItem[];
}[] = [
  {
    title: "Principal",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        module: "dashboard",
      },
      {
        href: "/admin/produtos",
        label: "Produtos",
        icon: Package,
        module: "products",
      },
      {
        href: "/admin/categorias",
        label: "Categorias",
        icon: FolderTree,
        module: "categories",
      },
      {
        href: "/admin/tamanhos",
        label: "Tamanhos",
        icon: Ruler,
        module: "sizes",
      },
      {
        href: "/admin/cores",
        label: "Cores",
        icon: Palette,
        module: "colors",
      },
      {
        href: "/admin/pedidos",
        label: "Pedidos",
        icon: ShoppingCart,
        module: "orders",
      },
      {
        href: "/admin/frete",
        label: "Frete",
        icon: Truck,
        module: "shipping",
      },
      {
        href: "/admin/carrossel",
        label: "Carrossel",
        icon: Image,
        module: "carousel",
      },
      {
        href: "/admin/configuracoes",
        label: "Configurações",
        icon: Settings,
        module: "settings",
      },
    ],
  },
  {
    title: "Gestão da Empresa",
    items: [
      {
        href: "/admin/gestao-empresa/funcionarios",
        label: "Funcionários",
        icon: Users,
        module: "employees",
      },
      {
        href: "/admin/gestao-empresa/grupos",
        label: "Grupos & Permissões",
        icon: Shield,
        module: "groups",
      },
      {
        href: "/admin/gestao-empresa/logs",
        label: "Acessos & Logs",
        icon: FileText,
        module: "logs",
      },
    ],
  },
];

const ANIMATION_DURATION = 300; // ms
const SIDEBAR_EXPANDED_KEY = "adminSidebarExpanded";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  // módulos permitidos vindos do token/grupo
  const allowedModules: string[] = Array.isArray((user as any)?.modules)
    ? ((user as any).modules as string[])
    : [];

  // regra de visibilidade de item de menu:
  // - PROPRIETÁRIO (admin sem employeeGroupId): vê tudo
  // - FUNCIONÁRIO (com employeeGroupId): só vê módulos permitidos
  const canSeeItem = (item: MenuItem): boolean => {
    if (!item.module) return true;

    // Proprietário (admin sem employeeGroupId) vê tudo
    if (!user?.employeeGroupId) {
      return true;
    }

    // Funcionários: verifica módulos permitidos
    if (!allowedModules || allowedModules.length === 0) {
      return false; // Sem permissões = não vê nada
    }

    return allowedModules.includes(item.module);
  };

  // Lê o estado salvo do localStorage (se existir)
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    return saved === "true";
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [paidOrdersCount, setPaidOrdersCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchCount = async () => {
      try {
        const { getPaidOrdersCount } = await import("@/lib/api/admin-orders");
        const count = await getPaidOrdersCount();
        setPaidOrdersCount(count);
      } catch (error) {
        console.error("Erro ao buscar contagem de pedidos pagos:", error);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setExpanded((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(next));
      }
      return next;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  // ✨ Swipe Gesture Support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (isAnimating) return;

      const swipeDistance = touchEndX.current - touchStartX.current;
      const threshold = 50; // mínimo de 50px para considerar swipe

      // Swipe da esquerda para direita (abrir sidebar)
      if (!expanded && swipeDistance > threshold && touchStartX.current < 50) {
        setExpanded(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SIDEBAR_EXPANDED_KEY, "true");
        }
      }

      // Swipe da direita para esquerda (fechar sidebar)
      if (expanded && swipeDistance < -threshold) {
        setExpanded(false);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SIDEBAR_EXPANDED_KEY, "false");
        }
      }

      // Reset
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    // Adiciona listeners apenas no mobile
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [expanded, isAnimating]);

  return (
    <>
      {/* Overlay para mobile */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => !isAnimating && setExpanded(false)}
        />
      )}

      {/* Sidebar Principal */}
      <div
        ref={sidebarRef}
        className={`
          fixed lg:relative z-50
          bg-primary text-primary-foreground h-full flex flex-col
          transform-gpu transition-transform duration-300 ease-out
          ${
            expanded
              ? "translate-x-0 w-72"
              : "-translate-x-full lg:translate-x-0 lg:w-20"
          }
          will-change-transform
        `}
        style={{
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        {/* Header */}
        <div className="relative p-6 pt-safe border-b border-primary-foreground/10 flex flex-col justify-center flex-shrink-0" style={{ minHeight: '120px', paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
          {/* Botão expandir/recolher */}
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-primary-foreground text-primary rounded-full p-1 shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150 z-10 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Voltar à loja */}
          <Link
            href="/"
            title="Voltar à loja"
            aria-label="Voltar à loja"
            className={`
              flex items-center text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200
              ${expanded ? "gap-2 justify-start" : "justify-center"}
            `}
          >
            {expanded ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <ArrowLeft size={16} />
                <span className="whitespace-nowrap">Voltar à loja</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-[10px] leading-none">
                <Store size={18} />
                <span>Loja</span>
              </div>
            )}
          </Link>

          {/* Título */}
          <div
            className={`
              transition-all duration-250 ease-out overflow-hidden
              ${expanded ? "max-h-20 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}
            `}
          >
            <h1 className="text-xl font-semibold whitespace-nowrap animate-fade-in-up">
              Memoriza
            </h1>
            <p
              className="text-sm text-primary-foreground/70 whitespace-nowrap animate-fade-in-up"
              style={{ animationDelay: "50ms" }}
            >
              Painel Administrativo
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary-foreground/10 hover:[&::-webkit-scrollbar-thumb]:bg-primary-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
          {menuSections.map((section, sectionIdx) => (
            <div key={section.title} className={sectionIdx > 0 ? "mt-6" : ""}>
              {/* Linha separadora quando está colapsado e não é a primeira seção */}
              {sectionIdx > 0 && !expanded && (
                <div className="mb-6 border-t border-primary-foreground/10" />
              )}

              {/* Título da seção */}
              <div
                className={`
                  px-4 mb-2 overflow-hidden transition-all duration-200
                  ${expanded ? "max-h-8 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
                  {section.title}
                </p>
              </div>

              {/* Itens da seção */}
              <ul className="space-y-1">
                {section.items.map((item, index) => {
                  if (!canSeeItem(item)) return null;

                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`
                          group flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-out
                          transform-gpu hover:scale-[1.02] active:scale-[0.98]
                          ${
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground shadow-sm"
                              : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                          }
                          ${expanded ? "gap-3 justify-start" : "justify-center"}
                          will-change-transform
                        `}
                      >
                        <Icon
                          size={20}
                          className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        />

                        {/* Texto com animação */}
                        <span
                          className={`
                            whitespace-nowrap overflow-hidden transition-all duration-200 ease-out
                            ${
                              expanded
                                ? "max-w-[180px] opacity-100 animate-fade-in-left"
                                : "max-w-0 opacity-0"
                            }
                          `}
                          style={{
                            animationDelay: expanded ? `${index * 15}ms` : "0ms",
                          }}
                        >
                          {item.label}
                        </span>

                        {item.module === "orders" && paidOrdersCount > 0 && (
                          <span
                            className={`
                              ml-auto flex items-center justify-center bg-red-500 text-white font-bold rounded-full
                              ${
                                expanded
                                  ? "min-w-[20px] h-5 px-1 text-[10px]"
                                  : "absolute top-2 right-2 w-4 h-4 text-[9px]"
                              }
                            `}
                          >
                            {paidOrdersCount}
                          </span>
                        )}

                        {isActive && !paidOrdersCount && (
                          <div className="ml-auto w-1 h-6 bg-primary-foreground/40 rounded-full animate-pulse-soft" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-foreground/10 flex-shrink-0">
          {/* User Info */}
          {user && (
            <div
              className={`
                flex items-center mb-4 transition-all duration-200
                ${expanded ? "gap-3 justify-start" : "justify-center"}
              `}
            >
              <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground font-medium text-sm flex-shrink-0 border border-primary-foreground/20">
                {user.firstName?.charAt(0).toUpperCase() || "U"}
              </div>

              <div
                className={`
                  flex flex-col overflow-hidden transition-all duration-200 ease-out
                  ${expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"}
                `}
              >
                <p className="text-sm font-medium text-primary-foreground truncate text-ellipsis leading-tight break-words">
                  {user.fullName || user.firstName}
                </p>
                <p className="text-xs text-primary-foreground/60 truncate text-ellipsis break-all" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`
              group flex items-center w-full px-4 py-2 text-primary-foreground/70 
              hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg 
              transition-all duration-200 ease-out transform-gpu hover:scale-[1.02]
              ${expanded ? "gap-3 justify-start" : "justify-center"}
            `}
          >
            <LogOut
              size={18}
              className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
            />

            <span
              className={`
                whitespace-nowrap overflow-hidden transition-all duration-200 ease-out
                ${
                  expanded
                    ? "max-w-[180px] opacity-100 animate-fade-in-left"
                    : "max-w-0 opacity-0"
                }
              `}
            >
              Sair
            </span>
          </button>
        </div>
      </div>
    </>
  );
}