"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Loader2, Lock, CheckCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordPageInner() {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()

  // Pega token e email da URL quando a página carrega
  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (token && email) {
      setFormData((prev) => ({
        ...prev,
        token,
        email,
      }))
    }
  }, [searchParams])

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []

    if (password.length < 6) {
      errors.push("A senha deve ter no mínimo 6 caracteres")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("A senha deve conter pelo menos um número")
    }

    return errors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
    setValidationErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setValidationErrors([])

    // Validações locais
    const passwordErrors = validatePassword(formData.newPassword)
    if (passwordErrors.length > 0) {
      setValidationErrors(passwordErrors)
      setIsLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/password-reset/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redireciona para login após 3 segundos
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setError(data.message || "Erro ao redefinir senha")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {success ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Senha Redefinida!</h1>
                <p className="text-foreground/70">Sua senha foi alterada com sucesso.</p>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-foreground/80">
                <p>Redirecionando para o login em 3 segundos...</p>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Ir para o login agora
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            // Reset Form
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                    <Lock className="w-7 h-7 text-accent" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Redefinir Senha</h1>
                <p className="text-foreground/70">Digite sua nova senha abaixo.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
                  <p className="font-medium mb-1">Requisitos de senha:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground/70 cursor-not-allowed"
                  />
                </div>

                {/* Token (hidden field) */}
                <input type="hidden" name="token" value={formData.token} />

                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirmar Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground/70">
                  <p className="font-medium mb-1">A senha deve conter:</p>
                  <ul className="space-y-1">
                    <li className={formData.newPassword.length >= 6 ? "text-green-600" : ""}>
                      • Mínimo de 6 caracteres
                    </li>
                    <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                      • Pelo menos uma letra maiúscula
                    </li>
                    <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                      • Pelo menos uma letra minúscula
                    </li>
                    <li className={/[0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>
                      • Pelo menos um número
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                  className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Redefinir Senha</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <Link
                  href="/auth/login"
                  className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  ← Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

// useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center py-12 px-4">
            <div className="flex flex-col items-center gap-3 text-foreground/70">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Carregando página de redefinição...</p>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  )
}