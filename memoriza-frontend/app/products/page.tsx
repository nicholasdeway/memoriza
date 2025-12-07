"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useEffect, useMemo, useState } from "react";
import { Filter, ShoppingCart } from "lucide-react";
import Link from "next/link";

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

export default function ProductsPage() {
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

  // Helpers para exibir labels de tamanho
  const getSizeLabel = (product: Product) => {
    const names = product.sizeIds
      .map((id) => sizes.find((s) => s.id === id)?.name)
      .filter(Boolean);
    return names.join(", ");
  };

  // Função para filtrar por faixa de preço
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

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      // Categoria
      const matchCategory =
        selectedCategoryId === "Todos" || p.categoryId === selectedCategoryId;

      // Tamanho
      const matchSize =
        selectedSizeIds.length === 0 ||
        p.sizeIds.some((id) => selectedSizeIds.includes(id));

      // Cor
      const matchColor =
        selectedColorIds.length === 0 ||
        p.colorIds.some((id) => selectedColorIds.includes(id));

      // Preço
      const matchPrice = matchPriceRange(p, selectedPrice);

      return matchCategory && matchSize && matchColor && matchPrice;
    });

    // Ordenação
    list = [...list]; // cópia para não mutar state

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
          // Por enquanto, tratamos "popular" como mais recentes
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

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      {/* Cabeçalho da Página */}
      <section className="py-8 px-4 ">
        <div className="max-w-7xl mx-auto">

        </div>
      </section>

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Filtros da Barra Lateral */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-foreground" />
                  <h3 className="font-medium text-foreground">Filtros</h3>
                </div>

                {/* Categoria (API) */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-foreground mb-3 text-sm">
                    Categoria
                  </h4>

                  {loadingFilters && categories.length === 0 ? (
                    <p className="text-xs text-foreground/60">
                      Carregando categorias...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {categoryOptions.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={cat.id}
                            checked={selectedCategoryId === cat.id}
                            onChange={(e) =>
                              setSelectedCategoryId(e.target.value)
                            }
                            className="rounded-sm"
                          />
                          <span className="text-sm text-foreground/70">
                            {cat.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preço */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-foreground mb-3 text-sm">
                    Preço
                  </h4>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label
                        key={range}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="price"
                          value={range}
                          checked={selectedPrice === range}
                          onChange={(e) => setSelectedPrice(e.target.value)}
                          className="rounded-sm"
                        />
                        <span className="text-sm text-foreground/70">
                          {range}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tamanho */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-foreground mb-3 text-sm">
                    Tamanho
                  </h4>

                  {loadingFilters && sizes.length === 0 ? (
                    <p className="text-xs text-foreground/60">
                      Carregando tamanhos...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {visibleSizes.map((size) => (
                        <label
                          key={size.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded-sm"
                            checked={selectedSizeIds.includes(size.id)}
                            onChange={() => toggleSize(size.id)}
                          />
                          <span className="text-sm text-foreground/70">
                            {size.name}{" "}
                            <span className="text-xs text-foreground/60">
                              ({sizeCounts[size.id] ?? 0})
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {sizes.length > visibleSizes.length && (
                    <button
                      type="button"
                      onClick={() => setShowAllSizes(true)}
                      className="mt-3 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-background hover:bg-primary/5 transition-colors"
                    >
                      Ver todos
                    </button>
                  )}

                  {showAllSizes && sizes.length > 7 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSizes(false)}
                      className="mt-2 ml-1 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-border text-foreground/70 bg-background hover:bg-muted transition-colors"
                    >
                      Ver menos
                    </button>
                  )}
                </div>

                {/* Cor */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-foreground mb-3 text-sm">
                    Cor
                  </h4>

                  {loadingFilters && colors.length === 0 ? (
                    <p className="text-xs text-foreground/60">
                      Carregando cores...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {visibleColors.map((color) => (
                        <label
                          key={color.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded-sm"
                            checked={selectedColorIds.includes(color.id)}
                            onChange={() => toggleColor(color.id)}
                          />
                          <span className="flex items-center space-x-2 text-sm text-foreground/70">
                            <span
                              className="w-4 h-4 rounded-full border border-border"
                              style={{
                                backgroundColor: color.hex || "#ffffff",
                              }}
                            />
                            <span>
                              {color.name}{" "}
                              <span className="text-xs text-foreground/60">
                                ({colorCounts[color.id] ?? 0})
                              </span>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {colors.length > visibleColors.length && (
                    <button
                      type="button"
                      onClick={() => setShowAllColors(true)}
                      className="mt-3 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-background hover:bg-primary/5 transition-colors"
                    >
                      Ver todos
                    </button>
                  )}

                  {showAllColors && colors.length > 7 && (
                    <button
                      type="button"
                      onClick={() => setShowAllColors(false)}
                      className="mt-2 ml-1 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-border text-foreground/70 bg-background hover:bg-muted transition-colors"
                    >
                      Ver menos
                    </button>
                  )}
                </div>

                {/* Resetar */}
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Grade de Produtos */}
            <div className="lg:col-span-4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-foreground/70">
                  {loadingProducts
                    ? "Carregando produtos..."
                    : `Mostrando ${filteredProducts.length} produto${
                        filteredProducts.length === 1 ? "" : "s"
                      }`}
                </p>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-foreground/70">
                    Ordenar:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as SortOption)
                    }
                    className="px-3 py-1 border border-border rounded-lg text-sm bg-background text-foreground"
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
                  {/* 🔹 GRID COM 5 COLUNAS EM TELAS GRANDES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filteredProducts.map((product) => {
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
                        // CARD NO ESTILO KABUM
                        <div
                          key={product.id}
                          className="group flex flex-col h-full bg-white rounded-lg border border-transparent shadow-sm hover:shadow-md transition-all p-2">
                          <Link href={`/products/${product.id}`} className="block">

                            {/* BLOCO DA IMAGEM - ALTURA FIXA, ESTILO KABUM */}
                            <div className="relative w-full h-52 md:h-56 bg-muted rounded-lg overflow-hidden mb-3">
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

                            {/* 1. TÍTULO */}
                            <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 min-h-[2.75rem]">
                              {product.name}
                            </h3>

                            {/* 2. CORES (BOLINHAS) */}
                            {productColors.length > 0 && (
                              <div className="mt-1 flex items-center gap-1">
                                {productColors.map((color) => (
                                  <span
                                    key={color.id}
                                    className="w-4 h-4 rounded-full border border-border"
                                    style={{ backgroundColor: color.hex || "#ffffff" }}
                                  />
                                ))}
                              </div>
                            )}

                            {/* 3. TAMANHOS */}
                            {sizeLabel && (
                              <p className="mt-1 text-xs text-foreground/60 line-clamp-1">
                                {sizeLabel}
                              </p>
                            )}

                            {/* 4. PREÇO COM DESCONTO / 5. PREÇO ORIGINAL */}
                            <div className="mt-3 space-y-1">
                              {hasDiscount ? (
                                <>
                                  {/* Preço com desconto (destacado) */}
                                  <p className="text-sm font-semibold text-foreground">
                                    {formatCurrency(finalPrice)}
                                  </p>
                                  {/* Preço original riscado */}
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
                          </Link>

                          {/* 6. BOTÃO DE COMPRAR */}
                          <div className="mt-auto pt-3">
                            <Link
                              href={`/products/${product.id}`}
                              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                              <ShoppingCart size={18} />
                              Comprar
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Paginação fake por enquanto */}
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      Anterior
                    </button>
                    <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                      1
                    </button>
                    <button className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      2
                    </button>
                    <button className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      3
                    </button>
                    <button className="px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      Próximo
                    </button>
                  </div>
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