"use client";

import type React from "react";
import { Suspense } from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GoogleSignIn from "@/components/GoogleSignIn";

function mapGoogleErrorToMessage(code: string): string {
  switch (code) {
    case "access_denied":
      return "O acesso pelo Google foi negado. Tente novamente ou use e-mail e senha.";
    case "external_auth_failed":
      return "Não foi possível confirmar sua conta Google. Tente novamente.";
    case "server_error":
      return "Ocorreu um erro interno ao tentar login com o Google. Tente novamente em alguns instantes.";
    case "missing_token":
      return "Não foi possível concluir o login com o Google. Token ausente na resposta.";
    default:
      return "Não foi possível finalizar o login com o Google. Tente novamente ou use e-mail e senha.";
  }
}

// 🔹 Componente com toda a lógica original
function AuthPageInner() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    celular: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  // estados para mostrar/ocultar senhas
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);

  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (!digits) return "";

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(
        6
      )}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  };

  const unmaskPhone = (value: string): string => value.replace(/\D/g, "");

  const normalizeIdentifier = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;

    if (trimmed.includes("@")) {
      // e-mail
      return trimmed;
    }

    // telefone
    const digits = trimmed.replace(/\D/g, "");
    return digits || trimmed;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "celular") {
      newValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        // LOGIN → usa identifier = email ou telefone
        const rawIdentifier = formData.email || formData.celular;
        const identifier = normalizeIdentifier(rawIdentifier);

        const result = await login(identifier, formData.senha);

        if (result.success) {
          router.push("/");
        } else {
          setError(result.error || "Erro ao fazer login.");
        }
      } else {
        // CADASTRO
        if (formData.senha !== formData.confirmSenha) {
          setError("Senha e confirmação de senha não conferem.");
          setIsLoading(false);
          return;
        }

        const result = await register({
          firstName: formData.nome,
          lastName: formData.sobrenome,
          email: formData.email,
          password: formData.senha,
          confirmPassword: formData.confirmSenha,
          // envia apenas dígitos para o backend
          phone: unmaskPhone(formData.celular) || undefined,
        });

        if (result.success) {
          // NÃO loga automaticamente: apenas mostra mensagem e troca para Login depois de 2.5s
          setSuccessMessage(
            "Conta criada com sucesso! Redirecionando para o login..."
          );

          // limpa senhas para segurança
          setFormData((prev) => ({
            ...prev,
            senha: "",
            confirmSenha: "",
          }));

          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage("");
          }, 2500);
        } else {
          setError(result.error || "Erro ao criar conta.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const googleError = searchParams.get("googleError");
    if (googleError) {
      setError(mapGoogleErrorToMessage(googleError));
      setSuccessMessage("");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Cadastro
            </button>
          </div>

          {/* Sucesso */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              <>
                {/* Login Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      E-mail ou Celular
                    </label>
                    <input
                      type="text"
                      name="email"
                      placeholder="seu@email.com ou (99) 99999-9999"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        name="senha"
                        placeholder="••••••••"
                        value={formData.senha}
                        onChange={handleInputChange}
                        className="w-full px-4 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowLoginPassword((prev) => !prev)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/60 hover:text-foreground/90"
                        aria-label={
                          showLoginPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Signup Form */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      placeholder="João"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      name="sobrenome"
                      placeholder="Silva"
                      value={formData.sobrenome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Celular
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    placeholder="(99) 99999-9999"
                    value={formData.celular}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      name="senha"
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={handleInputChange}
                      className="w-full px-4 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSignupPassword((prev) => !prev)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/60 hover:text-foreground/90"
                      aria-label={
                        showSignupPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showSignupPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      name="confirmSenha"
                      placeholder="••••••••"
                      value={formData.confirmSenha}
                      onChange={handleInputChange}
                      className="w-full px-4 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSignupConfirmPassword((prev) => !prev)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/60 hover:text-foreground/90"
                      aria-label={
                        showSignupConfirmPassword
                          ? "Ocultar senha"
                          : "Mostrar senha"
                      }
                    >
                      {showSignupConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 accent-accent"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-foreground/70"
                  >
                    Concordo com os{" "}
                    <Link
                      href="/terms"
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      Termos de Serviço
                    </Link>
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Entrar" : "Criar Conta"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/50">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Social Login → Google */}
          <GoogleSignIn />

          {/* Toggle Message */}
          <p className="text-center text-sm text-foreground/70 mt-6">
            {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccessMessage("");
              }}
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// 🔹 Wrapper com Suspense: é ESSE que o Next usa como page
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center py-12 px-4">
            <div className="flex flex-col items-center gap-3 text-foreground/70">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Carregando...</p>
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <AuthPageInner />
    </Suspense>
  );
}