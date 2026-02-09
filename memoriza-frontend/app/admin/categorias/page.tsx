"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  X,
  FolderTree,
  Search,
  LayoutGrid,
  List,
  Info,
  XCircle,
  AlertTriangle,
} from "lucide-react"
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
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { usePermissions } from "@/lib/use-permissions"

const API_BASE_URL = "/api-proxy"

type ViewMode = "list" | "grid"
const VIEW_MODE_KEY = "adminCategoriasViewMode"

// Tipos da API (CategoryResponseDto)
interface CategoryApi {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

interface ProductApi {
  id: string
  categoryId: string
}

// Modelo usado na tela
interface Category {
  id: string
  nome: string
  slug: string
  descricao: string
  ativo: boolean
  produtosCount: number
  createdAt: string
}

// Gera slug a partir do nome (apenas visual)
const generateSlug = (nome: string) => {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function AdminCategorias() {
  const { user } = useAuth()
  const { canCreate, canEdit, canDelete } = usePermissions('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "list"
    const saved = window.localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null
    return saved === "list" || saved === "grid" ? saved : "list"
  })

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_MODE_KEY, mode)
    }
  }

  // Estado do AlertDialog de exclusão
  const [deleteCategoryDialog, setDeleteCategoryDialog] = useState<{
    open: boolean
    categoryId: string | null
    categoryName: string
    isActive: boolean
  }>({
    open: false,
    categoryId: null,
    categoryName: "",
    isActive: true,
  })

  // Estado do AlertDialog de conflito (categoria vinculada a produtos)
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false)
  const [deleteConflictCategory, setDeleteConflictCategory] =
    useState<string | null>(null)

  // Estados para seleção múltipla
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({
    open: false,
    count: 0,
  })



  const mapApiToCategory = (c: CategoryApi): Category => ({
    id: c.id,
    nome: c.name,
    slug: generateSlug(c.name),
    descricao: c.description ?? "",
    ativo: c.isActive,
    produtosCount: 0,
    createdAt: c.createdAt,
  })

  const fetchCategoriesList = async () => {
    try {
      setLoading(true)

      const catRes = await fetch(`${API_BASE_URL}/api/categories`, {
        credentials: "include",
      })

      if (!catRes.ok) {
        const text = await catRes.text()
        console.error("Erro ao buscar categorias:", text)
        toast.error("Erro ao carregar categorias.")
        return
      }

      const categoriesData: CategoryApi[] = await catRes.json()

      setCategories(categoriesData.map((c) => mapApiToCategory(c)))

      // Dispara busca de contagem em background
      void fetchProductCounts(categoriesData)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
      toast.error("Erro ao conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }

  const fetchProductCounts = async (currentCategories: CategoryApi[]) => {
    try {
      const prodRes = await fetch(`${API_BASE_URL}/api/admin/products`, {
        credentials: "include",
        cache: "no-store",
      })

      if (prodRes.ok) {
        const productsData: ProductApi[] = await prodRes.json()
        const productCounts: Record<string, number> = {}

        productsData.forEach((p) => {
          productCounts[p.categoryId] = (productCounts[p.categoryId] || 0) + 1
        })

        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            produtosCount: productCounts[c.id] || 0,
          })),
        )
      }
    } catch (err) {
      console.error("Erro ao buscar contagem de produtos:", err)
    }
  }

  useEffect(() => {
    // Carrega apenas se tiver permissão (admin/funcionario)
    if (user) {
      void fetchCategoriesList()
    }
  }, [user])

  // Filtro
  const filteredCategories = categories.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ordenação: ativos primeiro, inativos no final
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (a.ativo !== b.ativo) {
      return a.ativo ? -1 : 1
    }

    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ nome: "", descricao: "", ativo: true })
    setShowModal(true)
  }

  const openEditModal = (category: Category) => {
    if (!canEdit) {
      toast.error("Você não tem permissão para editar categorias")
      return
    }
    setEditingCategory(category)
    setFormData({
      nome: category.nome,
      descricao: category.descricao,
      ativo: category.ativo,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    // Verifica permissões
    if (editingCategory && !canEdit) {
      toast.error("Você não tem permissão para editar categorias")
      return
    }
    if (!editingCategory && !canCreate) {
      toast.error("Você não tem permissão para criar categorias")
      return
    }

    if (!formData.nome.trim()) {
      toast.error("Informe o nome da categoria.")
      return
    }

    setSaving(true)

    const payloadCreate = {
      name: formData.nome,
      description: formData.descricao || null,
    }

    const payloadUpdate = {
      name: formData.nome,
      description: formData.descricao || null,
      isActive: formData.ativo,
    }

    try {
      if (editingCategory) {
        const res = await fetch(
          `${API_BASE_URL}/api/categories/${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payloadUpdate),
          },
        )

        if (!res.ok) {
          console.error("Erro ao atualizar categoria:", await res.text())
          toast.error("Não foi possível atualizar a categoria.")
          return
        }

        toast.success("Categoria atualizada com sucesso!")
      } else {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payloadCreate),
        })

        if (!res.ok) {
          console.error("Erro ao criar categoria:", await res.text())
          toast.error("Não foi possível criar a categoria.")
          return
        }

        toast.success("Categoria criada com sucesso!")
      }

      await fetchCategoriesList()
      setShowModal(false)
    } catch (err) {
      console.error("Erro ao salvar categoria:", err)
      toast.error("Ocorreu um erro ao salvar a categoria.")
    } finally {
      setSaving(false)
    }
  }

  // Abre diálogo de exclusão (2 cliques: inativar → excluir)
  const handleDelete = (id: string) => {
    if (!canDelete) {
      toast.error("Você não tem permissão para excluir categorias")
      return
    }
    const category = categories.find((c) => c.id === id)
    if (!category) return

    setDeleteCategoryDialog({
      open: true,
      categoryId: id,
      categoryName: category.nome,
      isActive: category.ativo,
    })
  }

  // Confirma exclusão/inativação
  const confirmDeleteCategory = async () => {
    const { categoryId, isActive } = deleteCategoryDialog
    if (!categoryId) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      )

      if (!res.ok && res.status !== 204) {
        let errorMessage = ""

        try {
          const data = await res.json()
          const rawMessage =
            data?.message ?? data?.title ?? data?.detail ?? data?.error ?? ""
          errorMessage = String(rawMessage ?? "")
        } catch {
          try {
            const text = await res.text()
            if (text) errorMessage = text
          } catch {
            // ignore
          }
        }

        const normalizedMessage = errorMessage.toLowerCase()

        const isLinkedToProduct =
          res.status === 400 ||
          res.status === 409 ||
          res.status === 500 ||
          normalizedMessage.includes("vinculad") ||
          normalizedMessage.includes("produto")

        if (isLinkedToProduct) {
          setDeleteConflictCategory(deleteCategoryDialog.categoryName)
          setDeleteConflictOpen(true)
        } else {
          console.error("Erro ao excluir categoria:", errorMessage)
          toast.error(errorMessage || "Erro ao excluir categoria")
        }

        setDeleteCategoryDialog({
          open: false,
          categoryId: null,
          categoryName: "",
          isActive: true,
        })
        return
      }

      if (isActive) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  ativo: false,
                }
              : c,
          ),
        )
        toast.success("Categoria marcada como inativa!")
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId))
        toast.success(
          "Categoria excluída permanentemente (se não tinha vínculos).",
        )
      }
    } catch (err) {
      console.error("Erro ao excluir categoria:", err)
      toast.error("Ocorreu um erro ao excluir a categoria.")
    }

    setDeleteCategoryDialog({
      open: false,
      categoryId: null,
      categoryName: "",
      isActive: true,
    })
  }

  // Lógica de Seleção Múltipla

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedCategories.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedCategories.map((c) => c.id)))
    }
  }

  const confirmBulkDelete = async () => {
    if (!canDelete) {
      toast.error("Você não tem permissão para excluir categorias")
      return
    }
    const idsToDelete = Array.from(selectedIds)
    setBulkDeleteDialog({ open: false, count: 0 })

    let successCount = 0
    let failCount = 0

    const results = await Promise.allSettled(
      idsToDelete.map(async (id) => {
        const category = categories.find((c) => c.id === id)
        if (!category) return { success: false, id }

        const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
        })

        if (!res.ok && res.status !== 204) {
          return { success: false, id }
        }

        return { success: true, id, wasActive: category.ativo }
      }),
    )

    const newCategories = [...categories]

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++
        const { id, wasActive } = result.value

        const index = newCategories.findIndex((c) => c.id === id)
        if (index !== -1) {
          if (wasActive) {
            newCategories[index] = { ...newCategories[index], ativo: false }
          } else {
            newCategories.splice(index, 1)
          }
        }
      } else {
        failCount++
      }
    })

    setCategories(newCategories)
    setSelectedIds(new Set())

    if (successCount > 0) {
      toast.success(`${successCount} categorias processadas com sucesso!`)
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} categorias não puderam ser excluídas (possível conflito).`,
      )
    }
  }

  const toggleStatus = async (id: string) => {
    if (!canEdit) {
      toast.error("Você não tem permissão para alterar status")
      return
    }
    const category = categories.find((c) => c.id === id)
    if (!category) return

    const payloadUpdate = {
      name: category.nome,
      description: category.descricao || null,
      isActive: !category.ativo,
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payloadUpdate),
      })

      if (!res.ok) {
        console.error("Erro ao alterar status:", await res.text())
        toast.error("Não foi possível alterar o status da categoria.")
        return
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c)),
      )
      toast.success("Status da categoria atualizado!")
    } catch (err) {
      console.error("Erro ao alterar status:", err)
      toast.error("Ocorreu um erro ao alterar o status da categoria.")
    }
  }

  const slugPreview = generateSlug(formData.nome || "categoria")

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Categorias</h1>
          <p className="text-foreground/60">
            Organize seus produtos em categorias
          </p>
        </div>
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nova Categoria
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
              <strong>1º clique na lixeira:</strong> A categoria fica inativa.
            </li>
            <li>
              <strong>2º clique na lixeira:</strong> Se não houver vínculos com
              produtos, a categoria é removida permanentemente. Se houver
              vínculos, permanece inativa.
            </li>
          </ul>
        </div>
      </div>

      {/* Filtros & Toggle de visualização */}
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
              categorias selecionadas
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

      {/* Conteúdo */}
      {loading ? (
        <div className="py-12 text-center text-foreground/60">
          Carregando categorias...
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category) => {
            const isInactive = !category.ativo

            return (
              <div
                key={category.id}
                className={`bg-card border rounded-xl p-6 transition-all ${
                  isInactive ? "border-border/50 opacity-70" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-muted ${
                      isInactive ? "opacity-70" : ""
                    }`}
                  >
                    <FolderTree
                      size={24}
                      className={
                        isInactive ? "text-foreground/40" : "text-accent"
                      }
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(category)}
                        className={`p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors ${
                          isInactive ? "opacity-60" : ""
                        }`}
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(category.id)}
                        className={`p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                          isInactive ? "opacity-60" : ""
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <h3
                  className={`font-medium mb-1 ${
                    isInactive ? "text-foreground/70" : "text-foreground"
                  }`}
                >
                  {category.nome}
                </h3>
                <p
                  className={`text-sm mb-2 ${
                    isInactive ? "text-foreground/50" : "text-foreground/60"
                  }`}
                >
                  /{category.slug}
                </p>
                {category.descricao && (
                  <p
                    className={`text-sm mb-4 line-clamp-2 ${
                      isInactive ? "text-foreground/60" : "text-foreground/70"
                    }`}
                  >
                    {category.descricao}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isInactive ? "text-foreground/60" : "text-foreground/60"
                    }`}
                  >
                    {category.produtosCount} produtos
                  </span>
                  <button
                    onClick={() => toggleStatus(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.ativo
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {category.ativo ? "Ativo" : "Inativo"}
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <span className="text-xs text-foreground/40">
                    Criado em{" "}
                    {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
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
                          sortedCategories.length > 0 &&
                          selectedIds.size === sortedCategories.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Produtos
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
                {sortedCategories.map((category) => {
                  const isInactive = !category.ativo

                  return (
                    <tr
                      key={category.id}
                      className={`transition-colors ${
                        isInactive
                          ? "bg-muted/50 opacity-70"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {canDelete && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(category.id)}
                            onChange={() => toggleSelect(category.id)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-muted ${
                              isInactive ? "opacity-70" : ""
                            }`}
                          >
                            <FolderTree
                              size={16}
                              className={
                                isInactive
                                  ? "text-foreground/40"
                                  : "text-accent"
                              }
                            />
                          </div>
                          <span
                            className={`font-medium ${
                              isInactive
                                ? "text-foreground/70"
                                : "text-foreground"
                            }`}
                          >
                            {category.nome}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isInactive
                            ? "text-foreground/60"
                            : "text-foreground/70"
                        }`}
                      >
                        /{category.slug}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          isInactive
                            ? "text-foreground/60"
                            : "text-foreground/70"
                        }`}
                      >
                        {category.produtosCount}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(category.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            category.ativo
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {category.ativo ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(category.createdAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(category)}
                              className="p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {sortedCategories.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-foreground/60"
                    >
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium text-foreground">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
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
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ex: Papelaria Personalizada"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Slug gerado:{" "}
                  <span className="font-mono">/{slugPreview}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px]"
                  placeholder="Descrição breve da categoria..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="accent-accent"
                />
                <label htmlFor="ativo" className="text-sm text-foreground">
                  Categoria ativa
                </label>
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
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Salvando..."
                  : editingCategory
                  ? "Salvar"
                  : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AlertDialog de exclusão */}
      <AlertDialog
        open={deleteCategoryDialog.open}
        onOpenChange={(open) =>
          setDeleteCategoryDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteCategoryDialog.isActive
                ? "Marcar categoria como inativa?"
                : "Excluir categoria definitivamente?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCategoryDialog.isActive
                ? "Ao confirmar, a categoria será marcada como inativa. Ela não poderá mais ser usada em novos produtos, mas continuará vinculada aos registros existentes."
                : "Ao confirmar, tentaremos excluir a categoria. Se houver vínculos com produtos, ela permanecerá apenas como inativa."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold">Categoria: </span>
            <span>{deleteCategoryDialog.categoryName}</span>
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void confirmDeleteCategory()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert – Categoria Vinculada a Produtos */}
      <AlertDialog
        open={deleteConflictOpen}
        onOpenChange={setDeleteConflictOpen}
      >
        <AlertDialogContent className="overflow-hidden border-0 max-w-md">
          <div className="bg-white rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="w-5 h-5 text-red-500" />
                Categoria não pode ser excluída
              </AlertDialogTitle>

              <AlertDialogDescription className="space-y-3 text-gray-600">
                <span className="block">
                  Esta categoria não pode ser excluída pois já está vinculada a{" "}
                  <strong>um ou mais produtos</strong>.
                </span>

                {deleteConflictCategory && (
                  <span className="block rounded-xl bg-gray-100 px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900">
                      Categoria:
                    </span>{" "}
                    {deleteConflictCategory}
                  </span>
                )}

                <span className="mt-1 flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Para manter a integridade dos produtos, categorias
                    associadas não podem ser removidas. Elas permanecem como{" "}
                    <strong>inativas</strong>.
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
              Excluir {bulkDeleteDialog.count} categorias?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você selecionou <strong>{bulkDeleteDialog.count} categorias</strong>{" "}
              para exclusão. Confira as regras abaixo:
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* A LISTA FICA FORA DO AlertDialogDescription PARA EVITAR <p> DENTRO DE <ul> */}
          <div className="mt-3">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                Categorias ativas serão marcadas como{" "}
                <strong>inativas</strong>.
              </li>
              <li>
                Categorias inativas serão{" "}
                <strong>excluídas permanentemente</strong>.
              </li>
              <li>
                Categorias com vínculos serão mantidas (apenas inativadas).
              </li>
            </ul>
          </div>

          <AlertDialogFooter className="mt-4">
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