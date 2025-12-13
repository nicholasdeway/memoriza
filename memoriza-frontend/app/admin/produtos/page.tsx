"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  Eye,
  ChevronDown,
  LayoutGrid,
  List,
  GripVertical,
  Info,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePermissions } from "@/lib/use-permissions"
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd"
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
import { AdminPagination } from "@/components/admin-pagination"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

type ViewMode = "list" | "grid"
const VIEW_MODE_KEY = "adminProdutosViewMode"

// ===== Tipos auxiliares (vindo do backend) =====

type Status = "ativo" | "inativo"

interface CategoryOption {
  id: string
  nome: string
  ativo: boolean
}

interface SizeOption {
  id: number
  nome: string
  ativo: boolean
}

interface ColorOption {
  id: number
  nome: string
  codigoHex: string
  ativo: boolean
}

interface ProductImageDto {
  id: string
  productId: string
  url: string
  altText?: string | null
  isPrimary: boolean
  displayOrder: number
  createdAt: string
}

interface ProductSizeDto {
  sizeId: number
  sizeName: string
  price: number | null
  promotionalPrice: number | null
}

interface ProductResponseDto {
  id: string
  categoryId: string
  name: string
  description?: string | null
  price: number
  promotionalPrice?: number | null
  sizeIds: number[]
  colorIds: number[]
  sizes: ProductSizeDto[]
  isPersonalizable: boolean
  isActive: boolean
  createdAt: string
  images: ProductImageDto[]
}

// Modelo usado internamente no front (nomes PT-BR)
interface Product {
  id: string
  nome: string
  preco: number
  precoPromocional: number | null
  categoriaId: string
  tamanhos: number[]
  cores: number[]
  status: Status
  personalizavel: boolean
  descricao: string
  imagens: ProductImageDto[]
  createdAt: string
}

interface ModalImage {
  id: string
  url: string
  file?: File
  isNew: boolean
}

// ===== Helpers de formatação de moeda BRL =====
const formatCurrencyBRL = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "")

  if (!numbers) return ""

  // Converte para número e divide por 100 para ter os centavos
  const amount = parseFloat(numbers) / 100

  // Formata no padrão brasileiro
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const parseCurrencyBRL = (formatted: string): string => {
  // Remove tudo que não é número
  const numbers = formatted.replace(/\D/g, "")

  if (!numbers) return ""

  // Converte para número e divide por 100
  const amount = parseFloat(numbers) / 100

  // Retorna como string com ponto decimal para o backend
  return amount.toFixed(2)
}

