"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GroupFormDialog } from "@/components/group-form-dialog"
import { ModuleIcon } from "@/components/module-icon"
import { Plus, Edit, Copy, Power, Users, ChevronDown, ChevronUp } from "lucide-react"
import type { UserGroup, GroupFormData } from "@/lib/employee-types"
import { getEmployeesByGroup, moduleLabels } from "@/lib/employee-mock-data"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7105"

type ApiGroup = {
  id: string
  name: string
  description: string | null
  isActive: boolean
  employeeCount: number
  createdAt: string
  permissions: UserGroup["permissions"]
}

const mapApiToUserGroup = (api: ApiGroup): UserGroup => ({
  id: api.id,
  name: api.name,
  description: api.description ?? "",
  is_active: api.isActive,
  employee_count: api.employeeCount,
  created_at: new Date(api.createdAt),
  permissions: api.permissions ?? [],
})

export default function GruposPage() {
  const { token } = useAuth()

  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "duplicate">("create")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  type ApiEmployee = {
    id: string
    groupId: string
    status: "active" | "inactive"
  }

  const fetchGroups = async () => {
    if (!token) return
    try {
      setLoading(true)

      const [groupsRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/groups`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/api/admin/employees`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ])

      if (!groupsRes.ok) {
        throw new Error(`Erro ao carregar grupos (${groupsRes.status})`)
      }

      const groupsData = (await groupsRes.json()) as ApiGroup[]
      
      let employeeCounts: Record<string, number> = {}
      
      if (employeesRes.ok) {
        const employeesData = (await employeesRes.json()) as ApiEmployee[]
        employeesData.forEach(emp => {
          if (emp.groupId) {
            employeeCounts[emp.groupId] = (employeeCounts[emp.groupId] || 0) + 1
          }
        })
      }

      setGroups(groupsData.map(g => ({
        ...mapApiToUserGroup(g),
        employee_count: employeeCounts[g.id] || 0
      })))

    } catch (error) {
      console.error("Erro ao carregar grupos:", error)
      toast.error("Não foi possível carregar os grupos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [token])

  const handleCreateGroup = () => {
    setSelectedGroup(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroup(group)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleDuplicateGroup = (group: UserGroup) => {
    setSelectedGroup(group)
    setDialogMode("duplicate")
    setDialogOpen(true)
  }

  const handleSaveGroup = async (data: GroupFormData) => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.")
      return
    }

    try {
      const isEdit = dialogMode === "edit" && selectedGroup

      const url = isEdit
        ? `${API_BASE_URL}/api/admin/groups/${selectedGroup!.id}`
        : `${API_BASE_URL}/api/admin/groups`

      const method = isEdit ? "PUT" : "POST"

      const body = JSON.stringify({
        name: data.name,
        description: data.description,
        isActive: data.is_active,
        permissions: data.permissions,
      })

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Erro ao salvar grupo:", text)
        throw new Error(text || "Erro ao salvar grupo")
      }

      await fetchGroups()

      if (isEdit) {
        toast.success("Grupo atualizado com sucesso!")
      } else {
        toast.success("Grupo criado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Não foi possível salvar o grupo. Verifique os dados e tente novamente.")
    }
  }

  const handleToggleStatus = async (group: UserGroup) => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.")
      return
    }

    // Lógica de aviso baseada nos mocks (por enquanto)
    if (group.is_active) {
      const employees = getEmployeesByGroup(group.id)
      const activeEmployees = employees.filter((emp) => emp.status === "active")

      if (activeEmployees.length > 0) {
        const confirmed = window.confirm(
          `Este grupo possui ${activeEmployees.length} funcionário(s) ativo(s). Ao desativá-lo, eles perderão acesso ao sistema. Deseja continuar?`
        )
        if (!confirmed) return
      }
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/groups/${group.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !group.is_active,
          }),
        }
      )

      if (!res.ok) {
        const text = await res.text()
        console.error("Erro ao atualizar status do grupo:", text)
        throw new Error(text || "Erro ao atualizar status do grupo")
      }

      setGroups((prev) =>
        prev.map((g) =>
          g.id === group.id ? { ...g, is_active: !g.is_active } : g
        )
      )

      toast.success(
        `Grupo ${!group.is_active ? "ativado" : "desativado"} com sucesso!`
      )
    } catch (error) {
      console.error(error)
      toast.error("Não foi possível alterar o status do grupo.")
    }
  }

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground">Grupos & Permissões</h1>
          <p className="text-foreground/60">
            Gerencie grupos de acesso e suas permissões
          </p>
        </div>
        <Button onClick={handleCreateGroup} className="gap-2">
          <Plus size={18} />
          Novo Grupo
        </Button>
      </div>

      {/* Loading simples */}
      {loading && groups.length === 0 && (
        <p className="text-sm text-foreground/60 mb-4">
          Carregando grupos...
        </p>
      )}

      {/* Grid de Grupos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => {
          const isExpanded = expandedGroups.has(group.id)
          const employees = getEmployeesByGroup(group.id)

          return (
            <div
              key={group.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header do Card */}
              <div className="p-6 border-b border-border bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-foreground">
                        {group.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          group.is_active
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {group.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-foreground/60">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contador de Funcionários */}
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Users size={16} />
                  <span>{group.employee_count} funcionário(s)</span>
                </div>
              </div>

              {/* Resumo de Permissões */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-foreground">
                    Permissões ({group.permissions.length} módulo
                    {group.permissions.length !== 1 ? "s" : ""})
                  </p>
                  <button
                    onClick={() => toggleExpanded(group.id)}
                    className="text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={14} />
                        Ocultar detalhes
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        Ver detalhes
                      </>
                    )}
                  </button>
                </div>

                {/* Ícones dos Módulos */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.module}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg"
                      title={moduleLabels[permission.module]}
                    >
                      <ModuleIcon
                        module={permission.module}
                        size={14}
                        className="text-primary"
                      />
                      <span className="text-xs font-medium text-primary">
                        {moduleLabels[permission.module]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    {group.permissions.map((permission) => {
                      const actions = Object.entries(permission.actions)
                        .filter(([, value]) => value === true)
                        .map(([key]) => key)

                      return (
                        <div key={permission.module} className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <ModuleIcon
                              module={permission.module}
                              size={14}
                              className="text-foreground/60"
                            />
                            <span className="font-medium text-foreground">
                              {moduleLabels[permission.module]}
                            </span>
                          </div>
                          <div className="ml-6 flex flex-wrap gap-1">
                            {actions.map((action) => (
                              <span
                                key={action}
                                className="px-2 py-0.5 bg-muted text-foreground/70 rounded text-xs"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditGroup(group)}
                  className="gap-2"
                >
                  <Edit size={14} />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicateGroup(group)}
                  className="gap-2"
                >
                  <Copy size={14} />
                  Duplicar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(group)}
                  className="gap-2"
                >
                  <Power size={14} />
                  {group.is_active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Estado Vazio */}
      {!loading && groups.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center mt-6">
          <p className="text-foreground/60 mb-4">Nenhum grupo cadastrado</p>
          <Button onClick={handleCreateGroup} className="gap-2">
            <Plus size={18} />
            Criar Primeiro Grupo
          </Button>
        </div>
      )}

      {/* Dialog */}
      <GroupFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={selectedGroup}
        mode={dialogMode}
        onSave={handleSaveGroup}
      />
    </div>
  )
}