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
const API_BASE_URL = ("TURBOPACK compile-time value", "https://localhost:7105") ?? "https://localhost:7105";
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    /* ------------------------------------------------------
     Carrega PERMISSÕES do grupo do usuário
     - Usa userGroupId do token
     - Chama GET /api/admin/groups/{id}
     - Extrai modules de group.permissions[].module
  ------------------------------------------------------- */ const loadGroupPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loadGroupPermissions]": async (jwt, decoded)=>{
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
                const modules = permissions.filter({
                    "AuthProvider.useCallback[loadGroupPermissions].modules": (p)=>p && typeof p.module === "string"
                }["AuthProvider.useCallback[loadGroupPermissions].modules"]).map({
                    "AuthProvider.useCallback[loadGroupPermissions].modules": (p)=>p.module
                }["AuthProvider.useCallback[loadGroupPermissions].modules"]);
                setUser({
                    "AuthProvider.useCallback[loadGroupPermissions]": (prev)=>{
                        if (!prev) return prev;
                        return {
                            ...prev,
                            groupPermissions: permissions,
                            modules
                        };
                    }
                }["AuthProvider.useCallback[loadGroupPermissions]"]);
            } catch (err) {
                console.error("Erro ao carregar permissões do grupo:", err);
            }
        }
    }["AuthProvider.useCallback[loadGroupPermissions]"], []);
    /* ------------------------------------------------------
     Aplica token:
      - salva no localStorage
      - decodifica
      - normaliza
      - carrega permissões do grupo
  ------------------------------------------------------- */ const applyToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[applyToken]": (jwt)=>{
            if ("TURBOPACK compile-time truthy", 1) {
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
        }
    }["AuthProvider.useCallback[applyToken]"], [
        loadGroupPermissions
    ]);
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
                    void loadGroupPermissions(stored, normalized);
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], [
        loadGroupPermissions
    ]);
    // Usado no callback do Google
    const loginWithToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loginWithToken]": (jwt)=>{
            applyToken(jwt);
        }
    }["AuthProvider.useCallback[loginWithToken]"], [
        applyToken
    ]);
    /* ======================================================
     LOGIN NORMAL
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
     REGISTER NORMAL
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
     LOGOUT
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
     ADMIN CHECK (1 = comum, 2 = admin) – legado
     Agora: isAdmin = pode acessar área admin.
     Permissões finas = user.modules
     
     IMPORTANTE: Funcionários (com employeeGroupId) NÃO são admin,
     mesmo que tenham permissões para acessar o painel.
  ====================================================== */ const isAdmin = !!user && (user?.isAdmin === true || user?.isAdmin === "true" || user?.userGroupId === "2") && !user?.employeeGroupId; // Funcionários NÃO são admin
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
        lineNumber: 409,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "JRG9+mYyuH4ji8FYoYaCAfm08BE=");
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
"[project]/memoriza-frontend/lib/cart-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CART_STORAGE_KEY = "memoriza_cart_v1";
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        // garante que o que vem do storage está coerente
        return parsed.map((item)=>({
                id: String(item.id ?? crypto.randomUUID()),
                productId: String(item.productId ?? ""),
                name: String(item.name ?? "Produto"),
                imageUrl: item.imageUrl ?? null,
                price: normalizeNumber(item.price),
                quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
                sizeId: typeof item.sizeId === "number" ? item.sizeId : undefined,
                sizeName: item.sizeName ?? undefined,
                colorId: typeof item.colorId === "number" ? item.colorId : undefined,
                colorName: item.colorName ?? undefined,
                personalizationText: item.personalizationText ?? undefined
            }));
    } catch  {
        return [];
    }
}
function CartProvider({ children }) {
    _s();
    // começa sempre vazio no SSR e no cliente
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // carrega do localStorage só depois que o componente está montado (cliente)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const initial = loadInitialCart();
            setItems(initial);
        }
    }["CartProvider.useEffect"], []);
    // salva no localStorage sempre que mudar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }["CartProvider.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
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
_s(CartProvider, "OFpe5t0oz9MFBJItuO7ZFbxuhyA=");
_c = CartProvider;
function useCart() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return ctx;
}
_s1(useCart, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=memoriza-frontend_lib_069aa3c5._.js.map