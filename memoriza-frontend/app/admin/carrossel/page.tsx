"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  GripVertical,
  Loader2,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
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
import Image from "next/image"
import { type CarouselTemplateType, type CarouselItem } from "@/types/carousel"
import { usePermissions } from "@/lib/use-permissions"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

const CAROUSEL_API_URL = `${API_BASE_URL}/api/carousel-items`

interface CarouselFormData {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  isActive: boolean
  imageFile: File | null
  imageUrl: string
  templateType: CarouselTemplateType
}

const TEMPLATE_LABELS: Record<CarouselTemplateType, string> = {
  default: "Padrão (Texto + Imagem)",
  full_image: "Imagem Completa",
  overlay: "Texto Sobreposto",
  minimal: "Minimalista",
}

export default function AdminCarrossel() {
  const { token, isLoading: authLoading } = useAuth()
  const { canCreate, canEdit, canDelete } = usePermissions('carousel')

  const [items, setItems] = useState<CarouselItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null)
  const [formData, setFormData] = useState<CarouselFormData>({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    isActive: true,
    imageFile: null,
    imageUrl: "",
    templateType: "default",
  })

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id: string | null
  }>({ open: false, id: null })

  const buildAuthHeaders = () => {
    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(CAROUSEL_API_URL, {
        headers: buildAuthHeaders(),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        console.error(
          "Erro ao carregar itens do carrossel:",
          res.status,
          res.statusText,
          errorText,
        )

        if (res.status === 401 || res.status === 403) {
          toast.error("Você não tem permissão para acessar os banners.")
        } else {
          toast.error("Erro ao carregar itens do carrossel")
        }

        return
      }

      const data: CarouselItem[] = await res.json()
      // Sort by displayOrder
      const sorted = (data || []).sort(
        (a: CarouselItem, b: CarouselItem) => a.displayOrder - b.displayOrder,
      )
      setItems(sorted)
    } catch (error) {
      console.error("Exceção ao carregar itens do carrossel:", error)
      toast.error("Erro ao carregar itens do carrossel")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchItems()
    }
  }, [authLoading])

  const handleOpenModal = (item?: CarouselItem) => {
    if (item) {
      if (!canEdit) {
        toast.error("Você não tem permissão para editar banners")
        return
      }
      setEditingItem(item)
      setFormData({
        title: item.title,
        subtitle: item.subtitle,
        ctaText: item.ctaText,
        ctaLink: item.ctaLink,
        isActive: item.isActive,
        imageFile: null,
        imageUrl: item.imageUrl,
        templateType: item.templateType ?? "default",
      })
    } else {
      if (!canCreate) {
        toast.error("Você não tem permissão para criar banners")
        return
      }
      setEditingItem(null)
      setFormData({
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        isActive: true,
        imageFile: null,
        imageUrl: "",
        templateType: "default",
      })
    }
    setShowModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file),
      }))
    }
  }

  const handleSave = async () => {
    // Verifica permissões
    if (editingItem && !canEdit) {
      toast.error("Você não tem permissão para editar banners")
      return
    }
    if (!editingItem && !canCreate) {
      toast.error("Você não tem permissão para criar banners")
      return
    }

    try {
      // título só é obrigatório se NÃO for full_image
      if (formData.templateType !== "full_image" && !formData.title.trim()) {
        toast.error("Informe um título para o banner")
        return
      }

      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("subtitle", formData.subtitle)
      fd.append("ctaText", formData.ctaText)
      fd.append("ctaLink", formData.ctaLink)
      fd.append("isActive", String(formData.isActive))
      fd.append("templateType", formData.templateType)

      if (formData.imageFile) {
        fd.append("image", formData.imageFile)
      }

      let url = CAROUSEL_API_URL
      let method: "POST" | "PUT" = "POST"

      if (editingItem) {
        url = `${CAROUSEL_API_URL}/${editingItem.id}`
        method = "PUT"
      }

      const res = await fetch(url, {
        method,
        headers: buildAuthHeaders(),
        body: fd,
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        console.error(
          "Erro ao salvar item do carrossel:",
          res.status,
          res.statusText,
          errorText,
        )
        toast.error("Erro ao salvar item")
        return
      }

      toast.success(
        editingItem
          ? "Item atualizado com sucesso!"
          : "Item criado com sucesso!",
      )
      setShowModal(false)
      fetchItems()
    } catch (error) {
      console.error("Exceção ao salvar item do carrossel:", error)
      toast.error("Erro ao salvar item")
    }
  }

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error("Você não tem permissão para excluir banners")
      return
    }
    if (!deleteDialog.id) return
    try {
      const res = await fetch(`${CAROUSEL_API_URL}/${deleteDialog.id}`, {
        method: "DELETE",
        headers: buildAuthHeaders(),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        console.error(
          "Erro ao excluir item do carrossel:",
          res.status,
          res.statusText,
          errorText,
        )
        toast.error("Erro ao excluir item")
        return
      }

      toast.success("Item excluído com sucesso!")
      setDeleteDialog({ open: false, id: null })
      fetchItems()
    } catch (error) {
      console.error("Exceção ao excluir item do carrossel:", error)
      toast.error("Erro ao excluir item")
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    if (!canEdit) {
      toast.error("Você não tem permissão para reordenar banners")
      return
    }

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    setItems(newItems)

    try {
      const reorderPayload = newItems.map((item, index) => ({
        imageId: item.id,
        displayOrder: index,
        isPrimary: index === 0,
      }))

      const res = await fetch(`${CAROUSEL_API_URL}/reorder`, {
        method: "POST",
        headers: {
          ...buildAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reorderPayload),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        console.error(
          "Erro ao reordenar itens do carrossel:",
          res.status,
          res.statusText,
          errorText,
        )
        toast.error("Erro ao salvar nova ordem")
      }
    } catch (error) {
      console.error("Exceção ao reordenar itens do carrossel:", error)
      toast.error("Erro ao salvar nova ordem")
    }
  }

  const isFullImage = formData.templateType === "full_image"

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">
            Gerenciar Carrossel
          </h1>
          <p className="text-foreground/60">
            Personalize os banners da página inicial
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Novo Banner
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="carousel-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={!canEdit}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-card border border-border rounded-lg p-4 flex items-center gap-4 shadow-sm ${
                          snapshot.isDragging ? "opacity-50" : ""
                        }`}
                      >
                        {canEdit && (
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical size={20} />
                          </div>
                        )}

                        <div className="w-32 h-20 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.title || "(Sem título)"}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                item.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.isActive ? "Ativo" : "Inativo"}
                            </span>
                            {index === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                Principal
                              </span>
                            )}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              {TEMPLATE_LABELS[item.templateType] ??
                                "Padrão (Texto + Imagem)"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() =>
                                setDeleteDialog({ open: true, id: item.id })
                              }
                              className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
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

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Editar Banner" : "Novo Banner"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Imagem do Banner
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 relative rounded-md overflow-hidden bg-muted border border-border flex-shrink-0">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Upload size={20} />
                        <span className="text-xs">Clique para alterar</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Template */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Modelo do Banner
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "default", label: "Padrão (Texto + Imagem)" },
                    { id: "full_image", label: "Imagem Completa" },
                    { id: "overlay", label: "Texto Sobreposto" },
                    { id: "minimal", label: "Minimalista" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          templateType: t.id as CarouselTemplateType,
                        }))
                      }
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.templateType === t.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ao escolher <strong>Imagem Completa</strong>, os campos de
                  texto ficam opcionais e são desabilitados.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Título{" "}
                  {isFullImage && (
                    <span className="text-muted-foreground font-normal text-xs">
                      (Opcional)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  disabled={isFullImage}
                  className={`w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                    isFullImage ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    isFullImage
                      ? "Título desabilitado para o modelo Imagem Completa"
                      : "Ex: Promoção de Verão"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  disabled={isFullImage}
                  className={`w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                    isFullImage ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    isFullImage
                      ? "Subtítulo desabilitado para o modelo Imagem Completa"
                      : "Ex: Descontos de até 50%"
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaText: e.target.value })
                    }
                    disabled={isFullImage}
                    className={`w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      isFullImage ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    placeholder={
                      isFullImage
                        ? "CTA desabilitado para o modelo Imagem Completa"
                        : "Ex: Ver Ofertas"
                      }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Link do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaLink: e.target.value })
                    }
                    disabled={isFullImage}
                    className={`w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                      isFullImage ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    placeholder={
                      isFullImage
                        ? "Link desabilitado para o modelo Imagem Completa"
                        : "Ex: /produtos"
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Banner Ativo
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este banner? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}