"use client";

import { useState, useEffect } from "react";
import { User, Lock, Trash2, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105";

// Corrige nomes com encoding zoado: AlvÃ¡ro -> Álvaro
function fixEncoding(value?: string): string {
  if (!value) return "";
  try {
    const decoded = decodeURIComponent(escape(value));
    return decoded;
  } catch {
    return value;
  }
}

type UserProfileApiResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  createdAt: string;
};

type UpdateProfileBody = {
  FirstName: string;
  LastName: string;
  Phone: string | null;
  Email?: string | null;
};

type ErrorResponse = {
  message?: string;
};

export default function PerfilPage() {
  const { user, token, logout, updateUserFromProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"dados" | "senha" | "excluir">(
    "dados"
  );

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);

  const [senhaExcluir, setSenhaExcluir] = useState("");
  const [motivoExcluir, setMotivoExcluir] = useState("");

  const [savedDados, setSavedDados] = useState(false);
  const [savedSenha, setSavedSenha] = useState(false);

  const [erroDados, setErroDados] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroExcluir, setErroExcluir] = useState("");
  const [msgExcluir, setMsgExcluir] = useState("");

  const [loadingDados, setLoadingDados] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [loadingExcluir, setLoadingExcluir] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  const [showSenhaAlterada, setShowSenhaAlterada] = useState(false);
  const [openExcluirDialog, setOpenExcluirDialog] = useState(false);

  // formata para exibir no input: (22) 99754-0815
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 11); // máximo 11 dígitos

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

  // Sinaliza quando o componente já está montado no browser
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Se depois de hidratado não houver token, manda pro login
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push("/auth/login");
    }
  }, [hydrated, token, router]);

  // Conta Google x Local (vem do token/contexto)
  const isGoogleAccount =
    typeof user?.authProvider === "string" &&
    user.authProvider.toLowerCase() === "google";

  // Carrega dados reais do perfil pela API: GET /api/user/me
  useEffect(() => {
    if (!hydrated || !token) return;

    const fetchProfile = async () => {
      try {
        setLoadingDados(true);
        setErroDados("");

        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("Erro ao buscar perfil:", res.status);
          setErroDados("Não foi possível carregar seus dados de perfil.");
          return;
        }

        const data = (await res.json()) as UserProfileApiResponse;

        setNome(fixEncoding(data.firstName));
        setSobrenome(fixEncoding(data.lastName));
        setEmail(data.email ?? "");
        setCelular(formatPhone(data.phone ?? ""));

        // Sincroniza com o contexto → header atualiza
        updateUserFromProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone ?? undefined,
        });
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setErroDados("Erro ao conectar ao servidor. Tente novamente.");
      } finally {
        setLoadingDados(false);
      }
    };

    fetchProfile();
  }, [hydrated, token, updateUserFromProfile]);

  if (!hydrated) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <p className="text-foreground/60">Carregando...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-background border border-border rounded-xl p-12 text-center">
        <p className="text-foreground/60">Redirecionando...</p>
      </div>
    );
  }

  // === PUT /api/user/profile ===
  const handleSaveDados = async () => {
    setErroDados("");
    setSavedDados(false);

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingDados(true);

      const phoneToSend = unmaskPhone(celular);

      const body: UpdateProfileBody = {
        FirstName: nome,
        LastName: sobrenome,
        Phone: phoneToSend || null,
      };

      // Para conta LOCAL, permite troca de e-mail
      if (!isGoogleAccount) {
        body.Email = email || null;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      console.log("UPDATE PROFILE RESPONSE", response.status, data);

      if (!response.ok) {
        let message = "Não foi possível salvar os dados.";

        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          if (typeof first === "string") {
            message = first;
          }
        } else if (data && typeof data === "object") {
          const obj = data as ErrorResponse;
          if (obj.message) {
            message = obj.message;
          }
        }

        // Verifica se é erro de número duplicado e exibe toast e mensagem específica
        if (message.includes("Já existe uma conta cadastrada com este número")) {
          const mensagemEspecifica = "Este número de celular já está cadastrado em outra conta.";
          toast({
            title: "Número já cadastrado",
            description: mensagemEspecifica,
            variant: "destructive",
          });
          setErroDados(mensagemEspecifica);
        } else {
          setErroDados(message);
        }
        
        return;
      }

      // Se o backend já retorna o perfil atualizado, usamos pra refletir na tela
      if (data && typeof data === "object") {
        const profile = data as Partial<UserProfileApiResponse>;

        if (typeof profile.firstName === "string") {
          setNome(fixEncoding(profile.firstName));
        }
        if (typeof profile.lastName === "string") {
          setSobrenome(fixEncoding(profile.lastName));
        }
        if (typeof profile.phone === "string") {
          setCelular(formatPhone(profile.phone));
        }
        if (typeof profile.email === "string") {
          setEmail(profile.email);
        }

        updateUserFromProfile({
          firstName: profile.firstName ?? nome,
          lastName: profile.lastName ?? sobrenome,
          email: profile.email ?? email,
          phone: profile.phone ?? phoneToSend,
        });
      } else {
        // fallback caso a API não retorne o objeto
        updateUserFromProfile({
          firstName: nome,
          lastName: sobrenome,
          email: isGoogleAccount ? user?.email : email,
          phone: phoneToSend,
        });
      }

      setSavedDados(true);
      setTimeout(() => setSavedDados(false), 2000);
    } catch (error) {
      console.error("Erro ao salvar dados de perfil:", error);
      setErroDados("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoadingDados(false);
    }
  };

  // === PUT /api/user/change-password ===
  const handleChangeSenha = async () => {
    setErroSenha("");
    setSavedSenha(false);
    setShowSenhaAlterada(false);

    // mesma regra: Google NÃO pode trocar senha
    if (isGoogleAccount) {
      setErroSenha(
        "Sua conta está conectada ao Google. A senha é gerenciada pelo Google e não pode ser alterada aqui."
      );
      return;
    }

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.");
      return;
    }

    if (!token) {
      setErroSenha("Sessão expirada. Faça login novamente.");
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingSenha(true);

      const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: senhaAtual,
          newPassword: novaSenha,
          confirmNewPassword: confirmarSenha,
        }),
      });

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let message = "Não foi possível alterar a senha.";

        if (data && typeof data === "object") {
          const obj = data as ErrorResponse;
          if (obj.message) {
            message = obj.message;
          }
        }

        setErroSenha(message);
        return;
      }

      setSavedSenha(true);
      setShowSenhaAlterada(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        setShowSenhaAlterada(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErroSenha("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleExcluirConta = async () => {
    setErroExcluir("");
    setMsgExcluir("");

    // Conta local → exige senha
    if (!isGoogleAccount && !senhaExcluir) {
      setErroExcluir("Digite sua senha para confirmar a exclusão.");
      return;
    }

    if (!token) {
      setErroExcluir("Sessão expirada. Faça login novamente.");
      router.push("/auth/login");
      return;
    }

    try {
      setLoadingExcluir(true);

      const response = await fetch(`${API_BASE_URL}/api/user/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: isGoogleAccount ? null : senhaExcluir,
          reason: motivoExcluir || null,
        }),
      });

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let message =
          "Não foi possível excluir a conta. Verifique sua senha.";

        if (data && typeof data === "object") {
          const obj = data as ErrorResponse;
          if (obj.message) {
            message = obj.message;
          }
        }

        setErroExcluir(message);
        return;
      }

      setMsgExcluir("Conta excluída com sucesso.");

      logout();
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setErroExcluir("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoadingExcluir(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("dados")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "dados"
              ? "text-foreground border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <User size={18} />
          Meus Dados
        </button>
        <button
          onClick={() => setActiveTab("senha")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "senha"
              ? "text-foreground border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Lock size={18} />
          Alterar Senha
        </button>
        <button
          onClick={() => setActiveTab("excluir")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === "excluir"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-foreground/60 hover:text-red-500"
          }`}
        >
          <Trash2 size={18} />
          Excluir Conta
        </button>
      </div>

      <div className="p-6">
        {/* Meus Dados Tab */}
        {activeTab === "dados" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium text-foreground mb-2">
                Informações Pessoais
              </h2>
              <p className="text-sm text-foreground/60">
                Atualize suas informações de perfil
              </p>

              <p className="mt-2 text-xs text-foreground/60">
                Tipo de conta:{" "}
                <span className="font-medium">
                  {isGoogleAccount ? "Conectada ao Google" : "E-mail e senha"}
                </span>
              </p>
            </div>

            {erroDados && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {erroDados}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* E-mail: editável só para conta Local */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={
                  isGoogleAccount ? undefined : (e) => setEmail(e.target.value)
                }
                disabled={isGoogleAccount}
                className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none ${
                  isGoogleAccount
                    ? "bg-muted text-foreground/70 cursor-not-allowed"
                    : "bg-background focus:border-accent"
                }`}
              />
              {isGoogleAccount && (
                <p className="mt-1 text-xs text-foreground/60">
                  Este e-mail é gerenciado pela sua conta Google e não pode ser
                  alterado aqui.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Celular
              </label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(formatPhone(e.target.value))}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                placeholder="(34) 98832-7006"
              />
            </div>

            <button
              onClick={handleSaveDados}
              disabled={loadingDados}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {savedDados ? <Check size={18} /> : null}
              {loadingDados
                ? "Salvando..."
                : savedDados
                ? "Salvo!"
                : "Salvar Alterações"}
            </button>
            {savedDados && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
                <Check size={18} className="text-emerald-700" />
                <span>Sua conta foi atualizada com sucesso!</span>
              </div>
            )}
          </div>
        )}

        {/* Alterar Senha Tab */}
        {activeTab === "senha" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-xl font-medium text-foreground mb-2">
                Alterar Senha
              </h2>
              <p className="text-sm text-foreground/60">
                {isGoogleAccount
                  ? "Sua conta está conectada ao Google. A senha é gerenciada pelo Google e não pode ser alterada aqui."
                  : "Atualize sua senha de acesso"}
              </p>
            </div>

            {erroSenha && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {erroSenha}
              </p>
            )}

            {isGoogleAccount ? (
              // Conta Google → não mostra campos de senha
              <div className="mt-2 rounded-md border border-border bg-muted px-3 py-3 text-sm text-foreground/70">
                Para alterar o método de acesso, remova ou ajuste o login com
                Google diretamente nas configurações da sua conta Google.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showSenhaAtual ? "text" : "password"}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                    >
                      {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNovaSenha ? "text" : "password"}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNovaSenha(!showNovaSenha)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                    >
                      {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNovaSenha ? "text" : "password"}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNovaSenha(!showNovaSenha)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                    >
                      {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {showSenhaAlterada && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm transition-all duration-300 animate-[fadeIn_0.2s_ease-out]">
                    <Check size={18} className="text-emerald-700" />
                    <span>Sua senha foi alterada com sucesso!</span>
                  </div>
                )}

                <button
                  onClick={handleChangeSenha}
                  disabled={loadingSenha}
                  className="mt-2 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loadingSenha ? "Salvando..." : "Alterar Senha"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Excluir Conta Tab */}
        {activeTab === "excluir" && (
          <div className="space-y-6 max-w-md">
            <div>
              <h2 className="text-xl font-medium text-red-500 mb-2">
                Excluir Conta
              </h2>
              <p className="text-sm text-foreground/60">
                Esta ação é irreversível. Todos os seus dados serão
                permanentemente excluídos.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">Ao excluir sua conta:</p>
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                <li>Todos os seus pedidos serão desvinculados</li>
                <li>Seus endereços salvos serão removidos</li>
                <li>Você perderá acesso a todo histórico</li>
              </ul>
            </div>

            {erroExcluir && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {erroExcluir}
              </p>
            )}

            {msgExcluir && (
              <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                {msgExcluir}
              </p>
            )}

            {/* Campo de senha apenas para conta local */}
            {!isGoogleAccount && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sua senha
                </label>
                <input
                  type="password"
                  value={senhaExcluir}
                  onChange={(e) => setSenhaExcluir(e.target.value)}
                  className="w-full px-4 py-3 border border-red-300 rounded-lg bg-background focus:outline-none focus:border-red-500"
                  placeholder="Digite sua senha atual"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Motivo (opcional)
              </label>
              <textarea
                value={motivoExcluir}
                onChange={(e) => setMotivoExcluir(e.target.value)}
                className="w-full min-h-[80px] px-4 py-3 border border-red-200 rounded-lg bg-background focus:outline-none focus:border-red-400 text-sm resize-none"
                placeholder="Conte rapidamente o motivo da exclusão. Isso nos ajuda a melhorar."
              />
            </div>

            <AlertDialog
              open={openExcluirDialog}
              onOpenChange={setOpenExcluirDialog}
            >
              <AlertDialogTrigger asChild>
                <button
                  disabled={loadingExcluir || (!isGoogleAccount && !senhaExcluir)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Excluir Minha Conta
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não poderá ser desfeita. Sua conta será
                    desativada e você perderá acesso ao seu histórico, pedidos e
                    dados salvos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loadingExcluir}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await handleExcluirConta();
                    }}
                    disabled={loadingExcluir || (!isGoogleAccount && !senhaExcluir)}
                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                  >
                    {loadingExcluir
                      ? "Excluindo..."
                      : "Sim, excluir minha conta"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}