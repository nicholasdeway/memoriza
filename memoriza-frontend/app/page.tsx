"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Star, ShoppingCart } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductFilters } from "@/components/product-filters";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105";

// ===== Tipos da API =====
interface CategoryApi {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

interface SizeApi {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface ColorApi {
  id: number;
  name: string;
  hexCode: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ProductImageApi {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

interface ProductApi {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  promotionalPrice: number | null;
  sizeIds: number[];
  colorIds: number[];
  isPersonalizable: boolean;
  isActive: boolean;
  createdAt: string;
  images: ProductImageApi[];
}

// ===== Modelos de tela =====
interface Category {
  id: string;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
  hex: string | null;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  promotionalPrice?: number | null;
  imageUrl: string | null;
  sizeIds: number[];
  colorIds: number[];
  createdAt: string;
}

// opções de ordenação (incluindo alfabética)
type SortOption =
  | "popular"
  | "newest"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "name-desc";

// Faixas de preço
const PRICE_RANGES = [
  "Todas",
  "R$ 0-100",
  "R$ 100-300",
  "R$ 300-500",
  "R$ 500+",
];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Helper para gerar slug (mesmo usado no header)
const generateSlug = (nome: string) => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function Home() {
  // slug vindo da URL (?category=...)
  const [categorySlugFromUrl, setCategorySlugFromUrl] = useState<string | null>(
    null,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("Todos");
  const [selectedPrice, setSelectedPrice] = useState<string>("Todas");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);

  // Paginação - 12 produtos por página na homepage
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // ===== Ler category da URL no client (sem useSearchParams) =====
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const categoryFromQuery = params.get("category");

    if (categoryFromQuery) {
      setCategorySlugFromUrl(categoryFromQuery);
    }
  }, []);

  // ===== Fetch filtros + produtos =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingFilters(true);
        setLoadingProducts(true);

        const [catRes, sizeRes, colorRes, productRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/sizes`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/colors`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" }),
        ]);

        // Categorias
        if (catRes.ok) {
          const data: CategoryApi[] = await catRes.json();
          const mapped: Category[] = data
            .filter((c) => c.isActive)
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
            .map((c) => ({
              id: c.id,
              name: c.name,
            }));
          setCategories(mapped);
        }

        // Tamanhos
        if (sizeRes.ok) {
          const data: SizeApi[] = await sizeRes.json();
          const mappedSizes: Size[] = data
            .filter((s) => s.isActive)
            .map((s) => ({ id: s.id, name: s.name }));
          setSizes(mappedSizes);
        }

        // Cores
        if (colorRes.ok) {
          const data: ColorApi[] = await colorRes.json();
          const mappedColors: Color[] = data
            .filter((c) => c.isActive)
            .map((c) => ({
              id: c.id,
              name: c.name,
              hex: c.hexCode,
            }));
          setColors(mappedColors);
        }

        // Produtos
        if (productRes.ok) {
          const data: ProductApi[] = await productRes.json();
          const mappedProducts: Product[] = data
            .filter((p) => p.isActive)
            .map((p) => {
              const primaryImage =
                p.images.find((img) => img.isPrimary) ?? p.images[0];

              return {
                id: p.id,
                categoryId: p.categoryId,
                name: p.name,
                price: p.price,
                promotionalPrice: p.promotionalPrice,
                imageUrl: primaryImage?.url ?? null,
                sizeIds: p.sizeIds ?? [],
                colorIds: p.colorIds ?? [],
                createdAt: p.createdAt,
              };
            });

          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Erro ao carregar filtros/produtos:", error);
      } finally {
        setLoadingFilters(false);
        setLoadingProducts(false);
      }
    };

