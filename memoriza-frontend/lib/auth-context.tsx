"use client";

import React,
{
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105";

type DecodedToken = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  userGroupId?: string;
  employeeGroupId?: string;
  isAdmin?: string | boolean;
  authProvider?: string;
  phone?: string;
  modules?: string[];
  groupPermissions?: any[];
  [key: string]: unknown;
};

type LoginResult = { success: true } | { success: false; error?: string };
type RegisterResult = { success: true } | { success: false; error?: string };

type AuthContextValue = {
  token: string | null;
  user: DecodedToken | null;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => Promise<RegisterResult>;
  loginWithToken: (jwt: string) => void;
  logout: () => void;
  updateUserFromProfile: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ======================================================
   Decodificação do JWT (com correção de padding)
====================================================== */
function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // padding
    const pad = base64.length % 4;
    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";

    // Decodifica Base64 para bytes
    const binaryString = atob(base64);
    
    // Converte bytes para UTF-8 corretamente
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decodifica UTF-8
    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ======================================================
   Normalização do usuário (nome completo / provider)
====================================================== */
function normalizeUser(decoded: DecodedToken): DecodedToken {
  const provider =
    decoded.authProvider ??
    (decoded as any).AuthProvider ??
    (decoded as any).provider ??
    "Local";

  const normalizedProvider =
    typeof provider === "string" ? provider.trim() : "Local";

  const firstName = decoded.firstName as string | undefined;
  const lastName = decoded.lastName as string | undefined;

  let fullName = decoded.fullName as string | undefined;
  if (!fullName && firstName) {
    fullName = lastName ? `${firstName} ${lastName}` : firstName;
  }

  return {
    ...decoded,
    authProvider: normalizedProvider || "Local",
    fullName,
  };
}

/* ======================================================
   AuthProvider
====================================================== */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroupPermissions = useCallback(
    async (jwt: string, decoded: DecodedToken) => {
      try {
        // Prioriza employeeGroupId (funcionários) sobre userGroupId
        // Se o usuário tem employeeGroupId, é um funcionário com grupo personalizado
        const rawGroupId =
          decoded.employeeGroupId ??
          decoded.userGroupId ??
          (decoded as any).user_group_id ??
          (decoded as any).groupId ??
          (decoded as any).group_id;

        const userGroupId =
          typeof rawGroupId === "number"
            ? String(rawGroupId)
            : (rawGroupId as string | undefined);

        if (!userGroupId) return;

        const res = await fetch(
          `${API_BASE_URL}/api/admin/groups/${userGroupId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!res.ok) {
          console.warn("Não foi possível carregar permissões do grupo:", res.status);
          return;
        }

        const groupData = await res.json();

        const permissions = Array.isArray(groupData.permissions)
          ? groupData.permissions
          : [];

        const modules = permissions
          .filter((p: any) => p && typeof p.module === "string")
          .map((p: any) => p.module as string);

        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            groupPermissions: permissions,
            modules,
          };
        });
      } catch (err) {
        console.error("Erro ao carregar permissões do grupo:", err);
      }
    },
    []
  );

  const applyToken = useCallback(
    (jwt: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("memoriza_token", jwt);
      }

      const decoded = decodeJwt(jwt);
      if (decoded) {
        const normalized = normalizeUser(decoded);
        setToken(jwt);
        setUser(normalized);

        // carrega permissões do grupo em background
        void loadGroupPermissions(jwt, normalized);
      } else {
        setToken(null);
        setUser(null);
      }
    },
    [loadGroupPermissions]
  );

  // Carrega token do localStorage no primeiro render
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("memoriza_token");
    if (stored) {
      const decoded = decodeJwt(stored);
      if (decoded) {
        const normalized = normalizeUser(decoded);
        setToken(stored);
        setUser(normalized);

        void loadGroupPermissions(stored, normalized);
      }
    }
    setIsLoading(false);
  }, [loadGroupPermissions]);

  // Usado no callback do Google
  const loginWithToken = useCallback(
    (jwt: string) => {
      applyToken(jwt);
    },
    [applyToken]
  );

  /* ======================================================
     LOGIN NORMAL
  ====================================================== */
  const login = useCallback(
    async (identifier: string, password: string): Promise<LoginResult> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        });

        const data = await response.json();
        if (!response.ok || !data?.token) {
          return {
            success: false,
            error:
              data?.message ||
              "Não foi possível fazer login. Tente novamente.",
          };
        }

        applyToken(data.token);
        return { success: true };
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        return {
          success: false,
          error:
            "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente.",
        };
      }
    },
    [applyToken]
  );

  /* ======================================================
     REGISTER NORMAL
  ====================================================== */
  const register = useCallback(
    async (input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone?: string;
    }): Promise<RegisterResult> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const data = await response.json();
        if (!response.ok || !data?.token) {
          return {
            success: false,
            error:
              data?.message ||
              "Não foi possível criar a conta. Verifique os dados e tente novamente.",
          };
        }

        applyToken(data.token);
        return { success: true };
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return {
          success: false,
          error:
            "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente.",
        };
      }
    },
    [applyToken]
  );

  /* ======================================================
     LOGOUT
  ====================================================== */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("memoriza_token");
    }
  }, []);

  /* ======================================================
     Atualiza dados do usuário vindos da página de perfil
  ====================================================== */
  const updateUserFromProfile = useCallback(
    (data: { firstName?: string; lastName?: string; email?: string; phone?: string }) => {
      setUser((prev) => {
        if (!prev) return prev;

        const next: DecodedToken = {
          ...prev,
          ...data,
        };

        const fn = (data.firstName ?? prev.firstName) as string | undefined;
        const ln = (data.lastName ?? prev.lastName) as string | undefined;

        if (fn) {
          next.fullName = ln ? `${fn} ${ln}` : fn;
        }

        return next;
      });
    },
    []
  );

  /*
     ADMIN CHECK (1 = comum, 2 = admin) – legado
     isAdmin = pode acessar área admin.
     Permissões finas = user.modules
     
     funcionários (com employeeGroupId) não são admin,
     mesmo que tenham permissões para acessar o painel.
  */
  const isAdmin =
    !!user &&
    (user?.isAdmin === true ||
      user?.isAdmin === "true" ||
      user?.userGroupId === "2") &&
    !user?.employeeGroupId;

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAdmin,
      isLoading,
      login,
      register,
      loginWithToken,
      logout,
      updateUserFromProfile,
    }),
    [
      token,
      user,
      isAdmin,
      isLoading,
      login,
      register,
      loginWithToken,
      logout,
      updateUserFromProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return ctx;
};