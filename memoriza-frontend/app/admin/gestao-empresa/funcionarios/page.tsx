"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmployeeFormDialog } from "@/components/employee-form-dialog"
import { EmployeeStatusBadge } from "@/components/employee-status-badge"
import {
  Plus,
  Search,
  Edit,
  Power,
  Mail,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  Employee,
  EmployeeFormData,
  UserGroup,
} from "@/lib/employee-types"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

// Tipos da API (camelCase)
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

type ApiGroup = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  employeeCount: number
  createdAt: string
  permissions: UserGroup["permissions"]
}

// ===========================
// Helpers
// ===========================
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

const mapApiToUserGroup = (api: ApiGroup): UserGroup => ({
  id: api.id,
  name: api.name,
  description: api.description ?? "",
  is_active: api.isActive,
  employee_count: api.employeeCount,
  created_at: new Date(api.createdAt),
  permissions: api.permissions ?? [],
})

function formatPhone(value?: string) {
  const digits = (value ?? "").replace(/\D/g, "")
  if (!digits) return ""

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

export default function FuncionariosPage() {
  const { token } = useAuth()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterGroup, setFilterGroup] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )

  const itemsPerPage = 10

  const fetchData = async () => {
    if (!token) return

    try {
      setLoading(true)

      const [groupsRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (!groupsRes.ok || !employeesRes.ok) {
        throw new Error("Erro ao carregar dados")
      }

      const groupsData = (await groupsRes.json()) as ApiGroup[]
      const employeesData = (await employeesRes.json()) as ApiEmployee[]

      setGroups(groupsData.map(mapApiToUserGroup))
      setEmployees(employeesData.map(mapApiToEmployee))
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Não foi possível carregar os dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  const filteredEmployees = employees.filter((emp) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      emp.name.toLowerCase().includes(search) ||
      emp.last_name.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)

    const matchesGroup = filterGroup === "all" || emp.group_id === filterGroup
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus

    return matchesSearch && matchesGroup && matchesStatus
  })

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const handleCreateEmployee = () => {
    setSelectedEmployee(null)
    setDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
  }

  const handleSaveEmployee = async (data: EmployeeFormData) => {
    if (!token) {
      toast.error("Sessão expirada")
      return
    }

    try {
      const isEdit = !!selectedEmployee
      const url = isEdit
        ? `${API_BASE_URL}/api/admin/employees/${selectedEmployee!.id}`
        : `${API_BASE_URL}/api/admin/employees`

      const method = isEdit ? "PUT" : "POST"

      const payload: any = {
        name: data.name.trim(),
        lastName: data.last_name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        cpf: data.cpf || null,
        groupId: data.group_id,
        userGroupId: data.group_id,
        hireDate: data.hire_date.toISOString(),
        status: data.status,
      }

      if (data.password && data.password.length > 0) {
        payload.password = data.password
      }

      console.log("📤 Enviando funcionário para API:", payload)

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        let errorMessage = "Erro ao salvar funcionário"

        try {
          if (contentType && contentType.includes("application/json")) {
            const json = await res.json()
            console.error("❌ Erro API funcionário (JSON):", json)

            errorMessage =
              json.message ||
              json.title ||
              json.error ||
              JSON.stringify(json)
          } else {
            const text = await res.text()
            console.error("❌ Erro API funcionário (texto):", text)
            if (text) errorMessage = text
          }
        } catch (parseError) {
          console.error("Erro ao ler resposta de erro:", parseError)
        }

        // Verifica se é erro de número duplicado e exibe mensagem específica
        if (errorMessage.includes("Já existe uma conta cadastrada com este número")) {
          toast.error("Este número de celular já está cadastrado em outra conta.", {
            description: "Por favor, utilize um número diferente.",
          })
        } else {
          toast.error(errorMessage)
        }
        
        return
      }

      toast.success(isEdit ? "Funcionário atualizado!" : "Funcionário criado!")
      setDialogOpen(false)
      await fetchData()
    } catch (error) {
      console.error("Erro inesperado ao salvar funcionário:", error)
      toast.error("Erro inesperado ao salvar funcionário. Tente novamente.")
    }
  }

  const handleToggleStatus = async (employee: Employee) => {
    if (!token) return

    try {
      const newStatus = employee.status === "active" ? "inactive" : "active"

      const res = await fetch(
        `${API_BASE_URL}/api/admin/employees/${employee.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      if (!res.ok) throw new Error("Erro ao atualizar status")

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employee.id
            ? { ...emp, status: newStatus, updated_at: new Date() }
            : emp,
        ),
      )

      toast.success(
        `Funcionário ${
          newStatus === "active" ? "ativado" : "desativado"
        }!`,
      )
    } catch (error) {
      console.error(error)
      toast.error("Erro ao alterar status")
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">
            Funcionários
          </h1>
          <p className="text-foreground/60">
            Gerencie os funcionários e seus acessos
          </p>
        </div>
        <Button onClick={handleCreateEmployee} className="gap-2">
          <Plus size={18} />
          Novo Funcionário
        </Button>
      </div>

      {/* Loading */}
      {loading && employees.length === 0 && (
        <p className="text-sm text-foreground/60 mb-4">Carregando dados...</p>
      )}

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          {/* Filtro por Grupo */}
          <Select
            value={filterGroup}
            onValueChange={(value) => {
              setFilterGroup(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por Status */}
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Grupo
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">
                  Data Admissão
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-foreground/60">
                      {loading
                        ? "Carregando..."
                        : "Nenhum funcionário encontrado"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {employee.name} {employee.last_name}
                        </p>
                        {employee.phone && (
                          <p className="text-xs text-foreground/60">
                            {formatPhone(employee.phone)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {employee.group_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <EmployeeStatusBadge status={employee.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">
                      {employee.hire_date.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditEmployee(employee)
                            }
                          >
                            <Edit size={14} className="mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(employee)
                            }
                          >
                            <Power size={14} className="mr-2" />
                            {employee.status === "active"
                              ? "Desativar"
                              : "Ativar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              {Math.min(
                startIndex + itemsPerPage,
                filteredEmployees.length,
              )}{" "}
              de {filteredEmployees.length} funcionários
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

      {/* Dialog */}
      <EmployeeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        groups={groups}
      />
    </div>
  )
}