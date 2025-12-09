"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { type CarouselItem } from "@/types/carousel"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

// --- Templates ---

const DefaultTemplate = ({ item }: { item: CarouselItem }) => (
  <div className="w-full bg-muted/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-8 py-12 md:py-16">
        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4 text-balance">
            {item.title}
          </h2>
          <p className="text-lg text-foreground/70 mb-6 max-w-lg">
            {item.subtitle}
          </p>
          {item.ctaText && (
            <Link
              href={item.ctaLink || "#"}
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {item.ctaText}
            </Link>
          )}
        </div>
        {/* Image */}
        <div className="flex-1 w-full max-w-xl">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)

const FullImageTemplate = ({ item }: { item: CarouselItem }) => (
  // Mobile mais baixo, desktop igual antes (400 / 500)
  <div className="w-full h-[200px] sm:h-[240px] md:h-[400px] lg:h-[500px] relative">
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
        Sem imagem
      </div>
    )}

    {item.ctaLink && (
      <Link href={item.ctaLink} className="absolute inset-0 z-10">
        <span className="sr-only">{item.title}</span>
      </Link>
    )}
  </div>
)

const OverlayTemplate = ({ item }: { item: CarouselItem }) => (
  // Mesmo esquema de altura: baixo no mobile, igual antes no desktop
  <div className="w-full h-[200px] sm:h-[240px] md:h-[400px] lg:h-[500px] relative overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      <div className="absolute inset-0 bg-black/40" />
    </div>

    {/* Content */}
    <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
          {item.title}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-sm">
          {item.subtitle}
        </p>
        {item.ctaText && (
          <Link
            href={item.ctaLink || "#"}
            className="inline-block px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors shadow-lg"
          >
            {item.ctaText}
          </Link>
        )}
      </div>
    </div>
  </div>
)

const MinimalTemplate = ({ item }: { item: CarouselItem }) => (
  <div className="w-full bg-background py-16">
    <div className="max-w-4xl mx-auto px-4 text-center">
      {item.imageUrl && (
        <div className="mb-8 flex justify-center">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-48 md:h-64 object-contain"
          />
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-3">
        {item.title}
      </h2>
      <p className="text-muted-foreground mb-6">{item.subtitle}</p>
      {item.ctaText && (
        <Link
          href={item.ctaLink || "#"}
          className="text-primary hover:underline font-medium"
        >
          {item.ctaText} &rarr;
        </Link>
      )}
    </div>
  </div>
)

// --- Main Component ---

export function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselItem[]>([])
  const [current, setCurrent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/carousel-items/active`)
        if (!res.ok) throw new Error("Falha ao carregar banners")
        const data = await res.json()
        setSlides(data)
      } catch (error) {
        console.error("Erro ao carregar carrossel:", error)
        setSlides([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goTo = (index: number) => setCurrent(index)
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const next = () => setCurrent((prev) => (prev + 1) % slides.length)

  if (isLoading) {
    // Altura responsiva: baixa no mobile, igual antiga no desktop
    return (
      <div className="w-full h-[200px] sm:h-[240px] md:h-96 lg:h-[500px] bg-muted animate-pulse flex items-center justify-center">
        <span className="sr-only">Carregando...</span>
      </div>
    )
  }

  if (slides.length === 0) {
    return null
  }

  const renderTemplate = (item: CarouselItem) => {
    switch (item.templateType) {
      case "full_image":
        return <FullImageTemplate item={item} />
      case "overlay":
        return <OverlayTemplate item={item} />
      case "minimal":
        return <MinimalTemplate item={item} />
      case "default":
      default:
        return <DefaultTemplate item={item} />
    }
  }

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            {renderTemplate(slide)}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100 duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                idx === current
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}