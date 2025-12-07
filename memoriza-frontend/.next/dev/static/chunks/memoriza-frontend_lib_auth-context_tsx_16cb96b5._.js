(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/memoriza-frontend/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const API_BASE_URL = ("TURBOPACK compile-time value", "https://localhost:7105") ?? "https://localhost:7105";
/* ======================================================
   Decodificação do JWT (com correção de padding)
====================================================== */ function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        // padding faltante
        const pad = base64.length % 4;
        if (pad === 2) base64 += "==";
        else if (pad === 3) base64 += "=";
        const json = atob(base64);
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
/* ======================================================
   Normalização do usuário (fora do componente)
====================================================== */ function normalizeUser(decoded) {
    const provider = decoded.authProvider ?? decoded.AuthProvider ?? decoded.provider ?? "Local";
    const normalizedProvider = typeof provider === "string" ? provider.trim() : "Local";
    const firstName = decoded.firstName;
    const lastName = decoded.lastName;
    let fullName = decoded.fullName;
    if (!fullName && firstName) {
        fullName = lastName ? `${firstName} ${lastName}` : firstName;
    }
    return {
        ...decoded,
        authProvider: normalizedProvider || "Local",
        fullName
    };
}
const AuthProvider = ({ children })=>{
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Carrega token do localStorage no primeiro render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem("memoriza_token");
            if (stored) {
                const decoded = decodeJwt(stored);
                if (decoded) {
                    const normalized = normalizeUser(decoded);
                    setToken(stored);
                    setUser(normalized);
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    /* ======================================================
     Aplica token + salva no localStorage + decodifica
     (memoizado para não mudar a referência a cada render)
  ====================================================== */ const applyToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[applyToken]": (jwt)=>{
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.setItem("memoriza_token", jwt);
            }
            const decoded = decodeJwt(jwt);
            if (decoded) {
                const normalized = normalizeUser(decoded);
                setUser(normalized);
            } else {
                setUser(null);
            }
            setToken(jwt);
        }
    }["AuthProvider.useCallback[applyToken]"], []);
    // Usado no callback do Google
    const loginWithToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loginWithToken]": (jwt)=>{
            applyToken(jwt);
        }
    }["AuthProvider.useCallback[loginWithToken]"], [
        applyToken
    ]);
    /* ======================================================
     LOGIN NORMAL (memoizado)
  ====================================================== */ const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (identifier, password)=>{
            try {
                const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        identifier,
                        password
                    })
                });
                const data = await response.json();
                if (!response.ok || !data?.token) {
                    return {
                        success: false,
                        error: data?.message || "Não foi possível fazer login. Tente novamente."
                    };
                }
                applyToken(data.token);
                return {
                    success: true
                };
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                return {
                    success: false,
                    error: "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente."
                };
            }
        }
    }["AuthProvider.useCallback[login]"], [
        applyToken
    ]);
    /* ======================================================
     REGISTER NORMAL (memoizado)
  ====================================================== */ const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[register]": async (input)=>{
            try {
                const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(input)
                });
                const data = await response.json();
                if (!response.ok || !data?.token) {
                    return {
                        success: false,
                        error: data?.message || "Não foi possível criar a conta. Verifique os dados e tente novamente."
                    };
                }
                applyToken(data.token);
                return {
                    success: true
                };
            } catch (error) {
                console.error("Erro ao registrar usuário:", error);
                return {
                    success: false,
                    error: "Erro ao conectar ao servidor. Verifique sua conexão e tente novamente."
                };
            }
        }
    }["AuthProvider.useCallback[register]"], [
        applyToken
    ]);
    /* ======================================================
     LOGOUT (memoizado)
  ====================================================== */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            setToken(null);
            setUser(null);
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.removeItem("memoriza_token");
            }
        }
    }["AuthProvider.useCallback[logout]"], []);
    /* ======================================================
     Atualiza dados do usuário vindos da página de perfil
  ====================================================== */ const updateUserFromProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateUserFromProfile]": (data)=>{
            setUser({
                "AuthProvider.useCallback[updateUserFromProfile]": (prev)=>{
                    if (!prev) return prev;
                    const next = {
                        ...prev,
                        ...data
                    };
                    const fn = data.firstName ?? prev.firstName;
                    const ln = data.lastName ?? prev.lastName;
                    if (fn) {
                        next.fullName = ln ? `${fn} ${ln}` : fn;
                    }
                    return next;
                }
            }["AuthProvider.useCallback[updateUserFromProfile]"]);
        }
    }["AuthProvider.useCallback[updateUserFromProfile]"], []);
    /* ======================================================
     ADMIN CHECK (1 = comum, 2 = admin)
  ====================================================== */ const isAdmin = !!user && (user?.isAdmin === true || user?.isAdmin === "true" || user?.userGroupId === "2");
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                token,
                user,
                isAdmin,
                isLoading,
                login,
                register,
                loginWithToken,
                logout,
                updateUserFromProfile
            })
    }["AuthProvider.useMemo[value]"], [
        token,
        user,
        isAdmin,
        isLoading,
        login,
        register,
        loginWithToken,
        logout,
        updateUserFromProfile
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/lib/auth-context.tsx",
        lineNumber: 301,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "MqEUoYX5sXHH9sK2qAZPrHBMRCQ=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) {
        throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
    }
    return ctx;
};
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=memoriza-frontend_lib_auth-context_tsx_16cb96b5._.js.map