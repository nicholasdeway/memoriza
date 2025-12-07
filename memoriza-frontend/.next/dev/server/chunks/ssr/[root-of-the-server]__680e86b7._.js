module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/memoriza-frontend/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://localhost:7105") ?? "https://localhost:7105";
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
        // Decodifica Base64 para bytes
        const binaryString = atob(base64);
        // Converte bytes para UTF-8 corretamente
        const bytes = new Uint8Array(binaryString.length);
        for(let i = 0; i < binaryString.length; i++){
            bytes[i] = binaryString.charCodeAt(i);
        }
        // Decodifica UTF-8
        const json = new TextDecoder("utf-8").decode(bytes);
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
/* ======================================================
   Normalização do usuário (nome completo / provider)
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
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    /* ------------------------------------------------------
     Carrega PERMISSÕES do grupo do usuário
     - Usa userGroupId do token
     - Chama GET /api/admin/groups/{id}
     - Extrai modules de group.permissions[].module
  ------------------------------------------------------- */ const loadGroupPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (jwt, decoded)=>{
        try {
            // Prioriza employeeGroupId (funcionários) sobre userGroupId
            // Se o usuário tem employeeGroupId, é um funcionário com grupo personalizado
            const rawGroupId = decoded.employeeGroupId ?? decoded.userGroupId ?? decoded.user_group_id ?? decoded.groupId ?? decoded.group_id;
            const userGroupId = typeof rawGroupId === "number" ? String(rawGroupId) : rawGroupId;
            if (!userGroupId) return;
            const res = await fetch(`${API_BASE_URL}/api/admin/groups/${userGroupId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                }
            });
            if (!res.ok) {
                // Se não tiver permissão pra ler o próprio grupo, não quebra o app
                console.warn("Não foi possível carregar permissões do grupo:", res.status);
                return;
            }
            const groupData = await res.json();
            const permissions = Array.isArray(groupData.permissions) ? groupData.permissions : [];
            const modules = permissions.filter((p)=>p && typeof p.module === "string").map((p)=>p.module);
            setUser((prev)=>{
                if (!prev) return prev;
                return {
                    ...prev,
                    groupPermissions: permissions,
                    modules
                };
            });
        } catch (err) {
            console.error("Erro ao carregar permissões do grupo:", err);
        }
    }, []);
    /* ------------------------------------------------------
     Aplica token:
      - salva no localStorage
      - decodifica
      - normaliza
      - carrega permissões do grupo
  ------------------------------------------------------- */ const applyToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((jwt)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
    }, [
        loadGroupPermissions
    ]);
    // Carrega token do localStorage no primeiro render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
    }, [
        loadGroupPermissions
    ]);
    // Usado no callback do Google
    const loginWithToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((jwt)=>{
        applyToken(jwt);
    }, [
        applyToken
    ]);
    /* ======================================================
     LOGIN NORMAL
  ====================================================== */ const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (identifier, password)=>{
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
    }, [
        applyToken
    ]);
    /* ======================================================
     REGISTER NORMAL
  ====================================================== */ const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
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
    }, [
        applyToken
    ]);
    /* ======================================================
     LOGOUT
  ====================================================== */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setToken(null);
        setUser(null);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    /* ======================================================
     Atualiza dados do usuário vindos da página de perfil
  ====================================================== */ const updateUserFromProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        setUser((prev)=>{
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
        });
    }, []);
    /* ======================================================
     ADMIN CHECK (1 = comum, 2 = admin) – legado
     Agora: isAdmin = pode acessar área admin.
     Permissões finas = user.modules
     
     IMPORTANTE: Funcionários (com employeeGroupId) NÃO são admin,
     mesmo que tenham permissões para acessar o painel.
  ====================================================== */ const isAdmin = !!user && (user?.isAdmin === true || user?.isAdmin === "true" || user?.userGroupId === "2") && !user?.employeeGroupId; // Funcionários NÃO são admin
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            token,
            user,
            isAdmin,
            isLoading,
            login,
            register,
            loginWithToken,
            logout,
            updateUserFromProfile
        }), [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/lib/auth-context.tsx",
        lineNumber: 409,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const useAuth = ()=>{
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) {
        throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
    }
    return ctx;
};
}),
"[project]/memoriza-frontend/lib/cart-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const CART_STORAGE_KEY = "memoriza_cart_v1";
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// ==== Helpers ====
function normalizeNumber(value) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
        const normalized = value.replace(",", ".");
        const parsed = Number(normalized);
        return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}
function loadInitialCart() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function CartProvider({ children }) {
    // começa sempre vazio no SSR e no cliente
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // carrega do localStorage só depois que o componente está montado (cliente)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initial = loadInitialCart();
        setItems(initial);
    }, []);
    // salva no localStorage sempre que mudar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        items
    ]);
    const itemsCount = items.reduce((sum, item)=>sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item)=>sum + normalizeNumber(item.price) * item.quantity, 0);
    const addItem = (incoming)=>{
        const price = normalizeNumber(incoming.price);
        // chave para considerar o mesmo "tipo" de item (produto + tamanho + cor + texto)
        const matchKey = (item)=>item.productId === incoming.productId && item.sizeId === incoming.sizeId && item.colorId === incoming.colorId && (item.personalizationText ?? "") === (incoming.personalizationText ?? "");
        setItems((prev)=>{
            const existingIndex = prev.findIndex(matchKey);
            if (existingIndex >= 0) {
                const updated = [
                    ...prev
                ];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + (incoming.quantity || 1),
                    price
                };
                return updated;
            }
            const lineId = incoming.id ?? crypto.randomUUID();
            const newItem = {
                id: lineId,
                productId: incoming.productId,
                name: incoming.name,
                imageUrl: incoming.imageUrl ?? null,
                price,
                quantity: incoming.quantity > 0 ? incoming.quantity : 1,
                sizeId: incoming.sizeId,
                sizeName: incoming.sizeName,
                colorId: incoming.colorId,
                colorName: incoming.colorName,
                personalizationText: incoming.personalizationText
            };
            return [
                ...prev,
                newItem
            ];
        });
    };
    const removeItem = (lineId)=>{
        setItems((prev)=>prev.filter((item)=>item.id !== lineId));
    };
    const updateQuantity = (productId, quantity, sizeId, colorId, personalizationText)=>{
        const safeQuantity = quantity > 0 ? quantity : 1;
        setItems((prev)=>prev.map((item)=>{
                const sameProduct = item.productId === productId;
                const sameSize = (item.sizeId ?? undefined) === (sizeId ?? undefined);
                const sameColor = (item.colorId ?? undefined) === (colorId ?? undefined);
                const sameText = (item.personalizationText ?? "") === (personalizationText ?? "");
                if (!(sameProduct && sameSize && sameColor && sameText)) {
                    return item;
                }
                return {
                    ...item,
                    quantity: safeQuantity
                };
            }));
    };
    const clearCart = ()=>{
        setItems([]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            itemsCount,
            subtotal,
            addItem,
            removeItem,
            updateQuantity,
            clearCart
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/lib/cart-context.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
function useCart() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return ctx;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__680e86b7._.js.map