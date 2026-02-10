"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Users, RefreshCcw, DollarSign, Package, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { orderStatusLabels, orderStatusColors } from "@/lib/mock-data"
import { 
  getDashboardSummary, 
  getTopProducts, 
  getRecentOrders,
  getSalesByMonth,
  type DashboardSummary, 
  type TopProduct,
  type RecentOrder,
  type SalesByMonth
} from "@/lib/api/admin-dashboard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useAuth } from "@/lib/auth-context"
import { AdminPagination } from "@/components/admin-pagination"

// Menu structure from admin-sidebar
const menuSections = [
  {
    title: "Principal",
    items: [
      { href: "/admin", module: "dashboard" },
      { href: "/admin/produtos", module: "products" },
      { href: "/admin/categorias", module: "categories" },
      { href: "/admin/tamanhos", module: "sizes" },
      { href: "/admin/cores", module: "colors" },
      { href: "/admin/pedidos", module: "orders" },
      { href: "/admin/carrossel", module: "carousel" },
      { href: "/admin/configuracoes", module: "settings" },
    ],
  },
  {
    title: "Gestão da Empresa",
    items: [
      { href: "/admin/gestao-empresa/funcionarios", module: "employees" },
      { href: "/admin/gestao-empresa/grupos", module: "groups" },
      { href: "/admin/gestao-empresa/logs", module: "logs" },
    ],
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [dateFilter, setDateFilter] = useState("30dias")
  const [customDate, setCustomDate] = useState("")
  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")

  // Verificar permissões e redirecionar se necessário
  useEffect(() => {
    if (!user) return

    // Proprietário (admin sem employeeGroupId) sempre tem acesso ao dashboard
    if (!user.employeeGroupId) return

    // Funcionário: verificar se tem permissão ao dashboard
    const allowedModules: string[] = Array.isArray((user as any)?.modules)
      ? ((user as any).modules as string[])
      : []

    // Se não tem permissão ao dashboard, redirecionar para primeira página permitida
    if (!allowedModules.includes("dashboard")) {
      // Buscar primeira página permitida
      for (const section of menuSections) {
        for (const item of section.items) {
          if (item.module && item.module !== "dashboard" && allowedModules.includes(item.module)) {
            router.push(item.href)
            return
          }
        }
      }
      // Se não encontrou nenhuma página permitida, redirecionar para home
      router.push("/")
    }
  }, [user, router])

  // Estado para dados reais do backend
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [salesByMonth, setSalesByMonth] = useState<SalesByMonth[]>([])
  const [loading, setLoading] = useState(true)

  // Paginação
  const [topProductsPage, setTopProductsPage] = useState(1)
  const [recentOrdersPage, setRecentOrdersPage] = useState(1)
  const itemsPerPage = 5

  // Filtro de visualização de produtos
  const [showAllProducts, setShowAllProducts] = useState(false)
  
  // Filtro de visualização de pedidos
  const [showAllOrders, setShowAllOrders] = useState(false)

  // Função para converter filtro em range de datas
  const getDateRange = (filter: string, customDate: string, customFrom: string, customTo: string): { from?: Date; to?: Date } => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (filter) {
      case "1dia":
        return { from: new Date(today.getTime() - 24 * 60 * 60 * 1000), to: now }
      case "7dias":
        return { from: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), to: now }
      case "30dias":
        return { from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), to: now }
      case "90dias":
        return { from: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), to: now }
      case "6meses":
        return { from: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000), to: now }
      case "1ano":
        return { from: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000), to: now }
      case "custom":
        if (customDate) {
          const customFromDate = new Date(customDate)
          return { from: customFromDate, to: now }
        }
        return {}
      case "range":
        if (customFrom && customTo) {
          return { from: new Date(customFrom), to: new Date(customTo) }
        }
        return {}
      case "todos":
      default:
        return {} // Sem filtro = backend usa padrão (30 dias)
    }
  }

  // Buscar dados do backend quando filtro mudar
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const { from, to } = getDateRange(dateFilter, customDate, customDateFrom, customDateTo)
        
        const [summaryData, topProductsData, recentOrdersData, salesData] = await Promise.all([
          getDashboardSummary(from, to),
          getTopProducts(from, to, showAllProducts ? 100 : 5), // Top 5 ou todos (até 100)
          getRecentOrders(showAllOrders ? 100 : 15), // Últimos 15 ou todos (até 100)
          getSalesByMonth(from, to)
        ])

        setSummary(summaryData)
        setTopProducts(topProductsData)
        setRecentOrders(recentOrdersData)
        setSalesByMonth(salesData)
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [dateFilter, customDate, customDateFrom, customDateTo, showAllProducts, showAllOrders])

  // Mapear status do backend (inglês) para frontend (português)
  const mapBackendStatus = (backendStatus: string): keyof typeof orderStatusLabels => {
    const statusMap: Record<string, keyof typeof orderStatusLabels> = {
      'Pending': 'aguardando_pagamento' as keyof typeof orderStatusLabels,
      'Paid': 'aprovado',
      'InProduction': 'em_producao',
      'Shipped': 'a_caminho',
      'Delivered': 'entregue',
      'Refunded': 'reembolsado',
      'Cancelled': 'cancelado',
    }
    return statusMap[backendStatus] || 'aprovado'
  }

  // Cálculos de paginação
  const totalTopProductsPages = Math.ceil(topProducts.length / itemsPerPage)
  const startTopProducts = (topProductsPage - 1) * itemsPerPage
  const paginatedTopProducts = topProducts.slice(startTopProducts, startTopProducts + itemsPerPage)

  const totalRecentOrdersPages = Math.ceil(recentOrders.length / itemsPerPage)
  const startRecentOrders = (recentOrdersPage - 1) * itemsPerPage
  const paginatedRecentOrders = recentOrders.slice(startRecentOrders, startRecentOrders + itemsPerPage)

  const metrics = [
    {
      title: "Vendas Total",
      value: loading ? "..." : `R$ ${(summary?.totalSales ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: `${summary?.totalOrders ?? 0} pedidos no total`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pedidos Aprovados",
      value: loading ? "..." : (summary?.ordersPaid ?? 0).toString(),
      subtitle: "Pagamento confirmado",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      title: "Aguardando Pagg.",
      value: loading ? "..." : (summary?.ordersAwaitingPayment ?? 0).toString(),
      subtitle: "Pendentes de pagamento",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Em Produção",
      value: loading ? "..." : (summary?.ordersInProduction ?? 0).toString(),
      subtitle: `${summary?.ordersFinished ?? 0} finalizados`,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Pedidos Cancelados",
      value: loading ? "..." : (summary?.ordersCancelled ?? 0).toString(),
      subtitle: "Cancelados ou falhos",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Reembolsos",
      value: loading ? "..." : `R$ ${(summary?.totalRefunds ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: `Total reembolsado`,
      icon: RefreshCcw,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Dashboard</h1>
          <p className="text-foreground/60">
            Visão geral do seu negócio{" "}
            {dateFilter === "custom" && customDate && (
              <span className="text-xs text-foreground/50 ml-1">
                (a partir de {new Date(customDate).toLocaleDateString("pt-BR")})
              </span>
            )}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-foreground/60" />

          <select
            value={dateFilter}
            onChange={(e) => {
              const value = e.target.value
              setDateFilter(value)
              if (value !== "custom") {
                setCustomDate("")
              }
            }}
            className="bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
          >
            <option value="1dia">Últimas 24 horas</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="1ano">Último ano</option>
            <option value="todos">Todo período</option>
            <option value="custom">Data específica</option>
            <option value="range">Intervalo personalizado</option>
          </select>

          {dateFilter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
          )}

          {dateFilter === "range" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                placeholder="De"
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
              <span className="text-foreground/60 text-sm">até</span>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                placeholder="Até"
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-muted ${metric.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground mb-1">{metric.value}</p>
              <p className="text-sm text-foreground/60">{metric.title}</p>
              <p className="text-xs text-accent mt-2">{metric.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Vendas por Mês</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Vendas"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5" }}
                />
                <Bar dataKey="sales" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Tendência de Vendas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Vendas"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5" }}
                />
                <Line type="monotone" dataKey="sales" stroke="#c9a87c" strokeWidth={2} dot={{ fill: "#c9a87c" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-foreground">Produtos Mais Vendidos</h3>
            <button
              onClick={() => {
                setShowAllProducts(!showAllProducts)
                setTopProductsPage(1) // Resetar para página 1
              }}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                showAllProducts
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {showAllProducts ? 'Ver Top 5' : 'Ver Todos'}
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : topProducts.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedTopProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Package size={16} className="text-foreground/60" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{product.productName}</p>
                        <p className="text-xs text-foreground/60">{product.quantitySold} vendas</p>
                      </div>
                    </div>
                    <p className="font-medium text-foreground">
                      R$ {product.totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
              <AdminPagination
                currentPage={topProductsPage}
                totalPages={totalTopProductsPages}
                onPageChange={setTopProductsPage}
                totalItems={topProducts.length}
                itemsPerPage={itemsPerPage}
                itemLabel="produtos"
              />
            </>
          ) : (
            <p className="text-sm text-foreground/60 text-center py-8">Nenhum produto vendido no período</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-foreground">Pedidos Recentes</h3>
            <button
              onClick={() => {
                setShowAllOrders(!showAllOrders)
                setRecentOrdersPage(1) // Resetar para página 1
              }}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                showAllOrders
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {showAllOrders ? 'Ver Últimos 15' : 'Ver Todos'}
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedRecentOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-foreground/60">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground text-sm">
                        R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${orderStatusColors[mapBackendStatus(order.status)]}`}>
                        {orderStatusLabels[mapBackendStatus(order.status)]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <AdminPagination
                currentPage={recentOrdersPage}
                totalPages={totalRecentOrdersPages}
                onPageChange={setRecentOrdersPage}
                totalItems={recentOrders.length}
                itemsPerPage={itemsPerPage}
                itemLabel="pedidos"
              />
            </>
          ) : (
            <p className="text-sm text-foreground/60 text-center py-8">Nenhum pedido recente</p>
          )}
        </div>
      </div>
    </div>
  )
}