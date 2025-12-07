(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/memoriza-frontend/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PedidosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/auth-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PedidosPage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const statusFilter = searchParams.get("status");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Filtrar pedidos do usuário atual (usando pedidos da Maria para demo)
    const userOrders = __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockOrders"].filter((order)=>order.clienteId === user?.id || order.clienteId === "2");
    const filteredOrders = userOrders.filter((order)=>{
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.items.some((item)=>item.produtoNome.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });
    const clearFilter = ()=>{
        router.push("/minha-conta/pedidos");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-background border border-border rounded-xl p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-medium text-foreground",
                                children: "Meus Pedidos"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60",
                                children: "Acompanhe seus pedidos e histórico de compras"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            statusFilter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm bg-accent/10 text-accent px-2 py-1 rounded-md",
                                        children: [
                                            "Filtro: ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusLabels"][statusFilter]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: clearFilter,
                                        className: "text-foreground/60 hover:text-foreground",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                            lineNumber: 46,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full sm:w-64",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50",
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                placeholder: "Buscar pedido...",
                                className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-accent"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/minha-conta/pedidos/${order.id}`,
                            className: "block border border-border rounded-xl p-4 hover:border-accent/50 hover:bg-muted/30 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-muted rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    size: 24,
                                                    className: "text-foreground/60"
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                lineNumber: 75,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-foreground",
                                                        children: order.id
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-foreground/60 mt-1",
                                                        children: new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric"
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-foreground/60 mt-1",
                                                        children: [
                                                            order.items.length,
                                                            " ",
                                                            order.items.length === 1 ? "item" : "itens"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 19
                                                    }, this),
                                                    order.status === "a_caminho" && order.codigoRastreio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 text-xs text-accent",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium",
                                                                children: [
                                                                    "Código: ",
                                                                    order.codigoRastreio
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                                lineNumber: 92,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-foreground/60",
                                                                children: order.transportadora
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                                lineNumber: 93,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 91,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                lineNumber: 78,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusColors"][order.status]}`,
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusLabels"][order.status]
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 101,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-foreground mt-2",
                                                        children: [
                                                            "R$ ",
                                                            order.total.toLocaleString("pt-BR", {
                                                                minimumFractionDigits: 2
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                size: 20,
                                                className: "text-foreground/40"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        }, order.id, false, {
                            fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)),
                    filteredOrders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 text-foreground/60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 48,
                                className: "mx-auto mb-4 opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Nenhum pedido encontrado"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/memoriza-frontend/app/minha-conta/pedidos/page.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(PedidosPage, "fknRinyXaFg4EbvvfYEqlvcenC0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PedidosPage;
var _c;
__turbopack_context__.k.register(_c, "PedidosPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>ChevronRight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ChevronRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ChevronRight", [
    [
        "path",
        {
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }
    ]
]);
;
 //# sourceMappingURL=chevron-right.js.map
}),
"[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
"[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>X
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("X", [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
]);
;
 //# sourceMappingURL=x.js.map
}),
"[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=memoriza-frontend_f6e903cb._.js.map