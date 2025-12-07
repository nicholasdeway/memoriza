"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Loader2, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.message || "Erro ao solicitar redefinição de senha")
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
                <h1 className="text-2xl font-bold text-foreground">E-mail Enviado!</h1>
                <p className="text-foreground/70">
                  Enviamos um link de redefinição de senha para <strong>{email}</strong>
                </p>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-foreground/80">
                <p className="mb-2">📧 Verifique sua caixa de entrada e spam.</p>
                <p>O link expira em 1 hora.</p>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Voltar para o login
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            // Request Form
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Esqueceu sua senha?</h1>
                <p className="text-foreground/70">
                  Sem problemas! Digite seu e-mail e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Enviar Link de Redefinição</span>
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