    void fetchData();
  }, []);

  // Aplicar filtro de categoria da URL quando categorias carregarem
  useEffect(() => {
    if (!categorySlugFromUrl || categories.length === 0) return;

    const matchedCategory = categories.find(
      (cat) => generateSlug(cat.name) === categorySlugFromUrl,
    );

    if (matchedCategory) {
      setSelectedCategoryId(matchedCategory.id);
    }
  }, [categorySlugFromUrl, categories]);

  // Contagens por tamanho/cor (com base nos produtos reais)
  const sizeCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    products.forEach((p) => {
      p.sizeIds.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const colorCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    products.forEach((p) => {
      p.colorIds.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const toggleSize = (id: number) => {
    setSelectedSizeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleColor = (id: number) => {
    setSelectedColorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleResetFilters = () => {
    setSelectedCategoryId("Todos");
    setSelectedPrice("Todas");
    setSelectedSizeIds([]);
    setSelectedColorIds([]);
    setShowAllSizes(false);
    setShowAllColors(false);
    setSortBy("popular");
  };

  const visibleSizes = showAllSizes ? sizes : sizes.slice(0, 7);
  const visibleColors = showAllColors ? colors : colors.slice(0, 7);

  const categoryOptions: { id: string; label: string }[] = [
    { id: "Todos", label: "Todos" },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];

  const getSizeLabel = (product: Product) => {
    const names = product.sizeIds
      .map((id) => sizes.find((s) => s.id === id)?.name)
      .filter(Boolean);
    return names.join(", ");
  };

  const getColorLabel = (product: Product) => {
    const names = product.colorIds
      .map((id) => colors.find((c) => c.id === id)?.name)
      .filter(Boolean);
    return names.join(", ");
  };

  const matchPriceRange = (product: Product, range: string) => {
    if (range === "Todas") return true;

    const basePrice = product.price;
    const finalPrice =
      product.promotionalPrice && product.promotionalPrice > 0
        ? product.promotionalPrice
        : basePrice;

    switch (range) {
      case "R$ 0-100":
        return finalPrice >= 0 && finalPrice <= 100;
      case "R$ 100-300":
        return finalPrice > 100 && finalPrice <= 300;
      case "R$ 300-500":
        return finalPrice > 300 && finalPrice <= 500;
      case "R$ 500+":
        return finalPrice > 500;
      default:
        return true;
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory =
        selectedCategoryId === "Todos" || p.categoryId === selectedCategoryId;

      const matchSize =
        selectedSizeIds.length === 0 ||
        p.sizeIds.some((id) => selectedSizeIds.includes(id));

      const matchColor =
        selectedColorIds.length === 0 ||
        p.colorIds.some((id) => selectedColorIds.includes(id));

      const matchPrice = matchPriceRange(p, selectedPrice);

      return matchCategory && matchSize && matchColor && matchPrice;
    });

    list = [...list];

    list.sort((a, b) => {
      const aBase = a.price;
      const aFinal =
        a.promotionalPrice && a.promotionalPrice > 0
          ? a.promotionalPrice
          : aBase;

      const bBase = b.price;
      const bFinal =
        b.promotionalPrice && b.promotionalPrice > 0
          ? b.promotionalPrice
          : bBase;

      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        case "price-low":
          return aFinal - bFinal;
        case "price-high":
          return bFinal - aFinal;
        case "name-asc":
          return a.name.localeCompare(b.name, "pt-BR");
        case "name-desc":
          return b.name.localeCompare(a.name, "pt-BR");
        case "popular":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
      }
    });

    return list;
  }, [
    products,
    selectedCategoryId,
    selectedSizeIds,
    selectedColorIds,
    selectedPrice,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, selectedSizeIds, selectedColorIds, selectedPrice, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          -1,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          -1,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          -1,
          totalPages,
        );
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const Filters = (
    <ProductFilters
      categories={categories}
      sizes={sizes}
      colors={colors}
      loadingFilters={loadingFilters}
      selectedCategoryId={selectedCategoryId}
      selectedPrice={selectedPrice}
      selectedSizeIds={selectedSizeIds}
      selectedColorIds={selectedColorIds}
      sizeCounts={sizeCounts}
      colorCounts={colorCounts}
      showAllSizes={showAllSizes}
      showAllColors={showAllColors}
      priceRanges={PRICE_RANGES}
      onCategoryChange={setSelectedCategoryId}
      onPriceChange={setSelectedPrice}
      onToggleSize={toggleSize}
      onToggleColor={toggleColor}
      onToggleShowAllSizes={setShowAllSizes}
      onToggleShowAllColors={setShowAllColors}
      onResetFilters={handleResetFilters}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />

      {/* Carrossel no topo da home - Full width sem padding */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <HeroCarousel />
      </div>

      {/* Cabeçalho da Página / Seção de título */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-2">
            Catálogo de Produtos
          </h1>
          <p className="text-foreground/70">
            Explore nossa coleção premium de produtos personalizáveis
          </p>
        </div>
      </section>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Filtros da Barra Lateral - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">{Filters}</div>
            </div>

            {/* Grade de Produtos */}
            <div className="lg:col-span-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                {/* Mobile Filter Trigger */}
                <div className="lg:hidden w-full md:w-auto">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <Filter size={16} />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                        <SheetDescription>
                          Refine sua busca por produtos.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-4 overflow-y-auto max-h-[calc(100vh-120px)] pb-8">
                        {Filters}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <p className="text-sm text-foreground/70">
                  {loadingProducts
                    ? "Carregando produtos..."
                    : `Mostrando ${filteredProducts.length} produto${
                        filteredProducts.length === 1 ? "" : "s"
                      }`}
                </p>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <label className="text-sm text-foreground/70 whitespace-nowrap">
                    Ordenar:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-1 border border-border rounded-lg text-sm bg-background text-foreground flex-1 md:flex-none"
                  >
                    <option value="popular">Mais Popular</option>
                    <option value="newest">Mais Novo</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="name-asc">Nome (A–Z)</option>
                    <option value="name-desc">Nome (Z–A)</option>
                  </select>
                </div>
              </div>

              {loadingProducts && products.length === 0 ? (
                <div className="py-12 text-center text-foreground/60">
                  Carregando produtos...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-foreground/60">
                  Nenhum produto encontrado com os filtros selecionados.
                </div>
              ) : (
                <>
                  {/* GRID de produtos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                    {paginatedProducts.map((product) => {
                      const sizeLabel = getSizeLabel(product);

                      const basePrice = product.price;
                      const finalPrice =
                        product.promotionalPrice && product.promotionalPrice > 0
                          ? product.promotionalPrice
                          : basePrice;

                      const hasDiscount =
                        product.promotionalPrice &&
                        product.promotionalPrice > 0 &&
                        product.promotionalPrice < basePrice;

                      let discountLabel: string | null = null;
                      if (hasDiscount) {
                        const discount =
                          100 - Math.round((finalPrice / basePrice) * 100);
                        if (discount > 0) {
                          discountLabel = `-${discount}%`;
                        }
                      }

                      const productColors = product.colorIds
                        .map((id) => colors.find((c) => c.id === id))
                        .filter((c): c is Color => Boolean(c));

                      return (
                        <div
                          key={product.id}
                          className="group flex flex-col h-full bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                          <Link
                            href={`/products/${product.id}`}
                            className="flex-1 flex flex-col"
                          >
                            <div className="relative bg-muted rounded-lg overflow-hidden mb-4 aspect-square">
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {discountLabel && (
                                <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                                  {discountLabel}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col">
                              <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 min-h-[2.75rem]">
                                {product.name}
                              </h3>

                              {productColors.length > 0 && (
                                <div className="mt-2 flex items-center gap-1">
                                  {productColors.map((color) => (
                                    <span
                                      key={color.id}
                                      className="w-4 h-4 rounded-full border border-border"
                                      style={{
                                        backgroundColor:
                                          color.hex || "#ffffff",
                                      }}
                                    />
                                  ))}
                                </div>
                              )}

                              {sizeLabel && (
                                <p className="mt-1 text-xs text-foreground/60 line-clamp-1">
                                  {sizeLabel}
                                </p>
                              )}

                              <div className="mt-3 space-y-1">
                                {hasDiscount ? (
                                  <>
                                    <p className="text-sm font-semibold text-foreground">
                                      {formatCurrency(finalPrice)}
                                    </p>
                                    <p className="text-xs text-foreground/50 line-through">
                                      {formatCurrency(basePrice)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="font-medium text-foreground">
                                    {formatCurrency(basePrice)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>

                          <Link
                            href={`/products/${product.id}`}
                            className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                          >
                            <ShoppingCart size={18} />
                            Comprar
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-12">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>

                      {getPageNumbers().map((page, index) => {
                        if (page === -1) {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-foreground/60"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "border border-border hover:bg-muted"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próximo
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}