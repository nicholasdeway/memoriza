(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105";
function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
const AuthProvider = ({ children })=>{
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Carrega token do localStorage no primeiro render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem("memoriza_token");
            if (stored) {
                setToken(stored);
                const decoded = decodeJwt(stored);
                if (decoded) setUser(decoded);
            }
        }
    }["AuthProvider.useEffect"], []);
    const applyToken = (jwt)=>{
        setToken(jwt);
        if ("TURBOPACK compile-time truthy", 1) {
            window.localStorage.setItem("memoriza_token", jwt);
        }
        const decoded = decodeJwt(jwt);
        if (decoded) setUser(decoded);
    };
    const loginWithToken = (jwt)=>{
        applyToken(jwt);
    };
    const login = async (identifier, password)=>{
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
            if (!response.ok) {
                return {
                    success: false,
                    error: data?.message || "Não foi possível fazer login. Tente novamente."
                };
            }
            if (!data?.token) {
                return {
                    success: false,
                    error: "Resposta inválida do servidor. Token não encontrado."
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
    };
    const register = async (input)=>{
        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data?.message || "Não foi possível criar a conta. Verifique os dados e tente novamente."
                };
            }
            if (!data?.token) {
                return {
                    success: false,
                    error: "Resposta inválida do servidor. Token não encontrado após o cadastro."
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
    };
    const logout = ()=>{
        setToken(null);
        setUser(null);
        if ("TURBOPACK compile-time truthy", 1) {
            window.localStorage.removeItem("memoriza_token");
        }
    };
    // UsuarioComum = 1, Admin = 2
    const isAdmin = !!user && (user.isAdmin === true || user.isAdmin === "true" || user.userGroupId === "2");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            token,
            user,
            isAdmin,
            login,
            register,
            loginWithToken,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "lTc4oKMP/OVEHM3fW8W5olMCd7E=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
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

//# sourceMappingURL=lib_auth-context_tsx_adec1d04._.js.map