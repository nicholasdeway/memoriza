"use client";

import { Filter } from "lucide-react";

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

interface ProductFiltersProps {
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  loadingFilters: boolean;
  selectedCategoryId: string;
  selectedPrice: string;
  selectedSizeIds: number[];
  selectedColorIds: number[];
  sizeCounts: Record<number, number>;
  colorCounts: Record<number, number>;
  showAllSizes: boolean;
  showAllColors: boolean;
  priceRanges: string[];
  
  onCategoryChange: (id: string) => void;
  onPriceChange: (range: string) => void;
  onToggleSize: (id: number) => void;
  onToggleColor: (id: number) => void;
  onToggleShowAllSizes: (show: boolean) => void;
  onToggleShowAllColors: (show: boolean) => void;
  onResetFilters: () => void;
}

export function ProductFilters({
  categories,
  sizes,
  colors,
  loadingFilters,
  selectedCategoryId,
  selectedPrice,
  selectedSizeIds,
  selectedColorIds,
  sizeCounts,
  colorCounts,
  showAllSizes,
  showAllColors,
  priceRanges,
  onCategoryChange,
  onPriceChange,
  onToggleSize,
  onToggleColor,
  onToggleShowAllSizes,
  onToggleShowAllColors,
  onResetFilters,
}: ProductFiltersProps) {
  const visibleSizes = showAllSizes ? sizes : sizes.slice(0, 7);
  const visibleColors = showAllColors ? colors : colors.slice(0, 7);

  const categoryOptions = [
    { id: "Todos", label: "Todos" },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];

  return (
    <div className="space-y-6">
      <div className="hidden lg:flex items-center space-x-2">
        <Filter size={20} className="text-foreground" />
        <h3 className="font-medium text-foreground">Filtros</h3>
      </div>

      {/* Categoria (API) */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-foreground mb-3 text-sm">Categoria</h4>

        {loadingFilters && categories.length === 0 ? (
          <p className="text-xs text-foreground/60">Carregando categorias...</p>
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
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="rounded-sm"
                />
                <span className="text-sm text-foreground/70">{cat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-foreground mb-3 text-sm">Preço</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="price"
                value={range}
                checked={selectedPrice === range}
                onChange={(e) => onPriceChange(e.target.value)}
                className="rounded-sm"
              />
              <span className="text-sm text-foreground/70">{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tamanho */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-foreground mb-3 text-sm">Tamanho</h4>

        {loadingFilters && sizes.length === 0 ? (
          <p className="text-xs text-foreground/60">Carregando tamanhos...</p>
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
                  onChange={() => onToggleSize(size.id)}
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

        {sizes.length > 7 && !showAllSizes && (
          <button
            type="button"
            onClick={() => onToggleShowAllSizes(true)}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-background hover:bg-primary/5 transition-colors"
          >
            Ver todos
          </button>
        )}

        {showAllSizes && sizes.length > 7 && (
          <button
            type="button"
            onClick={() => onToggleShowAllSizes(false)}
            className="mt-2 ml-1 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-border text-foreground/70 bg-background hover:bg-muted transition-colors"
          >
            Ver menos
          </button>
        )}
      </div>

      {/* Cor */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium text-foreground mb-3 text-sm">Cor</h4>

        {loadingFilters && colors.length === 0 ? (
          <p className="text-xs text-foreground/60">Carregando cores...</p>
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
                  onChange={() => onToggleColor(color.id)}
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

        {colors.length > 7 && !showAllColors && (
          <button
            type="button"
            onClick={() => onToggleShowAllColors(true)}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-background hover:bg-primary/5 transition-colors"
          >
            Ver todos
          </button>
        )}

        {showAllColors && colors.length > 7 && (
          <button
            type="button"
            onClick={() => onToggleShowAllColors(false)}
            className="mt-2 ml-1 inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-border text-foreground/70 bg-background hover:bg-muted transition-colors"
          >
            Ver menos
          </button>
        )}
      </div>

      {/* Resetar */}
      <button
        onClick={onResetFilters}
        className="w-full py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
