(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Banco de Dados de Usuários Mock
__turbopack_context__.s([
    "mockBestSellers",
    ()=>mockBestSellers,
    "mockCategories",
    ()=>mockCategories,
    "mockColors",
    ()=>mockColors,
    "mockDashboardMetrics",
    ()=>mockDashboardMetrics,
    "mockOrders",
    ()=>mockOrders,
    "mockProducts",
    ()=>mockProducts,
    "mockSalesData",
    ()=>mockSalesData,
    "mockSizes",
    ()=>mockSizes,
    "mockUserAddresses",
    ()=>mockUserAddresses,
    "mockUsers",
    ()=>mockUsers,
    "orderStatusColors",
    ()=>orderStatusColors,
    "orderStatusLabels",
    ()=>orderStatusLabels
]);
const mockUsers = [
    {
        id: "1",
        nome: "Admin",
        sobrenome: "Memoriza",
        email: "admin@memoriza.com",
        celular: "(11) 99999-0001",
        senha: "admin123",
        role: "admin",
        createdAt: "2024-01-01"
    },
    {
        id: "2",
        nome: "Maria",
        sobrenome: "Silva",
        email: "maria@email.com",
        celular: "(11) 99999-0002",
        senha: "user123",
        role: "user",
        createdAt: "2024-06-15",
        addresses: [
            {
                id: "addr1",
                label: "Casa",
                firstName: "Maria",
                lastName: "Silva",
                address: "Rua das Flores, 123",
                city: "São Paulo",
                state: "SP",
                zipCode: "01234-567",
                phone: "(11) 99999-0002"
            },
            {
                id: "addr2",
                label: "Trabalho",
                firstName: "Maria",
                lastName: "Silva",
                address: "Av. Paulista, 1000, Sala 404",
                city: "São Paulo",
                state: "SP",
                zipCode: "01310-100",
                phone: "(11) 99999-0002"
            }
        ]
    },
    {
        id: "3",
        nome: "João",
        sobrenome: "Santos",
        email: "joao@email.com",
        celular: "(11) 99999-0003",
        senha: "user123",
        role: "user",
        createdAt: "2024-08-20"
    }
];
const mockCategories = [
    {
        id: "1",
        nome: "Kits com Desconto",
        slug: "kits-desconto",
        produtosCount: 12,
        ativo: true
    },
    {
        id: "2",
        nome: "Identidade Visual",
        slug: "identidade-visual",
        produtosCount: 8,
        ativo: true
    },
    {
        id: "3",
        nome: "Papelaria Personalizada",
        slug: "papelaria-personalizada",
        produtosCount: 24,
        ativo: true
    },
    {
        id: "4",
        nome: "Pronta Entrega",
        slug: "pronta-entrega",
        produtosCount: 15,
        ativo: true
    },
    {
        id: "5",
        nome: "Embalagens",
        slug: "embalagens",
        produtosCount: 18,
        ativo: true
    },
    {
        id: "6",
        nome: "Perfume p/ Embalagem",
        slug: "perfume-embalagem",
        produtosCount: 6,
        ativo: true
    },
    {
        id: "7",
        nome: "Artes Digitais Personalizadas",
        slug: "artes-digitais",
        produtosCount: 20,
        ativo: false
    }
];
const mockSizes = [
    {
        id: "1",
        nome: "P",
        ativo: true
    },
    {
        id: "2",
        nome: "M",
        ativo: true
    },
    {
        id: "3",
        nome: "G",
        ativo: true
    },
    {
        id: "4",
        nome: "GG",
        ativo: true
    },
    {
        id: "5",
        nome: "Único",
        ativo: true
    }
];
const mockColors = [
    {
        id: "1",
        nome: "Preto",
        codigoHex: "#000000",
        ativo: true,
        createdAt: "2024-01-01"
    },
    {
        id: "2",
        nome: "Branco",
        codigoHex: "#FFFFFF",
        ativo: true,
        createdAt: "2024-01-01"
    },
    {
        id: "3",
        nome: "Cinza",
        codigoHex: "#808080",
        ativo: true,
        createdAt: "2024-01-01"
    },
    {
        id: "4",
        nome: "Azul Marinho",
        codigoHex: "#000080",
        ativo: true,
        createdAt: "2024-01-01"
    },
    {
        id: "5",
        nome: "Vermelho",
        codigoHex: "#FF0000",
        ativo: true,
        createdAt: "2024-01-01"
    }
];
const mockProducts = [
    {
        id: "1",
        nome: "Kit Papelaria Premium",
        preco: 189.9,
        precoPromocional: 149.9,
        categoria: "Kits com Desconto",
        categoriaId: "1",
        tamanhos: [
            "5"
        ],
        cores: [
            "1",
            "2",
            "3"
        ],
        status: "ativo",
        personalizavel: true,
        descricao: "Kit completo de papelaria personalizada com cartões, tags e adesivos.",
        imagens: [
            "/premium-stationery-kit.jpg"
        ],
        createdAt: "2024-10-01"
    },
    {
        id: "2",
        nome: "Cartão de Visita Luxo",
        preco: 89.9,
        precoPromocional: null,
        categoria: "Identidade Visual",
        categoriaId: "2",
        tamanhos: [],
        cores: [
            "1",
            "2"
        ],
        status: "ativo",
        personalizavel: true,
        descricao: "Cartões de visita em papel especial com acabamento premium.",
        imagens: [
            "/luxury-business-cards.jpg"
        ],
        createdAt: "2024-10-05"
    },
    {
        id: "3",
        nome: "Tags Personalizadas",
        preco: 49.9,
        precoPromocional: 39.9,
        categoria: "Papelaria Personalizada",
        categoriaId: "3",
        tamanhos: [],
        cores: [
            "1",
            "2",
            "5"
        ],
        status: "ativo",
        personalizavel: true,
        descricao: "Tags personalizadas para embalagens e presentes.",
        imagens: [
            "/personalized-tags-labels.jpg"
        ],
        createdAt: "2024-10-10"
    },
    {
        id: "4",
        nome: "Caixa Gift Box",
        preco: 129.9,
        precoPromocional: null,
        categoria: "Embalagens",
        categoriaId: "5",
        tamanhos: [],
        cores: [
            "3"
        ],
        status: "ativo",
        personalizavel: false,
        descricao: "Caixa de presente premium com acabamento em papel kraft.",
        imagens: [
            "/premium-gift-box-packaging.jpg"
        ],
        createdAt: "2024-10-15"
    },
    {
        id: "5",
        nome: "Adesivos Personalizados",
        preco: 29.9,
        precoPromocional: null,
        categoria: "Papelaria Personalizada",
        categoriaId: "3",
        tamanhos: [],
        cores: [
            "1",
            "2",
            "3",
            "4",
            "5"
        ],
        status: "ativo",
        personalizavel: true,
        descricao: "Adesivos personalizados em vinil de alta qualidade.",
        imagens: [
            "/custom-stickers-labels.jpg"
        ],
        createdAt: "2024-10-20"
    },
    {
        id: "6",
        nome: "Perfume para Embalagem Rose",
        preco: 59.9,
        precoPromocional: null,
        categoria: "Perfume p/ Embalagem",
        categoriaId: "6",
        tamanhos: [],
        cores: [],
        status: "ativo",
        personalizavel: false,
        descricao: "Perfume delicado com notas de rosa para suas embalagens.",
        imagens: [
            "/packaging-perfume-rose.jpg"
        ],
        createdAt: "2024-11-01"
    },
    {
        id: "7",
        nome: "Logo Digital Personalizado",
        preco: 199.9,
        precoPromocional: 159.9,
        categoria: "Artes Digitais Personalizadas",
        categoriaId: "7",
        tamanhos: [],
        cores: [],
        status: "inativo",
        personalizavel: true,
        descricao: "Design de logo personalizado para sua marca.",
        imagens: [
            "/custom-logo-design.jpg"
        ],
        createdAt: "2024-11-05"
    }
];
const orderStatusLabels = {
    aprovado: "Aprovado",
    em_producao: "Em Produção",
    a_caminho: "À Caminho",
    entregue: "Entregue",
    reembolsado: "Reembolsado",
    cancelado: "Cancelado"
};
const orderStatusColors = {
    aprovado: "bg-green-100 text-green-700",
    em_producao: "bg-blue-100 text-blue-700",
    a_caminho: "bg-purple-100 text-purple-700",
    entregue: "bg-emerald-100 text-emerald-700",
    reembolsado: "bg-orange-100 text-orange-700",
    cancelado: "bg-red-100 text-red-700"
};
const mockOrders = [
    {
        id: "MEM-00000001",
        clienteId: "2",
        clienteNome: "Maria Silva",
        clienteEmail: "maria@email.com",
        clienteCelular: "(11) 99999-0002",
        items: [
            {
                produtoId: "1",
                produtoNome: "Kit Papelaria Premium",
                quantidade: 2,
                precoUnitario: 149.9
            },
            {
                produtoId: "3",
                produtoNome: "Tags Personalizadas",
                quantidade: 1,
                precoUnitario: 39.9
            }
        ],
        subtotal: 339.7,
        frete: 0,
        total: 339.7,
        status: "entregue",
        codigoRastreio: "BR123456789BR",
        transportadora: "Correios",
        urlRastreamento: "https://rastreamento.correios.com.br/app/index.php",
        endereco: {
            rua: "Rua das Flores, 123",
            bairro: "Jardim Primavera",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567"
        },
        pagamento: "Cartão de Crédito",
        createdAt: "2024-11-10",
        updatedAt: "2024-11-15"
    },
    {
        id: "MEM-00000002",
        clienteId: "2",
        clienteNome: "Maria Silva",
        clienteEmail: "maria@email.com",
        clienteCelular: "(11) 99999-0002",
        items: [
            {
                produtoId: "4",
                produtoNome: "Caixa Gift Box",
                quantidade: 5,
                precoUnitario: 129.9
            }
        ],
        subtotal: 649.5,
        frete: 0,
        total: 649.5,
        status: "a_caminho",
        codigoRastreio: "BR987654321BR",
        transportadora: "Correios",
        urlRastreamento: "https://rastreamento.correios.com.br/app/index.php",
        endereco: {
            rua: "Av. Brasil, 456",
            bairro: "Centro",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            cep: "20000-000"
        },
        pagamento: "PIX",
        createdAt: "2024-11-20",
        updatedAt: "2024-11-22"
    },
    {
        id: "MEM-00000003",
        clienteId: "2",
        clienteNome: "Maria Silva",
        clienteEmail: "maria@email.com",
        clienteCelular: "(11) 99999-0002",
        items: [
            {
                produtoId: "2",
                produtoNome: "Cartão de Visita Luxo",
                quantidade: 2,
                precoUnitario: 89.9
            },
            {
                produtoId: "5",
                produtoNome: "Adesivos Personalizados",
                quantidade: 3,
                precoUnitario: 29.9
            }
        ],
        subtotal: 269.5,
        frete: 15.0,
        total: 284.5,
        status: "em_producao",
        endereco: {
            rua: "Rua das Flores, 123",
            bairro: "Jardim Primavera",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567"
        },
        pagamento: "Boleto",
        createdAt: "2024-11-25",
        updatedAt: "2024-11-25"
    },
    {
        id: "MEM-00000004",
        clienteId: "3",
        clienteNome: "João Santos",
        clienteEmail: "joao@email.com",
        clienteCelular: "(11) 99999-0003",
        items: [
            {
                produtoId: "6",
                produtoNome: "Perfume para Embalagem Rose",
                quantidade: 2,
                precoUnitario: 59.9
            }
        ],
        subtotal: 119.8,
        frete: 25.0,
        total: 144.8,
        status: "aprovado",
        endereco: {
            rua: "Av. Brasil, 456",
            bairro: "Centro",
            cidade: "Rio de Janeiro",
            estado: "RJ",
            cep: "20000-000"
        },
        pagamento: "Cartão de Crédito",
        createdAt: "2024-11-27",
        updatedAt: "2024-11-27"
    },
    {
        id: "MEM-00000005",
        clienteId: "2",
        clienteNome: "Maria Silva",
        clienteEmail: "maria@email.com",
        clienteCelular: "(11) 99999-0002",
        items: [
            {
                produtoId: "1",
                produtoNome: "Kit Papelaria Premium",
                quantidade: 1,
                precoUnitario: 149.9
            }
        ],
        subtotal: 149.9,
        frete: 20.0,
        total: 169.9,
        status: "cancelado",
        endereco: {
            rua: "Rua das Flores, 123",
            bairro: "Jardim Primavera",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567"
        },
        pagamento: "PIX",
        createdAt: "2024-11-15",
        updatedAt: "2024-11-16"
    }
];
const mockDashboardMetrics = {
    vendasTotal: 45320.0,
    vendasMesAtual: 12450.0,
    pedidosTotal: 156,
    pedidosMesAtual: 42,
    reembolsos: 3,
    reembolsosValor: 520.0,
    clientesTotal: 89,
    ticketMedio: 290.51
};
const mockSalesData = [
    {
        mes: "Jun",
        vendas: 8500
    },
    {
        mes: "Jul",
        vendas: 9200
    },
    {
        mes: "Ago",
        vendas: 7800
    },
    {
        mes: "Set",
        vendas: 10500
    },
    {
        mes: "Out",
        vendas: 11200
    },
    {
        mes: "Nov",
        vendas: 12450
    }
];
const mockBestSellers = [
    {
        nome: "Kit Papelaria Premium",
        vendas: 45,
        receita: 6745.5
    },
    {
        nome: "Caixa Gift Box",
        vendas: 38,
        receita: 4936.2
    },
    {
        nome: "Cartão de Visita Luxo",
        vendas: 32,
        receita: 2876.8
    },
    {
        nome: "Tags Personalizadas",
        vendas: 28,
        receita: 1117.2
    },
    {
        nome: "Adesivos Personalizados",
        vendas: 25,
        receita: 747.5
    }
];
const mockUserAddresses = [
    {
        id: "1",
        userId: "2",
        apelido: "Casa",
        destinatario: "Maria Silva",
        cep: "01234-567",
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apto 42",
        bairro: "Jardim Primavera",
        cidade: "São Paulo",
        estado: "SP",
        principal: true
    },
    {
        id: "2",
        userId: "2",
        apelido: "Trabalho",
        destinatario: "Maria Silva",
        cep: "04567-890",
        rua: "Av. Paulista",
        numero: "1000",
        complemento: "Sala 1501",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        principal: false
    },
    {
        id: "3",
        userId: "3",
        apelido: "Casa",
        destinatario: "João Santos",
        cep: "20000-000",
        rua: "Av. Brasil",
        numero: "456",
        complemento: "",
        bairro: "Centro",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        principal: true
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Verificar sessão salva
            const savedUser = localStorage.getItem("memoriza_user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (emailOrPhone, senha)=>{
        // Simular delay da API
        await new Promise((resolve)=>setTimeout(resolve, 500));
        const foundUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"].find((u)=>(u.email === emailOrPhone || u.celular === emailOrPhone) && u.senha === senha);
        if (foundUser) {
            const userData = {
                id: foundUser.id,
                nome: foundUser.nome,
                sobrenome: foundUser.sobrenome,
                email: foundUser.email,
                celular: foundUser.celular,
                role: foundUser.role,
                addresses: foundUser.addresses
            };
            setUser(userData);
            localStorage.setItem("memoriza_user", JSON.stringify(userData));
            return {
                success: true
            };
        }
        return {
            success: false,
            error: "E-mail/celular ou senha incorretos"
        };
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("memoriza_user");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            login,
            logout,
            isAdmin: user?.role === "admin"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.5.0";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getScriptSrc(props) {
    if (props.scriptSrc) {
        return props.scriptSrc;
    }
    if (isDevelopment()) {
        return "https://va.vercel-scripts.com/v1/script.debug.js";
    }
    if (props.basePath) {
        return `${props.basePath}/insights/script.js`;
    }
    return "/_vercel/insights/script.js";
}
// src/generic.ts
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = getScriptSrc(props);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    } else if (props.basePath) {
        script.dataset.endpoint = `${props.basePath}/insights`;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react/utils.ts
function getBasePath() {
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined" || typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env === "undefined") {
        return void 0;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
// src/react/index.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            var _a;
            if (props.beforeSend) {
                (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
            }
        }
    }["Analytics.useEffect"], [
        props.beforeSend
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                basePath: props.basePath ?? getBasePath(),
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    if (!params) {
        return {
            route: null,
            path
        };
    }
    const finalParams = Object.keys(params).length ? params : Object.fromEntries(searchParams.entries());
    return {
        route: computeRoute(path, finalParams),
        path
    };
};
function getBasePath2() {
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined" || typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env === "undefined") {
        return void 0;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
}
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        basePath: getBasePath2(),
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_a569b063._.js.map