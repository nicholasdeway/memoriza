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

const API_BASE_URL = "/api-proxy";

type DecodedToken = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userGroupId: number;
  employeeGroupId?: string | null;
  isAdmin: boolean;
  authProvider: string;
  phone?: string;
  pictureUrl?: string;
  modules?: string[];
  groupPermissions?: any[];
  [key: string]: unknown;
};

type LoginResult = { success: true } | { success: false; error?: string };
type RegisterResult = { success: true } | { success: false; error?: string };

type AuthContextValue = {
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
  checkAuth: () => Promise<void>;
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
   AuthProvider
====================================================== */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroupPermissions = useCallback(
    async (decoded: DecodedToken) => {
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
            },
            credentials: "include", // Envia cookie
          }
        );

        if (!res.ok) {
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
        // Silently handle permission loading errors
      }
    },
    []
  );

  /* ======================================================
     Função auxiliar para buscar dados do usuário (/me)
  ====================================================== */
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Auth/me`, {
        credentials: "include", // Envia cookie
      });

      if (!res.ok) {
        if (res.status === 401) {
           return null;
        }
        throw new Error("Falha ao buscar perfil");
      }

      const profile = await res.json();
      return profile as DecodedToken;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
    }
  }, []);

  /* ======================================================
     Verifica Autenticação (Cookie)
  ====================================================== */
  const checkAuth = useCallback(async () => {
    const profile = await fetchUserProfile();
    if (profile) {
      setUser(profile);
      void loadGroupPermissions(profile);
    } else {
      setUser(null);
    }
  }, [fetchUserProfile, loadGroupPermissions]);

  // Checa no mount
  useEffect(() => {
    const initAuth = async () => {
      // Limpeza de legado
      if (typeof window !== "undefined") {
        localStorage.removeItem("memoriza_token");
      }
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

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
          credentials: "include", // Recebe cookie
        });

        const data = await response.json();
        if (!response.ok) {
          return {
            success: false,
            error:
              data?.message ||
              "Não foi possível fazer login. Tente novamente.",
          };
        }

        await checkAuth();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente.",
        };
      }
    },
    [checkAuth]
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
          credentials: "include", // Recebe cookie
        });

        const data = await response.json();
        if (!response.ok) {
          return {
            success: false,
            error:
              data?.message ||
              "Não foi possível criar a conta. Certifique-se de que a senha tenha no mínimo 8 caracteres.",
          };
        }

        await checkAuth();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente.",
        };
      }
    },
    [checkAuth]
  );

  /* ======================================================
     LOGOUT
  ====================================================== */
  const logout = useCallback(async () => {
    try {
        await fetch(`${API_BASE_URL}/api/Auth/logout`, {
            method: "POST",
            credentials: "include"
        });
    } catch (e) {
        console.error("Erro ao fazer logout no backend", e);
    }
    setUser(null);
    if (typeof window !== "undefined") {
        window.location.href = "/auth/login"; // Força recarregamento/redirect limpo
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
     ADMIN CHECK
  */
  const isAdmin =
    !!user &&
    (user.isAdmin === true || user.userGroupId === 2) &&
    !user.employeeGroupId;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin,
      isLoading,
      login,
      register,
      checkAuth,
      logout,
      updateUserFromProfile,
    }),
    [
      user,
      isAdmin,
      isLoading,
      login,
      register,
      checkAuth,
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