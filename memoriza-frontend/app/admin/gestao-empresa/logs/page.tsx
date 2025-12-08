"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActionTypeBadge } from "@/components/action-type-badge"
import { ModuleIcon } from "@/components/module-icon"
import { Download, X } from "lucide-react"
import type { AccessLog, ActionType, ModuleType, LogFilters, Employee } from "@/lib/employee-types"
import {
  moduleLabels,
  actionLabels,
} from "@/lib/employee-mock-data"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

// Tipo da API para Employee (camelCase)
type ApiEmployee = {
  id: string
  name: string
  lastName: string
  email: string
  phone: string
  cpf?: string
  groupId: string
  groupName?: string
  hireDate: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Mapper
const mapApiToEmployee = (api: ApiEmployee): Employee => ({
  id: api.id,
  name: api.name,
  last_name: api.lastName,
  email: api.email,
  phone: api.phone,
  cpf: api.cpf,
  group_id: api.groupId,
  group_name: api.groupName,
  hire_date: new Date(api.hireDate),
  status: api.status,
  created_at: new Date(api.createdAt),
  updated_at: new Date(api.updatedAt),
})

export default function LogsPage() {
  const { token } = useAuth()

  const [logs, setLogs] = useState<AccessLog[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<LogFilters>({})

  const itemsPerPage = 50

  // Carregar funcionários do backend!
  useEffect(() => {
    let isCancelled = false

    const fetchEmployees = async () => {
      if (!token) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error(
            "[LogsPage] Erro ao buscar funcionários. Status:",
            response.status,
          )
          return
        }

        const data = (await response.json()) as ApiEmployee[]
        const parsed = data.map(mapApiToEmployee)

        if (!isCancelled) {
          setEmployees(parsed)
        }
      } catch (error) {
        console.error("[LogsPage] Erro ao buscar funcionários:", error)
      }
    }

    fetchEmployees()

    return () => {
      isCancelled = true
    }
  }, [token])

  // Carregar logs do backend
  useEffect(() => {
    let isCancelled = false

    const fetchLogs = async () => {
      if (!token) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/employee-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error(
            "[LogsPage] Erro ao buscar logs. Status:",
            response.status,
          )
          return
        }

        const data = await response.json()
        
        // Mapear do formato camelCase do backend para snake_case do frontend
        const parsedLogs: AccessLog[] = data.map((log: any) => ({
          id: log.id,
          employee_id: log.employeeId,
          employee_name: log.employeeName,
          employee_role: log.employeeRole,
          action: log.action,
          module: log.module,
          description: log.description,
          timestamp: new Date(log.timestamp),
        }))

        if (!isCancelled) {
          setLogs(parsedLogs)
        }
      } catch (error) {
        console.error("[LogsPage] Erro ao buscar logs:", error)
      }
    }

    fetchLogs()

    return () => {
      isCancelled = true
    }
  }, [token])

  // Filtrar logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filtro de data
      if (filters.dateRange) {
        const logDate = new Date(log.timestamp)
        if (logDate < filters.dateRange.start || logDate > filters.dateRange.end) {
          return false
        }
      }

      // Filtro de funcionário
      if (filters.employeeId && log.employee_id !== filters.employeeId) {
        return false
      }

      // Filtro de ações
      if (filters.actions && filters.actions.length > 0) {
        if (!filters.actions.includes(log.action)) {
          return false
        }
      }

      // Filtro de módulos
      if (filters.modules && filters.modules.length > 0) {
        if (!filters.modules.includes(log.module)) {
          return false
        }
      }

      return true
    })
  }, [logs, filters])

  // Estatísticas
  const statistics = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const accessesToday = logs.filter(
      (log) => new Date(log.timestamp) >= today,
    ).length
    const accessesThisWeek = logs.filter(
      (log) => new Date(log.timestamp) >= weekAgo,
    ).length
    const accessesThisMonth = logs.filter(
      (log) => new Date(log.timestamp) >= monthAgo,
    ).length

    // Top funcionários
    const employeeCounts: Record<string, number> = {}
    logs.forEach((log) => {
      employeeCounts[log.employee_name] =
        (employeeCounts[log.employee_name] || 0) + 1
    })
    const topEmployees = Object.entries(employeeCounts)
      .map(([name, count]) => ({ employee_name: name, access_count: count }))
      .sort((a, b) => b.access_count - a.access_count)
      .slice(0, 5)

    // Top módulos
    const moduleCounts: Record<ModuleType, number> = {} as any
    logs.forEach((log) => {
      moduleCounts[log.module] = (moduleCounts[log.module] || 0) + 1
    })
    const topModules = Object.entries(moduleCounts)
      .map(([module, count]) => ({
        module: module as ModuleType,
        access_count: count as number,
      }))
      .sort((a, b) => b.access_count - a.access_count)
      .slice(0, 5)

    return {
      accessesToday,
      accessesThisWeek,
      accessesThisMonth,
      topEmployees,
      topModules,
    }
  }, [logs])

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleExport = () => {
    toast.success("Exportação iniciada! O arquivo será baixado em breve.")
    console.log("Exportando logs:", filteredLogs)
  }

  const clearFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const hasActiveFilters =
    filters.dateRange ||
    filters.employeeId ||
    (filters.actions && filters.actions.length > 0) ||
    (filters.modules && filters.modules.length > 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Acessos & Logs</h1>
          <p className="text-foreground/60">Monitore a atividade dos funcionários</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-foreground/60 mb-2">Acessos Hoje</p>
          <p className="text-3xl font-semibold text-foreground">
            {statistics.accessesToday}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-foreground/60 mb-2">Esta Semana</p>
          <p className="text-3xl font-semibold text-foreground">
            {statistics.accessesThisWeek}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-foreground/60 mb-2">Este Mês</p>
          <p className="text-3xl font-semibold text-foreground">
            {statistics.accessesThisMonth}
          </p>
        </div>
      </div>

      {/* Top Funcionários e Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Funcionários */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-4">Funcionários Mais Ativos</h3>
          <div className="space-y-3">
            {statistics.topEmployees.map((emp, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">
                  {emp.employee_name}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {emp.access_count} acessos
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Módulos */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-4">Módulos Mais Acessados</h3>
          <div className="space-y-3">
            {statistics.topModules.map((mod, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ModuleIcon
                    module={mod.module}
                    size={14}
                    className="text-foreground/60"
                  />
                  <span className="text-sm text-foreground/80">
                    {moduleLabels[mod.module]}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {mod.access_count} acessos
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Filtros</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X size={14} />
              Limpar Filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Data Início */}
          <div>
            <label className="text-xs text-foreground/60 mb-1 block">
              Data Início
            </label>
            <Input
              type="date"
              value={filters.dateRange?.start.toISOString().split("T")[0] || ""}
              onChange={(e) => {
                const start = e.target.value ? new Date(e.target.value) : undefined
                setFilters({
                  ...filters,
                  dateRange:
                    start && filters.dateRange?.end
                      ? { start, end: filters.dateRange.end }
                      : start
                      ? { start, end: new Date() }
                      : undefined,
                })
                setCurrentPage(1)
              }}
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="text-xs text-foreground/60 mb-1 block">
              Data Fim
            </label>
            <Input
              type="date"
              value={filters.dateRange?.end.toISOString().split("T")[0] || ""}
              onChange={(e) => {
                const end = e.target.value ? new Date(e.target.value) : undefined
                setFilters({
                  ...filters,
                  dateRange:
                    end && filters.dateRange?.start
                      ? { start: filters.dateRange.start, end }
                      : end
                      ? { start: new Date(0), end }
                      : undefined,
                })
                setCurrentPage(1)
              }}
            />
          </div>

          {/* Funcionário */}
          <div>
            <label className="text-xs text-foreground/60 mb-1 block">
              Funcionário
            </label>
            <Select
              value={filters.employeeId || "all"}
              onValueChange={(value) => {
                setFilters({
                  ...filters,
                  employeeId: value === "all" ? undefined : value,
                })
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} {emp.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ação */}
          <div>
            <label className="text-xs text-foreground/60 mb-1 block">
              Tipo de Ação
            </label>
            <Select
              value={filters.actions?.[0] || "all"}
              onValueChange={(value) => {
                setFilters({
                  ...filters,
                  actions:
                    value === "all" ? undefined : [value as ActionType],
                })
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Data/Hora
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Funcionário
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Ação
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Módulo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Descrição
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-foreground/60">Nenhum log encontrado</p>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      {new Date(log.timestamp).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {log.employee_name}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {log.employee_role}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ActionTypeBadge action={log.action} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ModuleIcon
                          module={log.module}
                          size={14}
                          className="text-foreground/60"
                        />
                        <span className="text-sm text-foreground/80">
                          {moduleLabels[log.module]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80 max-w-md truncate">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-foreground/60">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, filteredLogs.length)} de{" "}
              {filteredLogs.length} logs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="px-3 py-1 text-sm text-foreground/60">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}