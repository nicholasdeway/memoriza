"use client"

import { useEffect, useState } from "react"
import { Plus, MapPin, Edit2, Trash2, Check, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

interface Endereco {
  id: string
  apelido: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  principal: boolean
}

interface AddressResponseApi {
  id: string
  label: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  isDefault: boolean
  createdAt: string
}

// Tipos da BrasilAPI
interface BrasilApiCepSuccess {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
}

interface BrasilApiError {
  name: "BadRequestError" | "NotFoundError" | "InternalError"
  message: string
  type: string
}

export default function EnderecosPage() {
  const { token } = useAuth()

  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  // Estado para AlertDialog de exclusão
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    addressId: string | null
    addressLabel: string
  }>({ open: false, addressId: null, addressLabel: "" })

  const [form, setForm] = useState<Omit<Endereco, "id">>({
    apelido: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    principal: false,
  })

  function mapApiToEndereco(a: AddressResponseApi): Endereco {
    return {
      id: a.id,
      apelido: a.label ?? "",
      cep: a.zipCode ?? "",
      rua: a.street ?? "",
      numero: a.number ?? "",
      complemento: a.complement ?? "",
      bairro: a.neighborhood ?? "",
      cidade: a.city ?? "",
      estado: a.state ?? "",
      principal: a.isDefault,
    }
  }

  async function fetchEnderecos(authToken: string) {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!res.ok) {
        console.error("Erro ao buscar endereços", await res.text())
        return
      }

      const data: AddressResponseApi[] = await res.json()
      setEnderecos(data.map(mapApiToEndereco))
    } catch (err) {
      console.error("Erro ao buscar endereços:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    void fetchEnderecos(token)
  }, [token])

  const resetForm = () => {
    setForm({
      apelido: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      principal: false,
    })
    setEditingId(null)
    setCepError(null)
    setCepLoading(false)
  }

  const handleOpenModal = (endereco?: Endereco) => {
    if (endereco) {
      setEditingId(endereco.id)
      setForm({
        apelido: endereco.apelido || "",
        cep: endereco.cep || "",
        rua: endereco.rua || "",
        numero: endereco.numero || "",
        complemento: endereco.complemento || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
        principal: endereco.principal,
      })
    } else {
      resetForm()
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!token) {
      alert("Você precisa estar logado para gerenciar endereços.")
      return
    }

    setSaving(true)

    const payload = {
    label: form.apelido || "",
    street: form.rua || "",
    number: form.numero || "",
    complement: form.complemento || null,
    neighborhood: form.bairro || "",
    city: form.cidade || "",
    state: form.estado || "",
    zipCode:
      form.cep && form.cep.length === 8
        ? formatCepMask(form.cep)
        : form.cep || "",
    country: "Brasil",
    isDefault: form.principal,
  }

    try {
      let url = `${API_BASE_URL}/api/profile/addresses`
      let method: "POST" | "PUT" = "POST"

      if (editingId) {
        url = `${API_BASE_URL}/api/profile/addresses/${editingId}`
        method = "PUT"
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Erro ao salvar endereço:", text)
        alert("Não foi possível salvar o endereço. Tente novamente.")
        return
      }

      await fetchEnderecos(token)

      setModalOpen(false)
      resetForm()
    } catch (err) {
      console.error("Erro ao salvar endereço:", err)
      alert("Ocorreu um erro ao salvar o endereço.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    if (!token) {
      alert("Você precisa estar logado para gerenciar endereços.")
      return
    }

    const endereco = enderecos.find((e) => e.id === id)
    if (!endereco) return

    setDeleteDialog({
      open: true,
      addressId: id,
      addressLabel: endereco.apelido || "este endereço",
    })
  }

  const confirmDelete = async () => {
    const { addressId } = deleteDialog
    if (!addressId || !token) return

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok && res.status !== 204) {
        console.error("Erro ao excluir endereço:", await res.text())
        alert("Não foi possível excluir o endereço.")
        return
      }

      setEnderecos((prev) => prev.filter((e) => e.id !== addressId))
    } catch (err) {
      console.error("Erro ao excluir endereço:", err)
      alert("Ocorreu um erro ao excluir o endereço.")
    } finally {
      setDeleteDialog({ open: false, addressId: null, addressLabel: "" })
    }
  }

  const handleSetPrincipal = async (id: string) => {
    if (!token) {
      alert("Você precisa estar logado para gerenciar endereços.")
      return
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/profile/addresses/${id}/set-default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        console.error("Erro ao definir principal:", await res.text())
        alert("Não foi possível definir o endereço como principal.")
        return
      }

      await fetchEnderecos(token)
    } catch (err) {
      console.error("Erro ao definir principal:", err)
      alert("Ocorreu um erro ao definir o endereço como principal.")
    }
  }

  // ===== CEP helpers =====

  // Mantém só números, até 8 dígitos
  const sanitizeCep = (value: string) => {
    return (value || "").replace(/\D/g, "").slice(0, 8)
  }

  // Aplica máscara 00000-000 apenas para exibição
  const formatCepMask = (value: string) => {
    const digits = sanitizeCep(value)
    if (digits.length <= 5) return digits
    return `${digits.slice(0, 5)}-${digits.slice(5)}`
  }

  const handleCepChange = (value: string) => {
    setCepError(null)
    const sanitized = sanitizeCep(value)
    setForm((prev) => ({ ...prev, cep: sanitized }))
  }

  const handleBuscarCep = async () => {
    const cep = sanitizeCep(form.cep)

    if (!cep || cep.length !== 8) {
      setCepError("CEP deve conter exatamente 8 dígitos.")
      return
    }

    setCepLoading(true)
    setCepError(null)

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
      const data = await res.json()

      if (!res.ok) {
        const err = data as BrasilApiError
        if (err.name === "BadRequestError") {
          setCepError("CEP inválido. Verifique e tente novamente.")
        } else if (err.name === "NotFoundError") {
          setCepError("CEP não encontrado.")
        } else {
          setCepError("Erro ao consultar CEP. Tente novamente em instantes.")
        }
        return
      }

      const address = data as BrasilApiCepSuccess

      setForm((prev) => ({
        ...prev,
        cep: sanitizeCep(address.cep),
        rua: address.street ?? "",
        bairro: address.neighborhood ?? "",
        cidade: address.city ?? "",
        estado: address.state ?? "",
      }))
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setCepError("Erro de conexão ao buscar CEP.")
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-foreground">Meus Endereços</h2>
          <p className="text-sm text-foreground/60">
            Gerencie seus endereços de entrega
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Novo Endereço
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-foreground/60">
          Carregando endereços...
        </div>
      ) : (
        <>
          {/* Endereços Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enderecos.map((endereco) => (
              <div
                key={endereco.id}
                className={`relative border rounded-xl p-4 transition-colors ${
                  endereco.principal
                    ? "border-accent bg-accent/5"
                    : "border-border"
                }`}
              >
                {endereco.principal && (
                  <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                    Principal
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <MapPin size={20} className="text-foreground/60" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {endereco.apelido || ""}
                    </p>
                    <p className="text-sm text-foreground/60 mt-2">
                      {endereco.rua || ""}, {endereco.numero || ""}
                      {endereco.complemento && ` - ${endereco.complemento}`}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {(endereco.bairro || "") +
                        " - " +
                        (endereco.cidade || "") +
                        "/" +
                        (endereco.estado || "")}
                    </p>
                    <p className="text-sm text-foreground/60">
                      CEP: {endereco.cep || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  {!endereco.principal && (
                    <button
                      onClick={() => handleSetPrincipal(endereco.id)}
                      className="text-xs text-accent hover:underline"
                    >
                      Definir como principal
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => handleOpenModal(endereco)}
                    className="p-2 text-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(endereco.id)}
                    className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {enderecos.length === 0 && !loading && (
              <div className="col-span-2 text-center py-12 text-foreground/60">
                <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                <p>Você ainda não tem endereços cadastrados</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-medium">
                {editingId ? "Editar Endereço" : "Novo Endereço"}
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false)
                  resetForm()
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Apelido
                  </label>
                  <input
                    type="text"
                    value={form.apelido || ""}
                    onChange={(e) =>
                      setForm({ ...form, apelido: e.target.value })
                    }
                    placeholder="Ex: Casa, Trabalho"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CEP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formatCepMask(form.cep)}
                      onChange={(e) => handleCepChange(e.target.value)}
                      onBlur={handleBuscarCep}
                      placeholder="00000-000"
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                      disabled={cepLoading || saving}
                    />
                    <button
                      type="button"
                      onClick={handleBuscarCep}
                      disabled={cepLoading || !form.cep}
                      className="px-3 py-2 text-sm rounded-lg border border-border bg-muted hover:bg-muted/80 disabled:opacity-60"
                    >
                      {cepLoading ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                  {cepError && (
                    <p className="mt-1 text-xs text-red-500">{cepError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Rua</label>
                  <input
                    type="text"
                    value={form.rua || ""}
                    onChange={(e) =>
                      setForm({ ...form, rua: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    value={form.numero || ""}
                    onChange={(e) =>
                      setForm({ ...form, numero: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.complemento || ""}
                  onChange={(e) =>
                    setForm({ ...form, complemento: e.target.value })
                  }
                  placeholder="Apto, Sala, Bloco..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bairro</label>
                <input
                  type="text"
                  value={form.bairro || ""}
                  onChange={(e) =>
                    setForm({ ...form, bairro: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={form.cidade || ""}
                    onChange={(e) =>
                      setForm({ ...form, cidade: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={form.estado || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estado: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="UF"
                    maxLength={2}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent uppercase"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.principal}
                  onChange={(e) =>
                    setForm({ ...form, principal: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <span className="text-sm">
                  Definir como endereço principal
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setModalOpen(false)
                  resetForm()
                }}
                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Check size={18} />
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AlertDialog de Confirmação de Exclusão */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, addressId: null, addressLabel: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Endereço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o endereço "{deleteDialog.addressLabel}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}