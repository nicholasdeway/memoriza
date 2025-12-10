"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  User,
  Menu,
  Search,
  Settings,
  LogOut,
  MapPin,
  Package,
  ChevronDown,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PromoBanner } from "./promo-banner";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105";

// Tipos da API (CategoryResponseDto)
interface CategoryApi {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

// Modelo usado no header
interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface AddressHeader {
  id: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Mesmo helper de slug usado na homepage/admin
const generateSlug = (nome: string) => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

function fixEncoding(value?: string): string {
  if (!value) return "";
  try {
    const decoded = decodeURIComponent(escape(value));
    return decoded;
  } catch {
    return value;
  }
}

const MAX_VISIBLE_CATEGORIES = 10;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [moreCategoriesOpen, setMoreCategoriesOpen] = useState(false);

  // Address state
  const [headerAddress, setHeaderAddress] = useState<AddressHeader | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const { user, token, logout, isAdmin } = useAuth();
  const { itemsCount, clearCart } = useCart();

  // animação do ícone do carrinho
  const [isCartBumping, setIsCartBumping] = useState(false);
  useEffect(() => {
    if (itemsCount <= 0) return;
    setIsCartBumping(true);
    const timer = setTimeout(() => setIsCartBumping(false), 300);
    return () => clearTimeout(timer);
  }, [itemsCount]);

  // Normaliza dados do usuário a partir do token/contexto
  const rawFirstName =
    (user?.firstName as string | undefined) ??
    ((user?.fullName as string | undefined)?.split(" ")[0] ?? "");
  const rawLastName = (user?.lastName as string | undefined) ?? "";
  const email = (user?.email as string | undefined) ?? "";

  const firstName = fixEncoding(rawFirstName);
  const lastName = fixEncoding(rawLastName);

  const isLoggedIn = !!user;

  // Busca categorias reais da API (mesmas da homepage / sidebar)
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        cache: "no-store",
      });

      if (!res.ok) {
        let message = "";
        try {
          message = await res.text();
        } catch {
          message = "<não foi possível ler o corpo da resposta>";
        }

        console.warn(
          "[Header] Falha ao carregar categorias. Status:",
          res.status,
          "- Mensagem (resumida):",
          message.substring(0, 200), // só um pedaço, pra não poluir
        );

        setCategories([]); // garante estado consistente em caso de erro
        return;
      }

      const data: CategoryApi[] = await res.json();

      const mapped = data
        .filter((c) => c.isActive)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime(),
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: generateSlug(c.name),
          createdAt: c.createdAt,
        }));

      setCategories(mapped);
    } catch (error) {
      console.error("[Header] Erro ao buscar categorias:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  void fetchCategories();
}, []);

  // Fetch user address (default)
  useEffect(() => {
    if (!token) {
      setHeaderAddress(null);
      return;
    }

    const fetchAddress = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data: any[] = await res.json();
          // Find default or take first
          const defaultAddr = data.find((a) => a.isDefault) || data[0];
          if (defaultAddr) {
            setHeaderAddress({
              id: defaultAddr.id,
              label: defaultAddr.label,
              street: defaultAddr.street,
              number: defaultAddr.number,
              neighborhood: defaultAddr.neighborhood,
              city: defaultAddr.city,
              state: defaultAddr.state,
              zipCode: defaultAddr.zipCode,
              isDefault: defaultAddr.isDefault,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar endereço para o header:", error);
      }
    };

    void fetchAddress();
  }, [token]);

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES;
  const extraCategories = hasMoreCategories
    ? categories.slice(MAX_VISIBLE_CATEGORIES)
    : [];

  return (
    <>
      <PromoBanner />
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image 
                src="/logo-header.png" 
                alt="Memoriza" 
                width={450} 
                height={120}
                className="h-25 sm:h-28 lg:h-35 w-auto mt-2"
                priority
              />
            </Link>

            {/* Address Display (Desktop) */}
            {headerAddress && (
              <button
                onClick={() => setAddressModalOpen(true)}
                className="hidden lg:flex items-center gap-2 text-left hover:bg-muted/50 p-2 rounded-lg transition-colors max-w-[200px]"
              >
                <MapPin className="text-primary shrink-0" size={20} />
                <div className="flex flex-col leading-tight overflow-hidden">
                  <span className="text-[10px] text-foreground/60 font-medium uppercase tracking-wide">
                    Enviar para
                  </span>
                  <span className="text-sm font-medium text-foreground truncate w-full">
                    {headerAddress.street}, {headerAddress.number}
                  </span>
                </div>
              </button>
            )}

            {/* Search (desktop) */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar produtos, categorias..."
                  className="w-full pl-12 pr-4 py-3 bg-muted/25 border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6 shrink-0">
              {/* Search mobile icon */}
              <button 
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden text-foreground hover:text-accent transition-colors"
              >
                <Search size={20} />
              </button>

              {/* User / Profile menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="text-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <User size={20} />
                  {isLoggedIn && firstName && (
                    <span className="hidden sm:inline text-sm font-medium">
                      {firstName}
                    </span>
                  )}
                </button>

                {profileMenuOpen && (
                  <div className="absolute top-full left-1/2 mt-2  w-56 -translate-x-1/2 transform bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                    {isLoggedIn ? (
                      <>
                        {/* Cabeçalho com nome e email */}
                        <div className="px-4 py-2 border-b border-border">
                          <p className="font-medium text-sm">
                            {firstName} {lastName}
                          </p>
                          {email && (
                            <p className="text-xs text-foreground/60">
                              {email}
                            </p>
                          )}
                        </div>

                        {/* Painel Admin: mostra para Admin OU Funcionários */}
                        {(isAdmin || user?.employeeGroupId) ? (
                          <>
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-accent font-medium"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Settings size={16} />
                              Painel Administrativo
                            </Link>

                            <button
                              onClick={() => {
                                clearCart(); // limpa carrinho no logout
                                logout();
                                setProfileMenuOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-red-500 border-t border-border mt-2 pt-2"
                            >
                              <LogOut size={16} />
                              Sair
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/minha-conta/perfil"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <User size={16} />
                              Meu Perfil
                            </Link>

                            <Link
                              href="/minha-conta/enderecos"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <MapPin size={16} />
                              Endereços
                            </Link>

                            <Link
                              href="/minha-conta/pedidos"
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Package size={16} />
                              Meus Pedidos
                            </Link>

                            <button
                              onClick={() => {
                                clearCart(); // limpa carrinho no logout
                                logout();
                                setProfileMenuOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-red-500 border-t border-border mt-2 pt-2"
                            >
                              <LogOut size={16} />
                              Sair
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <User size={16} />
                          Entrar
                        </Link>
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Criar conta
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* End user menu */}

              {/* Cart icon */}
              <Link
                href="/cart"
                className="relative text-foreground hover:text-accent transition-colors"
              >
                <ShoppingBag
                  size={20}
                  className={`transition-transform duration-150 ${
                    isCartBumping ? "scale-110" : ""
                  }`}
                />
                <span
                  className={`absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform transition-transform duration-150 ${
                    isCartBumping ? "scale-110" : ""
                  } ${itemsCount === 0 ? "opacity-0" : "opacity-100"}`}
                >
                  {itemsCount}
                </span>
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-3">
              {/* Mobile search */}
              <div className="relative mb-4">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-sm"
                />
              </div>

              {(isAdmin || user?.employeeGroupId) && (
                <Link
                  href="/admin"
                  className="block text-accent font-medium hover:text-accent/80 transition-colors text-sm py-2 border-b border-border mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Painel Administrativo
                </Link>
              )}

              {loadingCategories && (
                <p className="text-xs text-foreground/60">
                  Carregando categorias...
                </p>
              )}

              {!loadingCategories &&
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block text-foreground hover:text-accent transition-colors text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}

              {!loadingCategories && categories.length === 0 && (
                <p className="text-xs text-foreground/60">
                  Nenhuma categoria encontrada.
                </p>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Barra de categorias abaixo do header (desktop) */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Wrapper desktop: scroll só nas categorias, dropdown “Mais” fora do overflow */}
          <div className="relative hidden md:flex items-center justify-center py-3">
            {/* Área rolável com as categorias visíveis */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex items-center justify-center gap-6 whitespace-nowrap">
                {loadingCategories && (
                  <span className="text-xs text-foreground/60">
                    Carregando categorias...
                  </span>
                )}

                {!loadingCategories &&
                  visibleCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="text-foreground/80 hover:text-accent transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  ))}

                {!loadingCategories && categories.length === 0 && (
                  <span className="text-xs text-foreground/60">
                    Nenhuma categoria disponível.
                  </span>
                )}
              </div>
            </div>

            {/* Botão "Mais" fora do overflow, com dropdown livre */}
            {!loadingCategories && hasMoreCategories && (
              <div className="relative ml-4">
                <button
                  type="button"
                  onClick={() =>
                    setMoreCategoriesOpen((prev) => !prev)
                  }
                  className="flex items-center gap-1 text-foreground/80 hover:text-accent transition-colors text-sm font-medium"
                >
                  Mais
                  <ChevronDown size={14} />
                </button>

                {moreCategoriesOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-md shadow-lg py-2 z-[9999]">
                    {extraCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-accent transition-colors whitespace-nowrap"
                        onClick={() => setMoreCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Details Modal */}
      {addressModalOpen && headerAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-md p-6 relative shadow-xl">
            <button
              onClick={() => setAddressModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Endereço de Entrega
                </h3>
                <p className="text-sm text-foreground/60">
                  {headerAddress.label}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-1">
                <p className="font-medium text-foreground">
                  {headerAddress.street}, {headerAddress.number}
                </p>
                <p className="text-sm text-foreground/70">
                  {headerAddress.neighborhood}
                </p>
                <p className="text-sm text-foreground/70">
                  {headerAddress.city} - {headerAddress.state}
                </p>
                <p className="text-sm text-foreground/70">
                  CEP: {headerAddress.zipCode}
                </p>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/minha-conta/enderecos"
                  onClick={() => setAddressModalOpen(false)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Gerenciar endereços
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] p-4 md:hidden">
          <div className="bg-background border border-border rounded-xl w-full max-w-md mt-20 p-6 relative shadow-xl">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <Search className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Buscar Produtos
                </h3>
                <p className="text-sm text-foreground/60">
                  Encontre o que você procura
                </p>
              </div>
            </div>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar produtos, categorias..."
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-muted/25 border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>

            <p className="text-xs text-foreground/60 mt-4">
              Digite para buscar produtos, categorias e muito mais.
            </p>
          </div>
        </div>
      )}
    </>
  );
}