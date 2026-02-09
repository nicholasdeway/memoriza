"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Save, User, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/lib/use-permissions"
import { toast } from "sonner"

const API_BASE_URL = "/api-proxy"

function fixEncoding(value?: string): string {
  if (!value) return ""
  try {
    const decoded = decodeURIComponent(escape(value))
    return decoded
  } catch {
    return value
  }
}

type UserProfileApiResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  createdAt: string
}

type UpdateProfileBody = {
  FirstName: string
  LastName: string
  Phone: string | null
  Email?: string | null
}

type ErrorResponse = {
  message?: string
}

export default function AdminConfiguracoes() {
  const { user, updateUserFromProfile } = useAuth()
  const router = useRouter()
  const { canEdit } = usePermissions('settings')

  const [nome, setNome] = useState("")
  const [sobrenome, setSobrenome] = useState("")
  const [email, setEmail] = useState("")
  const [celular, setCelular] = useState("")

  const [saved, setSaved] = useState(false)
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11) // máximo 11 dígitos

    if (!digits) return ""

    if (digits.length <= 2) {
      return `(${digits}`
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const unmaskPhone = (value: string): string => value.replace(/\D/g, "")

  // Sinaliza quando o componente já está montado no browser
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Se depois de hidratado não houver user, manda pro login
  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      router.push("/auth/login")
    }
  }, [hydrated, user, router])

  // Conta Google x Local
  const isGoogleAccount =
    typeof user?.authProvider === "string" &&
    user.authProvider.toLowerCase() === "google"

  const [hasFetchedProfile, setHasFetchedProfile] = useState(false)

  // Carrega dados reais do perfil pela API: GET /api/user/me
  useEffect(() => {
    if (!hydrated || !user || hasFetchedProfile) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setErro("")

        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
          credentials: "include",
        })

        if (!res.ok) {
          console.warn("Erro ao buscar perfil:", res.status)
          setErro("Não foi possível carregar seus dados de perfil.")
          // Marcamos como "buscado" para não tentar de novo infinitamente caso dê erro 401/403
          setHasFetchedProfile(true)
          return
        }

        const data = (await res.json()) as UserProfileApiResponse

        setNome(fixEncoding(data.firstName))
        setSobrenome(fixEncoding(data.lastName))
        setEmail(data.email ?? "")
        setCelular(formatPhone(data.phone ?? ""))

        // Sincroniza com o contexto → header atualiza
        updateUserFromProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone ?? undefined,
        })
        
        setHasFetchedProfile(true)
      } catch (err) {
        console.error("Erro ao buscar perfil:", err)
        setErro("Erro ao conectar ao servidor. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [hydrated, user, hasFetchedProfile, updateUserFromProfile])

  if (!hydrated) {
    return (
      <div className="p-8">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-foreground/60">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-foreground/60">Redirecionando...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setErro("")
    setSaved(false)

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!canEdit) {
      toast.error("Você não tem permissão para alterar configurações")
      return
    }

    try {
      setLoading(true)

      const phoneToSend = unmaskPhone(celular)

      const body: UpdateProfileBody = {
        FirstName: nome,
        LastName: sobrenome,
        Phone: phoneToSend || null,
      }

      // Para conta LOCAL, permite troca de e-mail
      if (!isGoogleAccount) {
        body.Email = email || null
      }

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      })

      let data: unknown = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      console.log("UPDATE PROFILE RESPONSE", response.status, data)

      if (!response.ok) {
        let message = "Não foi possível salvar os dados."

        if (Array.isArray(data) && data.length > 0) {
          const first = data[0]
          if (typeof first === "string") {
            message = first
          }
        } else if (data && typeof data === "object") {
          const obj = data as ErrorResponse
          if (obj.message) {
            message = obj.message
          }
        }

        setErro(message)
        return
      }

      if (data && typeof data === "object") {
        const profile = data as Partial<UserProfileApiResponse>

        if (typeof profile.firstName === "string") {
          setNome(fixEncoding(profile.firstName))
        }
        if (typeof profile.lastName === "string") {
          setSobrenome(fixEncoding(profile.lastName))
        }
        if (typeof profile.phone === "string") {
          setCelular(formatPhone(profile.phone))
        }
        if (typeof profile.email === "string") {
          setEmail(profile.email)
        }

        updateUserFromProfile({
          firstName: profile.firstName ?? nome,
          lastName: profile.lastName ?? sobrenome,
          email: profile.email ?? email,
          phone: profile.phone ?? phoneToSend,
        })
      } else {
        // fallback caso a API não retorne o objeto
        updateUserFromProfile({
          firstName: nome,
          lastName: sobrenome,
          email: isGoogleAccount ? user?.email : email,
          phone: phoneToSend,
        })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Erro ao salvar dados de perfil:", error)
      setErro("Erro ao conectar ao servidor. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-foreground">Configurações</h1>
        <p className="text-foreground/60">Gerencie suas informações administrativas</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-medium text-foreground">
                  {nome} {sobrenome}
                </h2>
                <p className="text-foreground/60">Administrador</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {erro && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {erro}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={!canEdit}
                  className={`w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent ${
                    !canEdit ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sobrenome</label>
                <input
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  disabled={!canEdit}
                  className={`w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent ${
                    !canEdit ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Celular</label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(formatPhone(e.target.value))}
                disabled={!canEdit}
                className={`w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent ${
                  !canEdit ? "opacity-60 cursor-not-allowed" : ""
                }`}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={isGoogleAccount ? undefined : (e) => setEmail(e.target.value)}
                disabled={isGoogleAccount || !canEdit}
                className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none ${
                  isGoogleAccount || !canEdit
                    ? "bg-muted text-foreground/70 cursor-not-allowed"
                    : "bg-background focus:ring-2 focus:ring-accent"
                }`}
              />
              {isGoogleAccount && (
                <p className="mt-1 text-xs text-foreground/60">
                  Este e-mail é gerenciado pela sua conta Google e não pode ser alterado aqui.
                </p>
              )}
            </div>

            {/* Success Message */}
            {saved && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                <Check size={18} className="text-emerald-700" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border bg-muted/30">
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saved ? <Check size={18} /> : <Save size={18} />}
                {loading ? "Salvando..." : saved ? "Salvo!" : "Salvar Alterações"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}