export default function AdminProdutos() {
  const { token, isLoading: authLoading } = useAuth()
  const { canCreate, canEdit, canDelete } = usePermissions('products')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [sizes, setSizes] = useState<SizeOption[]>([])
  const [colors, setColors] = useState<ColorOption[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("")

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

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    precoPromocional: "",
    categoriaId: "",
    tamanhos: [] as number[],
    cores: [] as number[],
    descricao: "",
    status: "ativo" as Status,
    personalizavel: false,
    sizePrices: {} as Record<number, { price: string; promotionalPrice: string }>,
  })

  const [modalImages, setModalImages] = useState<ModalImage[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Estados para controlar AlertDialogs
  const [deleteImageDialog, setDeleteImageDialog] = useState<{
    open: boolean
    index: number | null
  }>({ open: false, index: null })

  const [deleteProductDialog, setDeleteProductDialog] = useState<{
    open: boolean
    productId: string | null
    productName: string
    isActive: boolean
  }>({ open: false, productId: null, productName: "", isActive: true })

  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false)
  const [deleteConflictProduct, setDeleteConflictProduct] = useState<string | null>(null)

  // Estados para seleção múltipla
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState({
    open: false,
    count: 0,
  })

  // ===== Helper de headers SEM undefined =====
  const buildAuthHeaders = (
    extra?: Record<string, string>,
  ): Record<string, string> => {
    const headers: Record<string, string> = { ...(extra ?? {}) }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  // ===== Carregar dados iniciais =====
  const fetchMetadata = async () => {
    try {
      const [catRes, sizeRes, colorRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`, {
          headers: buildAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/sizes`, {
          headers: buildAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/colors`, {
          headers: buildAuthHeaders(),
        }),
      ])

      if (!catRes.ok || !sizeRes.ok || !colorRes.ok) {
        console.error("Erro ao buscar metadados (categorias/tamanhos/cores).")
        return
      }

      const catJson = await catRes.json()
      const sizeJson = await sizeRes.json()
      const colorJson = await colorRes.json()

      const mappedCategories: CategoryOption[] = (catJson ?? []).map(
        (c: any) => ({
          id: c.id,
          nome: c.name as string,
          ativo: Boolean(c.isActive),
        }),
      )

      const mappedSizes: SizeOption[] = (sizeJson ?? []).map((s: any) => ({
        id: s.id as number,
        nome: s.name as string,
        ativo: Boolean(s.isActive),
      }))

      const mappedColors: ColorOption[] = (colorJson ?? []).map((c: any) => ({
        id: c.id as number,
        nome: c.name as string,
        codigoHex: c.hexCode as string,
        ativo: Boolean(c.isActive),
      }))

      setCategories(mappedCategories)
      setSizes(mappedSizes)
      setColors(mappedColors)
    } catch (error) {
      console.error("Erro ao carregar metadados:", error)
    }
  }

  const fetchProducts = async () => {
    setIsProductsLoading(true)
    try {
      const prodRes = await fetch(`${API_BASE_URL}/api/products`, {
        headers: buildAuthHeaders(),
        cache: "no-store",
      })

      if (!prodRes.ok) {
        console.error("Erro ao buscar produtos.")
        return
      }

      const prodJson: ProductResponseDto[] = await prodRes.json()

      const mappedProducts: Product[] = (prodJson ?? []).map((p) => ({
        id: p.id,
        nome: p.name,
        preco: p.price,
        precoPromocional: p.promotionalPrice ?? null,
        categoriaId: p.categoryId,
        tamanhos: p.sizeIds ?? [],
        cores: p.colorIds ?? [],
        status: p.isActive ? "ativo" : "inativo",
        personalizavel: p.isPersonalizable,
        descricao: p.description ?? "",
        imagens: (p.images ?? [])
          .slice()
          .sort((a, b) => {
            if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1
            return a.displayOrder - b.displayOrder
          }),
        createdAt: p.createdAt,
      }))

      setProducts(mappedProducts)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setIsProductsLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return

    // Dispara em paralelo, mas não espera um bloquear o outro
    void fetchMetadata()
    void fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading])

  /* Paginação */
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // ===== Filtros (memoizados) =====
  const filteredProducts = useMemo(
    () => {
      const filtered = products.filter((p) => {
        const matchSearch = p.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchCategoria =
          !filterCategoria || p.categoriaId === filterCategoria
        return matchSearch && matchCategoria
      })
      // Reset page on filter change
      setCurrentPage(1)
      return filtered
    },
    [products, searchTerm, filterCategoria],
  )

  // ===== Ordenação: ativos primeiro, inativos no final (memoizada) =====
  const sortedProducts = useMemo(
    () =>
      [...filteredProducts].sort((a, b) => {
        if (a.status === b.status) {
          // Dentro do mesmo status: ordenar pelos mais novos primeiro
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        }

        // Ativos primeiro, inativos no final
        return a.status === "ativo" ? -1 : 1
      }),
    [filteredProducts],
  )

  // ===== Modal / Upload helpers =====
  const openCreateModal = () => {
    if (!canCreate) {
      toast.error('Você não tem permissão para criar produtos');
      return;
    }

    setEditingProduct(null)
    setFormData({
      nome: "",
      preco: "",
      precoPromocional: "",
      categoriaId: "",
      tamanhos: [],
      cores: [],
      descricao: "",
      status: "ativo",
      personalizavel: false,
      sizePrices: {},
    })
    setModalImages([])
    setShowModal(true)
  }

  const openEditModal = async (product: Product) => {
    if (!canEdit) {
      toast.error('Você não tem permissão para editar produtos');
      return;
    }

    setEditingProduct(product)
    
    // Buscar detalhes completos do produto para pegar os preços dos tamanhos
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        headers: buildAuthHeaders(),
      })
      
      if (res.ok) {
        const fullProduct: ProductResponseDto = await res.json()
        
        // Montar sizePrices a partir dos dados do backend
        const sizePricesMap: Record<number, { price: string; promotionalPrice: string }> = {}
        
        fullProduct.sizes?.forEach((s) => {
          sizePricesMap[s.sizeId] = {
            price: s.price !== null ? formatCurrencyBRL((s.price * 100).toString()) : "",
            promotionalPrice: s.promotionalPrice !== null 
              ? formatCurrencyBRL((s.promotionalPrice * 100).toString()) 
              : "",
          }
        })
        
        setFormData({
          nome: product.nome,
          preco: formatCurrencyBRL((product.preco * 100).toString()),
          precoPromocional: product.precoPromocional
            ? formatCurrencyBRL((product.precoPromocional * 100).toString())
            : "",
          categoriaId: product.categoriaId,
          tamanhos: product.tamanhos ?? [],
          cores: product.cores ?? [],
          descricao: product.descricao,
          status: product.status,
          personalizavel: product.personalizavel ?? false,
          sizePrices: sizePricesMap,
        })
      } else {
        // Fallback: usar dados básicos se falhar
        setFormData({
          nome: product.nome,
          preco: formatCurrencyBRL((product.preco * 100).toString()),
          precoPromocional: product.precoPromocional
            ? formatCurrencyBRL((product.precoPromocional * 100).toString())
            : "",
          categoriaId: product.categoriaId,
          tamanhos: product.tamanhos ?? [],
          cores: product.cores ?? [],
          descricao: product.descricao,
          status: product.status,
          personalizavel: product.personalizavel ?? false,
          sizePrices: {},
        })
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do produto:", error)
      // Fallback em caso de erro
      setFormData({
        nome: product.nome,
        preco: formatCurrencyBRL((product.preco * 100).toString()),
        precoPromocional: product.precoPromocional
          ? formatCurrencyBRL((product.precoPromocional * 100).toString())
          : "",
        categoriaId: product.categoriaId,
        tamanhos: product.tamanhos ?? [],
        cores: product.cores ?? [],
        descricao: product.descricao,
        status: product.status,
        personalizavel: product.personalizavel ?? false,
        sizePrices: {},
      })
    }

    // Carrega imagens existentes (ordem já vem organizada pelo loadData)
    setModalImages(
      product.imagens.map((img) => ({
        id: img.id,
        url: img.url,
        isNew: false,
      })),
    )
    setShowModal(true)
  }

  // ===== Gerenciamento de Imagens (Drag & Drop + Delete) =====

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    const newImages: ModalImage[] = files.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`, // ID temporário
      url: URL.createObjectURL(file),
      file: file,
      isNew: true,
    }))

    setModalImages((prev) => [...prev, ...newImages])
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(modalImages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setModalImages(items)
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = modalImages[index]

    if (!imageToRemove.isNew) {
      // Imagem existente: abrir dialog de confirmação
      setDeleteImageDialog({ open: true, index })
    } else {
      // Imagem nova: remover diretamente sem confirmação
      const newImages = Array.from(modalImages)
      newImages.splice(index, 1)
      setModalImages(newImages)
    }
  }

  const confirmDeleteImage = async () => {
    const index = deleteImageDialog.index
    if (index === null) return

    const imageToRemove = modalImages[index]

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/images/${imageToRemove.id}`,
        {
          method: "DELETE",
          headers: buildAuthHeaders(),
        },
      )

      if (!res.ok) {
        console.error("Erro ao excluir imagem.")
        toast.error("Erro ao excluir imagem.")
        setDeleteImageDialog({ open: false, index: null })
        return
      }

      // Remove do estado
      const newImages = Array.from(modalImages)
      newImages.splice(index, 1)
      setModalImages(newImages)
      toast.success("Imagem excluída com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      toast.error("Erro ao conectar ao servidor")
    }

    setDeleteImageDialog({ open: false, index: null })
  }

  // ===== Salvar (create / update) =====
  const handleSave = async () => {
    // Verifica permissões
    if (editingProduct && !canEdit) {
      toast.error('Você não tem permissão para editar produtos');
      return;
    }
    if (!editingProduct && !canCreate) {
      toast.error('Você não tem permissão para criar produtos');
      return;
    }

    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      toast.error('O nome do produto é obrigatório');
      return;
    }

    if (!formData.categoriaId) {
      toast.error('A categoria é obrigatória');
      return;
    }

    if (!formData.preco || formData.preco === '0,00') {
      toast.error('O preço do produto é obrigatório');
      return;
    }

    setIsSaving(true);
    console.log('🔄 Iniciando salvamento do produto...');

    try {
      // Helper para converter e arredondar corretamente
      const parsePrice = (value: string): number => {
        const parsed = Number.parseFloat(value || "0")
        // Arredondar para 2 casas decimais para evitar problemas de precisão
        return Math.round(parsed * 100) / 100
      }

      const sizePrices = formData.tamanhos
        .map((sizeId) => {
          const sp = formData.sizePrices[sizeId]
          if (!sp) return null
          
          // Só incluir se tiver pelo menos um preço definido
          if (!sp.price && !sp.promotionalPrice) return null
          
          return {
            sizeId,
            price: sp.price ? parsePrice(parseCurrencyBRL(sp.price)) : null,
            promotionalPrice: sp.promotionalPrice 
              ? parsePrice(parseCurrencyBRL(sp.promotionalPrice)) 
              : null,
          }
        })
        .filter((sp) => sp !== null)

      const payload = {
        categoryId: formData.categoriaId,
        name: formData.nome,
        description: formData.descricao || null,
        price: parsePrice(parseCurrencyBRL(formData.preco)),
        promotionalPrice: formData.precoPromocional
          ? parsePrice(parseCurrencyBRL(formData.precoPromocional))
          : null,
        sizeIds: formData.tamanhos,
        colorIds: formData.cores,
        sizePrices: sizePrices.length > 0 ? sizePrices : undefined,
        isPersonalizable: formData.personalizavel,
        isActive: formData.status === "ativo",
      }

      let productId: string | null = null

      if (editingProduct) {
        // UPDATE
        const res = await fetch(
          `${API_BASE_URL}/api/products/${editingProduct.id}`,
          {
            method: "PUT",
            headers: buildAuthHeaders({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify(payload),
          },
        )

        if (!res.ok) {
          let errorMessage = "Erro ao atualizar produto."
          try {
            const errorData = await res.json()
            errorMessage = errorData?.message || errorData?.title || errorMessage
          } catch {
            // Se não conseguir parsear, usa mensagem padrão
          }
          console.error("Erro ao atualizar produto:", errorMessage)
          toast.error(errorMessage)
          setIsSaving(false)
          return
        }

        productId = editingProduct.id
      } else {
        // CREATE
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          method: "POST",
          headers: buildAuthHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          let errorMessage = "Erro ao criar produto."
          try {
            const errorData = await res.json()
            errorMessage = errorData?.message || errorData?.title || errorMessage
          } catch {
            // Se não conseguir parsear, usa mensagem padrão
          }
          console.error("Erro ao criar produto:", errorMessage)
          toast.error(errorMessage)
          setIsSaving(false)
          return
        }

        const created: ProductResponseDto = await res.json()
        productId = created.id
      }

      // Processar Imagens (Upload de novas + Reordenação de existentes)
      if (productId) {
        const reorderList: {
          imageId: string
          displayOrder: number
          isPrimary: boolean
        }[] = []

        await Promise.all(
          modalImages.map(async (img, index) => {
            const isPrimary = index === 0

            if (img.isNew && img.file) {
              // Upload
              const fd = new FormData()
              fd.append("file", img.file)
              fd.append("isPrimary", isPrimary ? "true" : "false")
              fd.append("displayOrder", String(index))

              const url = `${API_BASE_URL}/api/products/${productId}/images`

              try {
                const res = await fetch(url, {
                  method: "POST",
                  headers: buildAuthHeaders(),
                  body: fd,
                })
                if (!res.ok) {
                  console.error("Falha no upload da imagem", img.file.name)
                }
              } catch (e) {
                console.error("Erro no upload", e)
              }
            } else {
              // Existente -> Adicionar à lista de reordenação
              reorderList.push({
                imageId: img.id,
                displayOrder: index,
                isPrimary: isPrimary,
              })
            }
          }),
        )

        if (reorderList.length > 0) {
          try {
            await fetch(
              `${API_BASE_URL}/api/products/${productId}/images/reorder`,
              {
                method: "POST",
                headers: buildAuthHeaders({
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify(reorderList),
              },
            )
          } catch (e) {
            console.error("Erro ao reordenar imagens", e)
          }
        }
      }

      await fetchProducts()

      setShowModal(false)
      setEditingProduct(null)
      
      // Toast de sucesso
      toast.success(
        editingProduct 
          ? `Produto "${formData.nome}" atualizado com sucesso!`
          : `Produto "${formData.nome}" criado com sucesso!`
      )
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast.error(
        editingProduct
          ? "Erro ao atualizar produto. Tente novamente."
          : "Erro ao criar produto. Tente novamente."
      )
    } finally {
      setIsSaving(false)
    }
  }

  // ===== Delete com regra: 1º clique inativa, 2º clique tenta remover =====
  const handleDelete = (id: string) => {
    if (!canDelete) {
      toast.error('Você não tem permissão para deletar produtos');
      return;
    }

    const target = products.find((p) => p.id === id)
    if (!target) return

    setDeleteProductDialog({
      open: true,
      productId: id,
      productName: target.nome,
      isActive: target.status === "ativo",
    })
  }

  const confirmDeleteProduct = async () => {
    const { productId, isActive } = deleteProductDialog
    if (!productId) return

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: buildAuthHeaders(),
        },
      )

      if (!res.ok) {
        // tenta ler o corpo de erro (caso venha ProblemDetails / mensagem customizada)
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
          // se não conseguir parsear, segue sem mensagem
        }

        const normalizedMessage = errorMessage.toLowerCase()

        // heurística: considera "vinculado a pedido" mesmo que venha 500
        const isLinkedToOrder =
          res.status === 400 ||
          res.status === 409 ||
          res.status === 500 ||
          normalizedMessage.includes("vinculado") ||
          normalizedMessage.includes("pedido")

        if (isLinkedToOrder) {
          // Abre o alerta de conflito e NÃO mostra toast genérico ou console.error
          setDeleteConflictProduct(deleteProductDialog.productName)
          setDeleteConflictOpen(true)
        } else {
          // Erro real/inesperado
          console.error(
            "Erro ao excluir produto. Status:",
            res.status,
            errorMessage,
          )
          toast.error("Erro ao excluir produto.")
        }

        setDeleteProductDialog({
          open: false,
          productId: null,
          productName: "",
          isActive: true,
        })
        return
      }

      // ======= SUCESSO =======
      if (isActive) {
        // 1º clique: apenas marca como inativo (não some da lista)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  status: "inativo" as Status,
                }
              : p,
          ),
        )
        toast.success("Produto marcado como inativo!")
      } else {
        // 2º clique: remove da lista (quando backend conseguir deletar de fato)
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        toast.success("Produto excluído permanentemente!")
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao conectar ao servidor")
    }

    setDeleteProductDialog({
      open: false,
      productId: null,
      productName: "",
      isActive: true,
    })
  }

  // ======= Lógica de Seleção Múltipla =======

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
    if (selectedIds.size === sortedProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedProducts.map((p) => p.id)))
    }
  }

  const confirmBulkDelete = async () => {
    const idsToDelete = Array.from(selectedIds)
    setBulkDeleteDialog({ open: false, count: 0 })

    let successCount = 0
    let failCount = 0

    // Processar em paralelo
    const results = await Promise.allSettled(
      idsToDelete.map(async (id) => {
        const product = products.find((p) => p.id === id)
        if (!product) return { success: false, id }

        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: buildAuthHeaders(),
        })

        // Verificar se houve conflito
        if (!res.ok && res.status !== 204) {
          // Se não deu ok/204, consideramos falha para fins de feedback
          return { success: false, id }
        }

        return { success: true, id, wasActive: product.status === "ativo" }
      }),
    )

    // Atualizar estado local
    const newProducts = [...products]

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++
        const { id, wasActive } = result.value

        const index = newProducts.findIndex((p) => p.id === id)
        if (index !== -1) {
          if (wasActive) {
            // Se estava ativo, vira inativo
            newProducts[index] = { ...newProducts[index], status: "inativo" }
          } else {
            // Se estava inativo, remove
            newProducts.splice(index, 1)
          }
        }
      } else {
        failCount++
      }
    })

    setProducts(newProducts)
    setSelectedIds(new Set())

    if (successCount > 0) {
      toast.success(`${successCount} produtos processados com sucesso!`)
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} produtos não puderam ser excluídos (possível conflito).`,
      )
    }
  }

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // ===== Render =====
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Produtos</h1>
          <p className="text-foreground/60">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        {canCreate && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Novo Produto
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
              <strong>1º clique na lixeira:</strong> O produto fica inativo.
            </li>
            <li>
              <strong>2º clique na lixeira:</strong> Se não houver vínculos a
              pedidos, o produto é removido permanentemente. Se houver vínculos,
              permanece inativo.
            </li>
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
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
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
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
              produtos selecionados
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
              <span className="font-medium">Excluir selecionados</span>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {isProductsLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
          <p>Carregando produtos...</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => {

            const categoriaNome =
              categories.find((c) => c.id === product.categoriaId)?.nome ?? "-"
            const mainImage =
              product.imagens.length > 0
                ? product.imagens[0].url
                : "/placeholder.svg"

            const isInactive = product.status === "inativo"

            return (
              <div
                key={product.id}
                className={`bg-card border rounded-xl overflow-hidden transition-all ${
                  isInactive ? "border-border/50 opacity-70" : "border-border"
                }`}
              >
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={mainImage}
                    alt={product.nome}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {canEdit && (
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-background/80 backdrop-blur-sm text-foreground/80 hover:text-primary rounded-lg transition-colors shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-background/80 backdrop-blur-sm text-foreground/80 hover:text-red-600 rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  {product.precoPromocional && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-md shadow-sm">
                      PROMOÇÃO
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">
                        {categoriaNome}
                      </p>
                      <h3 className="font-medium text-foreground line-clamp-2 leading-tight">
                        {product.nome}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      {product.precoPromocional ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground/50 line-through">
                            R$ {product.preco.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="font-bold text-accent">
                            R$ {product.precoPromocional.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-foreground">
                          R$ {product.preco.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <span className="text-xs text-foreground/40">
                      {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
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
                          paginatedProducts.length > 0 &&
                          paginatedProducts.every((p) => selectedIds.has(p.id))
                        }

                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                    Categoria
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
                {paginatedProducts.map((product) => {

                  const categoriaNome =
                    categories.find((c) => c.id === product.categoriaId)
                      ?.nome ?? "-"
                  const mainImage =
                    product.imagens.length > 0
                      ? product.imagens[0].url
                      : "/placeholder.svg"

                  const isInactive = product.status === "inativo"

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isInactive
                          ? "opacity-70 bg-muted/30"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {canDelete && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(product.id)}
                            onChange={() => toggleSelect(product.id)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            <Image
                              src={mainImage}
                              alt={product.nome}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-foreground">
                            {product.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {product.precoPromocional ? (
                            <>
                              <span className="text-sm text-foreground/50 line-through">
                                R$ {product.preco.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span className="ml-2 font-medium text-accent">
                                R$ {product.precoPromocional.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-foreground">
                              R$ {product.preco.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {categoriaNome}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === "ativo"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(product.createdAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(product.id)}
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
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedProducts.length}
            itemsPerPage={itemsPerPage}
            itemLabel="produtos"
          />
        </div>

      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-medium text-foreground">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload with Drag and Drop */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Imagens
                </label>

                <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload
                    size={32}
                    className="mx-auto text-foreground/40 mb-2"
                  />
                  <p className="text-sm text-foreground/60">
                    Clique ou arraste imagens aqui
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    PNG, JPG até 5MB
                  </p>
                </label>

                {modalImages.length > 0 && (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid grid-cols-3 gap-3"
                        >
                          {modalImages.map((img, index) => (
                            <Draggable
                              key={img.id}
                              draggableId={img.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative w-full h-24 rounded-lg overflow-hidden bg-muted border border-border group"
                                >
                                  <Image
                                    src={img.url}
                                    alt={`Imagem ${index + 1}`}
                                    width={120}
                                    height={96}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <GripVertical
                                      className="text-white cursor-move"
                                      size={20}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  {index === 0 && (
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded shadow-sm">
                                      Principal
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => {
                      const formatted = formatCurrencyBRL(e.target.value)
                      setFormData({ ...formData, preco: formatted })
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preço Promocional
                  </label>
                  <input
                    type="text"
                    value={formData.precoPromocional}
                    onChange={(e) => {
                      const formatted = formatCurrencyBRL(e.target.value)
                      setFormData({
                        ...formData,
                        precoPromocional: formatted,
                      })
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="0,00 (Opcional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.categoriaId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoriaId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Selecione...</option>
                    {categories
                      .filter((cat) => cat.ativo)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Status,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tamanhos
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-border rounded-lg bg-background min-h-[42px]">
                  {sizes
                    .filter((size) => size.ativo)
                    .map((size) => (
                      <label
                        key={size.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-sm border transition-colors ${
                          formData.tamanhos.includes(size.id)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-transparent text-foreground/70 hover:bg-muted/80"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.tamanhos.includes(size.id)}
                          onChange={(e) => {
                            const newSizes = e.target.checked
                              ? [...formData.tamanhos, size.id]
                              : formData.tamanhos.filter((id) => id !== size.id)
                            setFormData({ ...formData, tamanhos: newSizes })
                          }}
                        />
                        {size.nome}
                      </label>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cores
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-border rounded-lg bg-background min-h-[42px]">
                  {colors
                    .filter((c) => c.ativo)
                    .map((color) => (
                      <label
                        key={color.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer text-sm border transition-colors ${
                          formData.cores.includes(color.id)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-transparent text-foreground/70 hover:bg-muted/80"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.cores.includes(color.id)}
                          onChange={(e) => {
                            const newColors = e.target.checked
                              ? [...formData.cores, color.id]
                              : formData.cores.filter((id) => id !== color.id)
                            setFormData({
                              ...formData,
                              cores: newColors,
                            })
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.codigoHex }}
                        />
                        {color.nome}
                      </label>
                    ))}
                </div>
              </div>

              {/* Preços por Tamanho */}
              {formData.tamanhos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preços por Tamanho
                    <span className="text-xs font-normal text-foreground/60 ml-2">
                      (Opcional - deixe vazio para usar o preço base)
                    </span>
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                            Tamanho
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                            Preço (R$)
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-foreground">
                            Preço Promocional
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {formData.tamanhos.map((sizeId) => {
                          const size = sizes.find((s) => s.id === sizeId)
                          if (!size) return null

                          const sizePrice = formData.sizePrices[sizeId] || {
                            price: "",
                            promotionalPrice: "",
                          }

                          return (
                            <tr key={sizeId} className="bg-background">
                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {size.nome}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={sizePrice.price}
                                  onChange={(e) => {
                                    const formatted = formatCurrencyBRL(e.target.value)
                                    setFormData({
                                      ...formData,
                                      sizePrices: {
                                        ...formData.sizePrices,
                                        [sizeId]: {
                                          ...sizePrice,
                                          price: formatted,
                                        },
                                      },
                                    })
                                  }}
                                  className="w-full px-3 py-1.5 border border-border rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                  placeholder="0,00"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={sizePrice.promotionalPrice}
                                  onChange={(e) => {
                                    const formatted = formatCurrencyBRL(e.target.value)
                                    setFormData({
                                      ...formData,
                                      sizePrices: {
                                        ...formData.sizePrices,
                                        [sizeId]: {
                                          ...sizePrice,
                                          promotionalPrice: formatted,
                                        },
                                      },
                                    })
                                  }}
                                  className="w-full px-3 py-1.5 border border-border rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                  placeholder="0,00"
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-foreground/60 mt-2">
                    💡 Dica: Se deixar vazio, o sistema usará o preço base do produto para este tamanho.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="personalizavel"
                  checked={formData.personalizavel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalizavel: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="personalizavel"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Produto Personalizável
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              {((editingProduct && canEdit) || (!editingProduct && canCreate)) && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving 
                    ? (editingProduct ? "Salvando..." : "Criando...") 
                    : (editingProduct ? "Salvar Alterações" : "Criar Produto")
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert – Remover Imagem */}
      <AlertDialog
        open={deleteImageDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteImageDialog({ open: false, index: null })
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover imagem</AlertDialogTitle>
            <AlertDialogDescription>
              Essa imagem será removida do produto. Essa ação não poderá ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteImage}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Remover imagem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert – Inativar / Excluir Produto */}
      <AlertDialog
        open={deleteProductDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProductDialog({
              open: false,
              productId: null,
              productName: "",
              isActive: true,
            })
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteProductDialog.isActive
                ? "Marcar produto como inativo?"
                : "Excluir produto permanentemente?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteProductDialog.isActive ? (
                <>
                  O produto ficará{" "}
                  <span className="font-semibold">inativo</span> e não será
                  exibido para os clientes.
                  <br />
                  <br />
                  {deleteProductDialog.productName && (
                    <>
                      Produto:{" "}
                      <span className="font-semibold">
                        {deleteProductDialog.productName}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  O produto será{" "}
                  <span className="font-semibold">
                    excluído permanentemente
                  </span>{" "}
                  caso não esteja vinculado a nenhum pedido.
                  <br />
                  <br />
                  {deleteProductDialog.productName && (
                    <>
                      Produto:{" "}
                      <span className="font-semibold">
                        {deleteProductDialog.productName}
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
              onClick={confirmDeleteProduct}
              className={
                deleteProductDialog.isActive
                  ? "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500"
                  : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
              }
            >
              {deleteProductDialog.isActive
                ? "Sim, deixar inativo"
                : "Sim, excluir permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert – Produto Vinculado a Pedido */}
      <AlertDialog
        open={deleteConflictOpen}
        onOpenChange={setDeleteConflictOpen}
      >
        <AlertDialogContent className="overflow-hidden border-0 max-w-md">
          <div className="bg-white rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="w-5 h-5 text-red-500" />
                Produto não pode ser excluído
              </AlertDialogTitle>

              <AlertDialogDescription className="space-y-3 text-gray-600">
                <span className="block">
                  Este produto não pode ser excluído pois já está vinculado a{" "}
                  <strong>um ou mais pedidos realizados</strong>.
                </span>

                {deleteConflictProduct && (
                  <span className="block rounded-xl bg-gray-100 px-4 py-3 text-sm">
                    <span className="font-medium text-gray-900">Produto:</span>{" "}
                    {deleteConflictProduct}
                  </span>
                )}

                <span className="mt-1 flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Para manter o histórico dos pedidos, produtos associados não
                    podem ser removidos. Eles permanecem como{" "}
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
              Excluir {bulkDeleteDialog.count} produtos?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  Você selecionou <strong>{bulkDeleteDialog.count} produtos</strong>{" "}
                  para exclusão.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm mt-4">
                  <li>
                    Produtos ativos serão marcados como{" "}
                    <strong>inativos</strong>.
                  </li>
                  <li>
                    Produtos inativos serão{" "}
                    <strong>excluídos permanentemente</strong>.
                  </li>
                  <li>
                    Produtos com vínculos serão mantidos (apenas inativados).
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