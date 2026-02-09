"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Truck, Save, Loader2 } from "lucide-react"
import { formatCurrencyBRL, parseCurrencyBRL, formatNumberBRL } from "@/lib/currency-utils"

const API_BASE_URL = "/api-proxy"

interface ShippingRegion {
  id: string
  code: string
  name: string
  price: number
  estimatedDays: number
  freeShippingThreshold: number
  isActive: boolean
}

export default function FreteAdminPage() {
  const [regions, setRegions] = useState<ShippingRegion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [formattedValues, setFormattedValues] = useState<Record<string, {
    price: string
    freeShippingThreshold: string
  }>>({})

  // Carregar regiões ao montar
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/shipping/regions`, {
          credentials: "include",
        })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Erro ao carregar regiões: ${res.status} - ${errorText}`)
        }

        const data = await res.json()
        setRegions(data)
        
        // Inicializar valores formatados
        const formatted: Record<string, { price: string; freeShippingThreshold: string }> = {}
        data.forEach((region: ShippingRegion) => {
          formatted[region.id] = {
            price: formatCurrencyBRL(Math.round(region.price * 100).toString()),
            freeShippingThreshold: formatCurrencyBRL(Math.round(region.freeShippingThreshold * 100).toString()),
          }
        })
        setFormattedValues(formatted)
      } catch (error) {
        console.error("❌ Erro ao carregar regiões:", error)
        toast.error("Erro ao carregar configurações de frete")
      } finally {
        setLoading(false)
      }
    }

    void loadRegions()
  }, [])

  const handleSave = async (region: ShippingRegion) => {
    try {
      setSaving(region.id)

      const res = await fetch(`${API_BASE_URL}/api/admin/shipping/regions/${region.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: region.price,
          estimatedDays: region.estimatedDays,
          freeShippingThreshold: region.freeShippingThreshold,
        }),
        credentials: "include",
      })

      if (!res.ok) throw new Error("Erro ao salvar")

      const updated = await res.json()
      setRegions((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      )
      
      // Atualizar valores formatados
      setFormattedValues(prev => ({
        ...prev,
        [updated.id]: {
          price: formatCurrencyBRL(Math.round(updated.price * 100).toString()),
          freeShippingThreshold: formatCurrencyBRL(Math.round(updated.freeShippingThreshold * 100).toString()),
        }
      }))

      toast.success(`Região ${region.name} atualizada com sucesso!`)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(null)
    }
  }

  const updateRegion = (id: string, field: keyof ShippingRegion, value: number) => {
    setRegions((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          // Arredondar para 2 casas decimais para evitar problemas de precisão
          const roundedValue = Math.round(value * 100) / 100
          return { ...r, [field]: roundedValue }
        }
        return r
      })
    )
  }

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Configurações de Frete</h1>
          </div>
          <p className="text-muted-foreground">
            Configure o valor do frete, prazo de entrega e frete grátis para cada região do Brasil
          </p>
        </div>

        {/* Regiões */}
        <div className="grid gap-6">
          {regions.map((region) => (
            <div
              key={region.id}
              className="bg-card border border-border rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{region.name}</h2>
                <span className="text-sm text-muted-foreground">
                  Código: {region.code}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Valor do Frete (R$)
                  </label>
                  <input
                    type="text"
                    value={formattedValues[region.id]?.price || ""}
                    onChange={(e) => {
                      const formatted = formatCurrencyBRL(e.target.value)
                      
                      // Atualizar valor formatado
                      setFormattedValues(prev => ({
                        ...prev,
                        [region.id]: {
                          ...prev[region.id],
                          price: formatted,
                        }
                      }))
                      
                      // Atualizar valor numérico no estado
                      const numValue = parseFloat(parseCurrencyBRL(formatted))
                      if (!isNaN(numValue)) {
                        updateRegion(region.id, "price", numValue)
                      }
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="0,00"
                  />
                </div>

                {/* Prazo */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prazo (dias úteis)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={region.estimatedDays}
                    onChange={(e) =>
                      updateRegion(region.id, "estimatedDays", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>

                {/* Frete Grátis */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frete Grátis acima de (R$)
                  </label>
                  <input
                    type="text"
                    value={formattedValues[region.id]?.freeShippingThreshold || ""}
                    onChange={(e) => {
                      const formatted = formatCurrencyBRL(e.target.value)
                      
                      // Atualizar valor formatado
                      setFormattedValues(prev => ({
                        ...prev,
                        [region.id]: {
                          ...prev[region.id],
                          freeShippingThreshold: formatted,
                        }
                      }))
                      
                      // Atualizar valor numérico no estado
                      const numValue = parseFloat(parseCurrencyBRL(formatted))
                      if (!isNaN(numValue)) {
                        updateRegion(region.id, "freeShippingThreshold", numValue)
                      }
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="0,00 (0 = sem frete grátis)"
                  />
                </div>
              </div>

              {/* Info e Botão */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {region.freeShippingThreshold > 0
                    ? `Frete grátis para compras acima de R$ ${formatNumberBRL(region.freeShippingThreshold)}`
                    : "Frete grátis desabilitado"}
                </p>
                <button
                  onClick={() => handleSave(region)}
                  disabled={saving === region.id}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving === region.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informações */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold mb-2">ℹ️ Informações</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• O frete é calculado automaticamente baseado no CEP do cliente</li>
            <li>• Configure "0" no campo de frete grátis para desabilitar</li>
            <li>• As alterações são aplicadas imediatamente após salvar</li>
            <li>• Cada região possui seu próprio threshold de frete grátis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
