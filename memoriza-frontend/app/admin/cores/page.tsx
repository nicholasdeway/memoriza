"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  LayoutGrid,
  List,
  Info,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePermissions } from "@/lib/use-permissions"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"
const VIEW_MODE_KEY = "adminCoresViewMode"

type ViewMode = "list" | "grid"

type Color = {
  id: number
  name: string
  hexCode: string | null
  isActive: boolean
  createdAt: string
}

type CreateColorDto = {
  name: string
  hexCode: string | null
  isActive: boolean
}

type UpdateColorDto = {
  name: string
  hexCode: string | null
  isActive: boolean
}

export default function AdminCores() {
  const { token, isLoading: authLoading } = useAuth()
  const { canCreate, canEdit, canDelete } = usePermissions('colors')

  const [colors, setColors] = useState<Color[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "list"
    const saved = window.localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null
    return saved === "list" || saved === "grid" ? saved : "list"
  })

  const [showModal, setShowModal] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    codigoHex: "#000000",
    ativo: true,
  })

  // estado do AlertDialog de exclusão
  const [deleteColorDialog, setDeleteColorDialog] = useState<{
    open: boolean
    colorId: number | null
    colorName: string
    isActive: boolean
  }>({
    open: false,
    colorId: null,
    colorName: "",
    isActive: true,
  })

  // Estado do AlertDialog de conflito (cor vinculada a produtos)
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false)
  const [deleteConflictColor, setDeleteConflictColor] = useState<string | null>(
    null,
  )

  // Estados para seleção múltipla
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({
    open: false,
    count: 0,
  })

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_MODE_KEY, mode)
    }
  }

  const fetchColors = async () => {
    if (!token) return

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/colors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        toast.error("Erro ao carregar cores")
        return
      }

      const data: Color[] = await res.json()
      setColors(data)
    } catch (error) {
      console.error("Erro ao buscar cores:", error)
      toast.error("Erro ao conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    void fetchColors()
  }, [authLoading])

  // filtro de busca
  const filteredColors = colors.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ordenação (ativos primeiro, dentro grupo mais novos primeiro)
  const sortedColors = [...filteredColors].sort((a, b) => {
    if (a.isActive === b.isActive) {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    }
    return a.isActive ? -1 : 1
  })

  const openCreateModal = () => {
    setEditingColor(null)
    setFormData({
      nome: "",
      codigoHex: "#000000",
      ativo: true,
    })
    setShowModal(true)
  }

  const openEditModal = (color: Color) => {
    if (!canEdit) {
      toast.error("Você não tem permissão para editar cores")
      return
    }
    setEditingColor(color)
    setFormData({
      nome: color.name,
      codigoHex: color.hexCode || "#000000",
      ativo: color.isActive,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.")
      return
    }

    // Verifica permissões
    if (editingColor && !canEdit) {
      toast.error("Você não tem permissão para editar cores")
      return
    }
    if (!editingColor && !canCreate) {
      toast.error("Você não tem permissão para criar cores")
      return
    }

    if (!formData.nome.trim()) {
      toast.error("O nome da cor é obrigatório")
      return
    }

    try {
      if (editingColor) {
        // atualizar
        const dto: UpdateColorDto = {
          name: formData.nome,
          hexCode: formData.codigoHex || null,
          isActive: formData.ativo,
        }

        const res = await fetch(
          `${API_BASE_URL}/api/colors/${editingColor.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
          },
        )

        if (!res.ok) {
          let errorMessage = "Erro ao atualizar cor"
          try {
            const error = await res.json()
            errorMessage = error.message || errorMessage
          } catch {
            // ignore
          }
          toast.error(errorMessage)
          return
        }

        toast.success("Cor atualizada com sucesso!")
      } else {
        // criar
        const dto: CreateColorDto = {
          name: formData.nome,
          hexCode: formData.codigoHex || null,
          isActive: formData.ativo,
        }

        const res = await fetch(`${API_BASE_URL}/api/colors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dto),
        })

        if (!res.ok) {
          let errorMessage = "Erro ao criar cor"
          try {
            const error = await res.json()
            errorMessage = error.message || errorMessage
          } catch {
            // ignore
          }
          toast.error(errorMessage)
          return
        }

        toast.success("Cor criada com sucesso!")
      }

      setShowModal(false)
      void fetchColors()
    } catch (error) {
      console.error("Erro ao salvar cor:", error)
      toast.error("Erro ao conectar ao servidor")
    }
  }

  // abre o AlertDialog
  const handleDelete = (id: number) => {
    if (!canDelete) {
      toast.error("Você não tem permissão para excluir cores")
      return
    }
    const target = colors.find((c) => c.id === id)
    if (!target) return

    setDeleteColorDialog({
      open: true,
      colorId: id,
      colorName: target.name,
      isActive: target.isActive,
    })
  }

  // confirma exclusão / inativação
  const confirmDeleteColor = async () => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.")
      return
    }

    const { colorId, isActive } = deleteColorDialog
    if (colorId == null) return

    try {
      const res = await fetch(`${API_BASE_URL}/api/colors/${colorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        let errorMessage = ""
        try {
          const data = await res.json()
          const rawMessage =
            data?.message ??
            data?.title ??
            data?.detail ??
            data?.error ??
            ""
          errorMessage = String(rawMessage ?? "")
        } catch {
          // ignore
        }

        const normalizedMessage = errorMessage.toLowerCase()

        // heurística: considera "vinculado a produto" mesmo que venha 500
        const isLinkedToProduct =
          res.status === 400 ||
          res.status === 409 ||
          res.status === 500 ||
          normalizedMessage.includes("vinculad") ||
          normalizedMessage.includes("produto")

        if (isLinkedToProduct) {
          // Abre o alerta de conflito e NÃO mostra toast genérico ou console.error
          setDeleteConflictColor(deleteColorDialog.colorName)
          setDeleteConflictOpen(true)
        } else {
          // Erro real/inesperado
          console.error("Erro ao excluir cor:", errorMessage)
          toast.error(errorMessage || "Erro ao excluir cor")
        }

        setDeleteColorDialog({
          open: false,
          colorId: null,
          colorName: "",
          isActive: true,
          })
        return
      }

      if (isActive) {
        // 1º clique: apenas marcar como inativa
        setColors((prev) =>
          prev.map((c) =>
            c.id === colorId
              ? {
                  ...c,
                  isActive: false,
                }
              : c,
          ),
        )
        toast.success("Cor marcada como inativa!")
      } else {
        // 2º clique: remover da lista se backend permitiu delete definitivo
        setColors((prev) => prev.filter((c) => c.id !== colorId))
        toast.success("Cor excluída permanentemente!")
      }
    } catch (error) {
      console.error("Erro ao excluir cor:", error)
      toast.error("Erro ao conectar ao servidor")
    }

    setDeleteColorDialog({
      open: false,
      colorId: null,
      colorName: "",
      isActive: true,
      })
  }

  // Lógica de Seleção Múltipla

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedColors.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedColors.map((c) => c.id)))
    }
  }

  const confirmBulkDelete = async () => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.")
      return
    }

    if (!canDelete) {
      toast.error("Você não tem permissão para excluir cores")
      return
    }

    const idsToDelete = Array.from(selectedIds)
    setBulkDeleteDialog({ open: false, count: 0 })

    let successCount = 0
    let failCount = 0

    // Processar em paralelo
    const results = await Promise.allSettled(
      idsToDelete.map(async (id) => {
        const color = colors.find((c) => c.id === id)
        if (!color) return { success: false, id }

        const res = await fetch(`${API_BASE_URL}/api/colors/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Verificar se houve conflito
        if (!res.ok && res.status !== 204) {
          return { success: false, id }
        }

        return { success: true, id, wasActive: color.isActive }
      }),
    )

    // Atualizar estado local
    const newColors = [...colors]

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++
        const { id, wasActive } = result.value

        const index = newColors.findIndex((c) => c.id === id)
        if (index !== -1) {
          if (wasActive) {
            // Se estava ativa, vira inativa
            newColors[index] = { ...newColors[index], isActive: false }
          } else {
            // Se estava inativa, remove
            newColors.splice(index, 1)
          }
        }
      } else {
        failCount++
      }
    })

    setColors(newColors)
    setSelectedIds(new Set())

    if (successCount > 0) {
      toast.success(`${successCount} cores processadas com sucesso!`)
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} cores não puderam ser excluídas (possível conflito).`,
      )
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-foreground/60">Carregando cores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Cores</h1>
          <p className="text-foreground/60">Gerencie as cores dos produtos</p>
        </div>
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Novo Cor
          </button>
        )}
      </div>

      {/* Alerta de Instruções de Exclusão */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Como funciona a exclusão:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>
              <strong>1º clique na lixeira:</strong> A cor fica inativa.
            </li>
            <li>
              <strong>2º clique na lixeira:</strong> Se não houver vínculos com
              produtos, a cor é removida permanentemente. Se houver vínculos,
              permanece inativa.
            </li>
          </ul>
        </div>
      </div>

      {/* Filtros & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
          <button
            onClick={() => changeViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-background shadow-sm text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => changeViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-background shadow-sm text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && viewMode === "list" && (
        <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
              {selectedIds.size}
            </div>
            <span className="text-sm font-medium text-foreground">
              cores selecionadas
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                setBulkDeleteDialog({ open: true, count: selectedIds.size })
              }
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 size={16} />
              <span className="font-medium">Excluir selecionadas</span>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === "list" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="w-[50px] px-6 py-4">
                    {canDelete && (
                      <input
                        type="checkbox"
                        checked={
                          sortedColors.length > 0 &&
                          selectedIds.size === sortedColors.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Cor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Código Hex
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedColors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-foreground/60"
                    >
                      Nenhuma cor encontrada
                    </td>
                  </tr>
                ) : (
                  sortedColors.map((color) => (
                    <tr
                      key={color.id}
                      className={`hover:bg-muted/50 transition-colors ${
                        color.isActive ? "" : "opacity-70"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {canDelete && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(color.id)}
                            onChange={() => toggleSelect(color.id)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border border-border shadow-sm"
                            style={{
                              backgroundColor: color.hexCode || "#000000",
                            }}
                          />
                          <span className="font-medium text-foreground">
                            {color.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70 font-mono">
                        {color.hexCode || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            color.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {color.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(color.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(color)}
                              className="p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(color.id)}
                              className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedColors.length === 0 ? (
            <div className="col-span-full bg-card border border-border rounded-xl p-12 text-center">
              <p className="text-foreground/60">Nenhuma cor encontrada</p>
            </div>
          ) : (
            sortedColors.map((color) => (
              <div
                key={color.id}
                className={`group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                  color.isActive ? "" : "opacity-70"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-16 h-16 rounded-full border border-border shadow-sm"
                    style={{
                      backgroundColor: color.hexCode || "#000000",
                    }}
                  />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(color)}
                        className="p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(color.id)}
                        className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-foreground text-lg mb-1">
                  {color.name}
                </h3>
                <p className="text-sm text-foreground/60 font-mono mb-3">
                  {color.hexCode || "N/A"}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      color.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {color.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {new Date(color.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium text-foreground">
                {editingColor ? "Editar Cor" : "Nova Cor"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome da Cor
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ex: Azul Marinho"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Código Hex
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.codigoHex}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoHex: e.target.value })
                    }
                    className="h-10 w-14 p-1 border border-border rounded-lg bg-background cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.codigoHex}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoHex: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent uppercase"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    Ativo
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingColor ? "Salvar Alterações" : "Criar Cor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AlertDialog */}
      <AlertDialog
        open={deleteColorDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteColorDialog({
              open: false,
              colorId: null,
              colorName: "",
              isActive: true,
              })
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteColorDialog.isActive
                ? "Marcar cor como inativa?"
                : "Excluir cor permanentemente?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteColorDialog.isActive ? (
                <>
                  A cor ficará{" "}
                  <span className="font-semibold">inativa</span> e não poderá
                  ser usada em novos produtos.
                  <br />
                  <br />
                  {deleteColorDialog.colorName && (
                    <>
                      Cor:{" "}
                      <span className="font-semibold">
                        {deleteColorDialog.colorName}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  A cor será{" "}
                  <span className="font-semibold">
                    excluída permanentemente
                  </span>{" "}
                  caso não esteja vinculada a nenhum produto.
                  <br />
                  <br />
                  {deleteColorDialog.colorName && (
                    <>
                      Cor:{" "}
                      <span className="font-semibold">
                        {deleteColorDialog.colorName}
                      </span>
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteColor}
              className={
                deleteColorDialog.isActive
                  ? "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500"
                  : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              }
            >
              {deleteColorDialog.isActive
                ? "Sim, deixar inativa"
                : "Sim, excluir permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert */}
      <AlertDialog open={deleteConflictOpen} onOpenChange={setDeleteConflictOpen}>
        <AlertDialogContent className="overflow-hidden border-0 max-w-md">
          <div className="bg-white rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="w-5 h-5 text-red-500" />
                Cor não pode ser excluída
              </AlertDialogTitle>

              <AlertDialogDescription className="space-y-3 text-gray-600">
                {/* texto principal */}
                <span className="block">
                  Esta cor não pode ser excluída pois já está vinculada a{" "}
                  <strong>um ou mais produtos</strong>.
                </span>

                {/* cor em destaque */}
                {deleteConflictColor && (
                  <span className="block rounded-xl bg-gray-100 px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900">Cor:</span>{" "}
                    {deleteConflictColor}
                  </span>
                )}

                {/* aviso extra */}
                <span className="mt-1 flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Para manter a integridade dos produtos, cores associadas não
                    podem ser removidos. Elas permanecem como{" "}
                    <strong>inativos</strong>.
                  </span>
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 gap-3">
              <AlertDialogAction
                onClick={() => setDeleteConflictOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert – Bulk Delete */}
      <AlertDialog
        open={bulkDeleteDialog.open}
        onOpenChange={(open) =>
          setBulkDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir {bulkDeleteDialog.count} cores?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Você selecionou{" "}
                  <strong>{bulkDeleteDialog.count} cores</strong> para exclusão.
                </p>

                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Cores ativas serão marcadas como{" "}
                    <strong>inativas</strong>.
                  </li>
                  <li>
                    Cores inativas serão{" "}
                    <strong>excluídas permanentemente</strong>.
                  </li>
                  <li>
                    Cores com vínculos serão mantidas (apenas inativadas).
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Confirmar exclusão em lote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}