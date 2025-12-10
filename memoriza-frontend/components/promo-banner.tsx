"use client"

export function PromoBanner() {
  const message =
    "🚛 Frete grátis para compras acima de R$ 200,00"

  // Quantas vezes o texto se repete em cada faixa
  const repeatCount = 6

  return (
    <div className="bg-white text-black py-2 overflow-hidden">
      <div className="w-full">
        <div className="banner-track whitespace-nowrap">
          {/* Primeira faixa */}
          {Array.from({ length: repeatCount }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-light tracking-wide px-8 inline-block"
            >
              {message}
            </span>
          ))}

          {/* Segunda faixa idêntica (pra fazer o loop perfeito) */}
          {Array.from({ length: repeatCount }).map((_, i) => (
            <span
              key={`dup-${i}`}
              className="text-sm font-light tracking-wide px-8 inline-block"
              aria-hidden="true"
            >
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}