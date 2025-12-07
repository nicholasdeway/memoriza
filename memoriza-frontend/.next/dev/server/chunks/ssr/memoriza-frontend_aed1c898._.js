module.exports = [
"[project]/memoriza-frontend/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/memoriza-frontend/lib/use-permissions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePermissions",
    ()=>usePermissions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/auth-context.tsx [app-ssr] (ecmascript)");
;
function usePermissions(module) {
    const { user, isAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // Proprietário (admin sem employeeGroupId) tem todas as permissões
    if (isAdmin && !user?.employeeGroupId) {
        return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
            canUpdateStatus: true,
            hasPermission: (action)=>true
        };
    }
    // Funcionário: verifica permissões do grupo
    const groupPermissions = user?.groupPermissions || [];
    const modulePermission = groupPermissions.find((p)=>p.module === module);
    if (!modulePermission) {
        // Sem permissão para este módulo
        return {
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canExport: false,
            canUpdateStatus: false,
            hasPermission: (action)=>false
        };
    }
    // Extrai ações permitidas
    const actions = modulePermission.actions || {};
    // Helper para verificar ação case-insensitive
    const hasAction = (action)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // 1. Match exato
        if (actions[action] === true) return true;
        // 2. Match Capitalized (Create)
        const capitalized = action.charAt(0).toUpperCase() + action.slice(1);
        if (actions[capitalized] === true) return true;
        // 3. Match UPPERCASE (CREATE)
        if (actions[action.toUpperCase()] === true) return true;
        return false;
    };
    return {
        canView: hasAction('view'),
        canCreate: hasAction('create'),
        canEdit: hasAction('edit'),
        canDelete: hasAction('delete'),
        canExport: hasAction('export'),
        canUpdateStatus: hasAction('update_status') || hasAction('updateStatus'),
        hasPermission: (action)=>hasAction(action)
    };
}
}),
"[project]/memoriza-frontend/app/admin/pedidos/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPedidos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/truck.js [app-ssr] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/mock-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$use$2d$permissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/use-permissions.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://localhost:7105") ?? "https://localhost:7105";
// fluxo visual (mantive o mock)
const statusFlow = [
    "aprovado",
    "em_producao",
    "a_caminho",
    "entregue"
];
// =======================
// Helpers de mapeamento
// =======================
const backendToUiStatus = (status)=>{
    switch(status){
        case "Pending":
            return "aguardando_pagamento";
        case "Paid":
            return "aprovado";
        case "InProduction":
            return "em_producao";
        case "Shipped":
            return "a_caminho";
        case "Delivered":
            return "entregue";
        case "Refunded":
            return "reembolsado";
        case "Cancelled":
            return "cancelado";
        default:
            return "aguardando_pagamento";
    }
};
const uiToBackendStatus = (status)=>{
    const map = {
        aguardando_pagamento: "Pending",
        aprovado: "Paid",
        em_producao: "InProduction",
        a_caminho: "Shipped",
        entregue: "Delivered",
        reembolsado: "Refunded",
        cancelado: "Cancelled"
    };
    return map[status] ?? "Pending";
};
function AdminPedidos() {
    const { token, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { canEdit, canUpdateStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$use$2d$permissions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePermissions"])('orders');
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedOrder, setSelectedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showStatusDropdown, setShowStatusDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showTrackingModal, setShowTrackingModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [trackingOrder, setTrackingOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [trackingData, setTrackingData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        trackingCode: "",
        trackingCompany: "",
        trackingUrl: ""
    });
    // ===========================
    // Fetch listagem de pedidos
    // ===========================
    const fetchOrders = async ()=>{
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) {
                console.error("Erro API:", res.status, res.statusText);
                try {
                    const errorBody = await res.text();
                    console.error("Error Body:", errorBody);
                } catch  {
                // ignore
                }
                throw new Error(`Falha ao carregar pedidos: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            const mapped = data.map((o)=>({
                    id: o.id,
                    customerName: o.customerName,
                    subtotal: o.subtotal,
                    freightValue: o.freightValue,
                    total: o.total,
                    status: backendToUiStatus(o.status),
                    createdAt: o.createdAt
                }));
            setOrders(mapped);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Não foi possível carregar os pedidos.");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void fetchOrders();
    }, [
        token
    ]);
    // ===========================
    // Fetch detalhe de 1 pedido
    // ===========================
    const fetchOrderDetail = async (id)=>{
        if (!token) return null;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error("Falha ao carregar detalhes do pedido");
            }
            const data = await res.json();
            const detail = {
                id: data.id,
                userId: data.userId,
                customerName: data.customerName,
                subtotal: data.subtotal,
                freightValue: data.freightValue,
                total: data.total,
                status: backendToUiStatus(data.status),
                personalizationNotes: data.personalizationNotes,
                createdAt: data.createdAt,
                trackingCode: data.trackingCode ?? null,
                trackingCompany: data.trackingCompany ?? null,
                trackingUrl: data.trackingUrl ?? null,
                deliveredAt: data.deliveredAt ?? null,
                items: data.items.map((i)=>({
                        productId: i.productId,
                        productName: i.productName,
                        unitPrice: i.unitPrice,
                        quantity: i.quantity,
                        lineTotal: i.lineTotal
                    }))
            };
            return detail;
        } catch (error) {
            console.error("Erro ao buscar detalhes do pedido:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Não foi possível carregar os detalhes do pedido.");
            return null;
        }
    };
    // ===========================
    // Filtro na lista
    // ===========================
    const filteredOrders = orders.filter((o)=>{
        const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !filterStatus || o.status === filterStatus;
        return matchSearch && matchStatus;
    });
    // ===========================
    // Atualizar status (PUT /status)
    // ===========================
    const updateOrderStatus = async (orderId, newStatus)=>{
        if (!token) return;
        if (!canUpdateStatus) {
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Você não tem permissão para atualizar status de pedidos");
            return;
        }
        const previousOrders = [
            ...orders
        ];
        const previousSelected = selectedOrder;
        setOrders((prev)=>prev.map((o)=>o.id === orderId ? {
                    ...o,
                    status: newStatus
                } : o));
        setShowStatusDropdown(null);
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({
                ...selectedOrder,
                status: newStatus
            });
        }
        try {
            const adminUserId = user?.id ?? "00000000-0000-0000-0000-000000000000";
            const body = {
                newStatus: uiToBackendStatus(newStatus),
                adminUserId,
                note: null
            };
            const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                throw new Error("Falha ao atualizar status");
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Erro ao atualizar status do pedido.");
            setOrders(previousOrders);
            setSelectedOrder(previousSelected);
        }
    };
    // ===========================
    // Abrir modal de detalhes
    // ===========================
    const openDetailModal = async (orderId)=>{
        const detail = await fetchOrderDetail(orderId);
        if (!detail) return;
        setSelectedOrder(detail);
    };
    // ===========================
    // Tracking: abrir modal
    // ===========================
    const openTrackingModal = async (orderId)=>{
        if (!canEdit) {
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Você não tem permissão para editar informações de rastreamento");
            return;
        }
        const detail = await fetchOrderDetail(orderId);
        if (!detail) return;
        setTrackingOrder(detail);
        setTrackingData({
            trackingCode: detail.trackingCode ?? "",
            trackingCompany: detail.trackingCompany ?? "",
            trackingUrl: detail.trackingUrl ?? ""
        });
        setShowTrackingModal(true);
    };
    // ===========================
    // Tracking: salvar (PUT /tracking)
    // ===========================
    const saveTracking = async ()=>{
        if (!trackingOrder || !token) return;
        if (!canEdit) {
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Você não tem permissão para editar informações de rastreamento");
            return;
        }
        const previousOrders = [
            ...orders
        ];
        try {
            const dto = {
                id: trackingOrder.id,
                userId: trackingOrder.userId,
                customerName: trackingOrder.customerName,
                subtotal: trackingOrder.subtotal,
                freightValue: trackingOrder.freightValue,
                total: trackingOrder.total,
                status: uiToBackendStatus(trackingOrder.status),
                personalizationNotes: trackingOrder.personalizationNotes ?? null,
                createdAt: trackingOrder.createdAt,
                trackingCode: trackingData.trackingCode,
                trackingCompany: trackingData.trackingCompany,
                trackingUrl: trackingData.trackingUrl,
                deliveredAt: trackingOrder.deliveredAt ?? null,
                items: trackingOrder.items.map((i)=>({
                        productId: i.productId,
                        productName: i.productName,
                        unitPrice: i.unitPrice,
                        quantity: i.quantity,
                        lineTotal: i.lineTotal
                    }))
            };
            const res = await fetch(`${API_BASE_URL}/api/admin/orders/${trackingOrder.id}/tracking`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dto)
            });
            if (!res.ok) {
                throw new Error("Falha ao salvar rastreamento");
            }
            const newStatus = "a_caminho";
            setOrders((prev)=>prev.map((o)=>o.id === trackingOrder.id ? {
                        ...o,
                        status: newStatus
                    } : o));
            if (selectedOrder?.id === trackingOrder.id) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: newStatus,
                    trackingCode: trackingData.trackingCode,
                    trackingCompany: trackingData.trackingCompany,
                    trackingUrl: trackingData.trackingUrl
                });
            }
            setTrackingOrder({
                ...trackingOrder,
                status: newStatus,
                trackingCode: trackingData.trackingCode,
                trackingCompany: trackingData.trackingCompany,
                trackingUrl: trackingData.trackingUrl
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Rastreamento salvo com sucesso!");
            setShowTrackingModal(false);
            setTrackingOrder(null);
            setTrackingData({
                trackingCode: "",
                trackingCompany: "",
                trackingUrl: ""
            });
        } catch (error) {
            console.error("Erro ao salvar rastreamento:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Erro ao salvar informações de rastreamento.");
            setOrders(previousOrders);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-foreground/60",
                    children: "Carregando pedidos..."
                }, void 0, false, {
                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                    lineNumber: 482,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 481,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
            lineNumber: 480,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-light text-foreground",
                        children: "Pedidos"
                    }, void 0, false, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 492,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-foreground/60",
                        children: "Gerencie e acompanhe os pedidos dos clientes"
                    }, void 0, false, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                size: 18,
                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 501,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Buscar por ID ou cliente...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 505,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: filterStatus,
                        onChange: (e)=>setFilterStatus(e.target.value),
                        className: "px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Todos os status"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 520,
                                columnNumber: 11
                            }, this),
                            Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"]).map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: value,
                                    children: label
                                }, value, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 513,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 499,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6",
                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"]).map(([status, label])=>{
                    const typedStatus = status;
                    const count = orders.filter((o)=>o.status === typedStatus).length;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterStatus(filterStatus === typedStatus ? "" : typedStatus),
                        className: `p-4 rounded-xl border transition-all ${filterStatus === typedStatus ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/50"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-semibold text-foreground",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 548,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 549,
                                columnNumber: 15
                            }, this)
                        ]
                    }, status, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 535,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 530,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-muted border-b border-border",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                            children: "Pedido"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                            children: "Cliente"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 564,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 567,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                            children: "Data"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 570,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 573,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-6 py-4 text-center text-sm font-medium text-foreground",
                                            children: "Ações"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 576,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-border",
                                children: filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 6,
                                        className: "px-6 py-12 text-center text-foreground/60",
                                        children: "Nenhum pedido encontrado"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                        lineNumber: 584,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 583,
                                    columnNumber: 17
                                }, this) : filteredOrders.map((order)=>{
                                    // 👉 Só mostra valor real se estiver aprovado
                                    const displayTotal = order.status === "aprovado" ? order.total && order.total > 0 ? order.total : order.subtotal + (order.freightValue ?? 0) : 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-muted/50 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4 font-medium text-foreground",
                                                children: order.id
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 606,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-foreground",
                                                    children: order.customerName
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 609,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4 font-medium text-foreground",
                                                children: [
                                                    "R",
                                                    "$ ",
                                                    displayTotal.toLocaleString("pt-BR", {
                                                        minimumFractionDigits: 2
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4 text-sm text-foreground/70",
                                                children: new Date(order.createdAt).toLocaleDateString("pt-BR")
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: canUpdateStatus ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id),
                                                                className: `flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColors"][order.status]}`,
                                                                children: [
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"][order.status],
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                        lineNumber: 640,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                lineNumber: 627,
                                                                columnNumber: 31
                                                            }, this),
                                                            showStatusDropdown === order.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px]",
                                                                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"]).map(([status, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>updateOrderStatus(order.id, status),
                                                                        className: `w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${order.status === status ? "bg-muted font-medium" : ""}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `inline-block w-2 h-2 rounded-full mr-2 ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColors"][status].replace("text-", "bg-").split(" ")[0]}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                                lineNumber: 661,
                                                                                columnNumber: 41
                                                                            }, this),
                                                                            label
                                                                        ]
                                                                    }, status, true, {
                                                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                        lineNumber: 647,
                                                                        columnNumber: 39
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                lineNumber: 644,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColors"][order.status]}`,
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"][order.status]
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                        lineNumber: 678,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 623,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>void openDetailModal(order.id),
                                                            className: "p-2 text-foreground/60 hover:text-primary hover:bg-muted rounded-lg transition-colors",
                                                            title: "Ver detalhes",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                size: 18
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                lineNumber: 695,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 690,
                                                            columnNumber: 27
                                                        }, this),
                                                        canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>void openTrackingModal(order.id),
                                                            className: "p-2 text-foreground/60 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors",
                                                            title: "Adicionar/Editar rastreio",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                                                size: 18
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                lineNumber: 703,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 698,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                lineNumber: 688,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                        lineNumber: 602,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 581,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                        lineNumber: 558,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                    lineNumber: 557,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            selectedOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-medium text-foreground",
                                            children: [
                                                "Pedido ",
                                                selectedOrder.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 723,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-foreground/60",
                                            children: [
                                                "Criado em",
                                                " ",
                                                new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 726,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 722,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedOrder(null),
                                    className: "text-foreground/60 hover:text-foreground",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                        lineNumber: 737,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 733,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 721,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-foreground",
                                            children: "Status do Pedido"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 744,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-3 py-1 rounded-full text-sm font-medium ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColors"][selectedOrder.status]}`,
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"][selectedOrder.status]
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 747,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 743,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: statusFlow.map((status, idx)=>{
                                        const currentIndex = statusFlow.indexOf(selectedOrder.status);
                                        const isActive = currentIndex >= idx;
                                        const isCurrent = selectedOrder.status === status;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex flex-col items-center ${idx > 0 ? "ml-2" : ""}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${isActive ? "bg-accent text-white" : "bg-muted text-foreground/50"} ${isCurrent ? "ring-2 ring-accent ring-offset-2" : ""}`,
                                                            children: idx + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 772,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-foreground/60 mt-1",
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusLabels"][status]
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 783,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 767,
                                                    columnNumber: 23
                                                }, this),
                                                idx < statusFlow.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-12 h-0.5 mx-2 ${isActive ? "bg-accent" : "bg-muted"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, status, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 766,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 757,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted rounded-lg p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-foreground mb-3",
                                            children: "Dados do Cliente"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 801,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-foreground/60",
                                                            children: "Nome"
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-foreground",
                                                            children: selectedOrder.customerName
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 807,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-foreground/60",
                                                            children: "ID do Usuário"
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 812,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-foreground",
                                                            children: selectedOrder.userId
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 813,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 811,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 804,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 800,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-foreground mb-3",
                                            children: "Itens do Pedido"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 820,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: selectedOrder.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between py-2 border-b border-border last:border-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-foreground",
                                                                    children: item.productName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                    lineNumber: 830,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-foreground/60",
                                                                    children: [
                                                                        "Qtd: ",
                                                                        item.quantity
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                                    lineNumber: 831,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 829,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium text-foreground",
                                                            children: [
                                                                "R",
                                                                "$ ",
                                                                item.lineTotal.toLocaleString("pt-BR", {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, `${item.productId}-${idx}`, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 823,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 pt-4 border-t border-border space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground/60",
                                                            children: "Subtotal"
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 848,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground",
                                                            children: [
                                                                "R",
                                                                "$ ",
                                                                selectedOrder.subtotal.toLocaleString("pt-BR", {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 849,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 847,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground/60",
                                                            children: "Frete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 857,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground",
                                                            children: selectedOrder.freightValue === 0 ? "Grátis" : `R$ ${selectedOrder.freightValue.toLocaleString("pt-BR", {
                                                                minimumFractionDigits: 2
                                                            })}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 858,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 856,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between font-medium text-lg pt-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground",
                                                            children: "Total"
                                                        }, void 0, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 868,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground",
                                                            children: [
                                                                "R",
                                                                "$ ",
                                                                selectedOrder.total.toLocaleString("pt-BR", {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                            lineNumber: 869,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                                    lineNumber: 867,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 846,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 741,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-3 p-6 border-t border-border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedOrder(null),
                                className: "px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors",
                                children: "Fechar"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                lineNumber: 881,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 880,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                    lineNumber: 720,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 719,
                columnNumber: 9
            }, this),
            showTrackingModal && trackingOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card border border-border rounded-xl w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-medium text-foreground",
                                            children: "Adicionar Rastreamento"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 898,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-foreground/60",
                                            children: [
                                                "Pedido ",
                                                trackingOrder.id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 901,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 897,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowTrackingModal(false),
                                    className: "text-foreground/60 hover:text-foreground",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                        lineNumber: 909,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 905,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 896,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-foreground mb-2",
                                            children: "Código de Rastreio"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 915,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: trackingData.trackingCode,
                                            onChange: (e)=>setTrackingData({
                                                    ...trackingData,
                                                    trackingCode: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent",
                                            placeholder: "Ex: BR123456789BR"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 918,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 914,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-foreground mb-2",
                                            children: "Transportadora"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 933,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: trackingData.trackingCompany,
                                            onChange: (e)=>setTrackingData({
                                                    ...trackingData,
                                                    trackingCompany: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent",
                                            placeholder: "Ex: Correios"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 936,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 932,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-foreground mb-2",
                                            children: "URL de Rastreamento"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 951,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "url",
                                            value: trackingData.trackingUrl,
                                            onChange: (e)=>setTrackingData({
                                                    ...trackingData,
                                                    trackingUrl: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent",
                                            placeholder: "https://rastreamento.correios.com.br"
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                            lineNumber: 954,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 950,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-muted/50 p-3 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-foreground/70",
                                        children: 'Ao salvar, o status do pedido pode ser atualizado para "A Caminho" no painel.'
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                        lineNumber: 969,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 968,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 913,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-3 p-6 border-t border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowTrackingModal(false),
                                    className: "px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors",
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 977,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: saveTracking,
                                    className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
                                    disabled: !trackingData.trackingCode || !trackingData.trackingCompany || !trackingData.trackingUrl,
                                    children: "Salvar Rastreamento"
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                                    lineNumber: 983,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                            lineNumber: 976,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                    lineNumber: 895,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
                lineNumber: 894,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/memoriza-frontend/app/admin/pedidos/page.tsx",
        lineNumber: 489,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=memoriza-frontend_aed1c898._.js.map