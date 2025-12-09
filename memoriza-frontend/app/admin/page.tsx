"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Users, RefreshCcw, DollarSign, Package, Calendar } from "lucide-react"
import {
  mockDashboardMetrics,
  mockSalesData,
  mockBestSellers,
  mockOrders,
  orderStatusLabels,
  orderStatusColors,
} from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useAuth } from "@/lib/auth-context"

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

  // Simulação de filtro em cima dos mocks (sem usar datas reais)
  const getSalesDataByFilter = () => {
    switch (dateFilter) {
      case "1dia":
        return mockSalesData.slice(-1) // último ponto
      case "7dias":
        return mockSalesData.slice(-2)
      case "30dias":
        return mockSalesData.slice(-3)
      case "90dias":
        return mockSalesData.slice(-4)
      case "6meses":
        return mockSalesData.slice(-6)
      case "1ano":
        return mockSalesData.slice(-12)
      case "custom":
        // Para data específica, só simulamos menos pontos se tiver data escolhida
        if (customDate) {
          return mockSalesData.slice(-2)
        }
        return mockSalesData
      default:
        // "todos" ou fallback
        return mockSalesData
    }
  }

  const getOrdersByFilter = () => {
    switch (dateFilter) {
      case "1dia":
        return mockOrders.slice(0, 3)
      case "7dias":
        return mockOrders.slice(0, 5)
      case "30dias":
        return mockOrders.slice(0, 8)
      case "90dias":
        return mockOrders.slice(0, 10)
      case "6meses":
        return mockOrders.slice(0, 12)
      case "1ano":
        return mockOrders.slice(0, 15)
      case "custom":
        if (customDate) {
          return mockOrders.slice(0, 4)
        }
        return mockOrders
      default:
        // "todos"
        return mockOrders
    }
  }

  const filteredSalesData = getSalesDataByFilter()
  const filteredOrders = getOrdersByFilter()
  const recentOrders = filteredOrders.slice(0, 5)

  const metrics = [
    {
      title: "Vendas Total",
      value: `R$ ${mockDashboardMetrics.vendasTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: `R$ ${mockDashboardMetrics.vendasMesAtual.toLocaleString("pt-BR")} este mês`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pedidos",
      value: mockDashboardMetrics.pedidosTotal.toString(),
      subtitle: `${mockDashboardMetrics.pedidosMesAtual} este mês`,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Reembolsos",
      value: mockDashboardMetrics.reembolsos.toString(),
      subtitle: `R$ ${mockDashboardMetrics.reembolsosValor.toLocaleString("pt-BR")} total`,
      icon: RefreshCcw,
      color: "text-orange-600",
    },
    {
      title: "Clientes",
      value: mockDashboardMetrics.clientesTotal.toString(),
      subtitle: `Ticket médio: R$ ${mockDashboardMetrics.ticketMedio.toFixed(2)}`,
      icon: Users,
      color: "text-purple-600",
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
          </select>

          {dateFilter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <BarChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Vendas"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5" }}
                />
                <Bar dataKey="vendas" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Tendência de Vendas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Vendas"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5" }}
                />
                <Line type="monotone" dataKey="vendas" stroke="#c9a87c" strokeWidth={2} dot={{ fill: "#c9a87c" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {mockBestSellers.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Package size={16} className="text-foreground/60" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{product.nome}</p>
                    <p className="text-xs text-foreground/60">{product.vendas} vendas</p>
                  </div>
                </div>
                <p className="font-medium text-foreground">
                  R$ {product.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-6">Pedidos Recentes</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{order.id}</p>
                  <p className="text-xs text-foreground/60">{order.clienteNome}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">
                    R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${orderStatusColors[order.status]}`}>
                    {orderStatusLabels[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}