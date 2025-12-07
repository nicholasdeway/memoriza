"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PermissionSelector } from "@/components/permission-selector"
import type { UserGroup, GroupFormData } from "@/lib/employee-types"
import { getEmployeesByGroup } from "@/lib/employee-mock-data"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

interface GroupFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: UserGroup | null
  mode?: "create" | "edit" | "duplicate"
  onSave: (data: GroupFormData) => void | Promise<void>
}

export function GroupFormDialog({
  open,
  onOpenChange,
  group,
  mode = "create",
  onSave,
}: GroupFormDialogProps) {
  const isEdit = mode === "edit"
  const isDuplicate = mode === "duplicate"

  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    description: "",
    is_active: true,
    permissions: [],
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof GroupFormData, string>>
  >({})

  useEffect(() => {
    if (group) {
      if (isDuplicate) {
        setFormData({
          name: `${group.name} (Cópia)`,
          description: group.description ?? "",
          is_active: true,
          permissions: [...group.permissions],
        })
      } else {
        setFormData({
          name: group.name,
          description: group.description ?? "",
          is_active: group.is_active,
          permissions: [...group.permissions],
        })
      }
    } else {
      setFormData({
        name: "",
        description: "",
        is_active: true,
        permissions: [],
      })
    }
    setErrors({})
  }, [group, mode, open, isDuplicate])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GroupFormData, string>> = {}

    // Nome
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres"
    }

    // Permissões
    if (formData.permissions.length === 0) {
      newErrors.permissions = "Selecione pelo menos uma permissão"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    // Aviso quando desativar grupo com funcionários (mock)
    if (isEdit && group && !formData.is_active && group.is_active) {
      const employees = getEmployeesByGroup(group.id)
      const activeEmployees = employees.filter((emp) => emp.status === "active")

      if (activeEmployees.length > 0) {
        const confirmed = window.confirm(
          `Este grupo possui ${activeEmployees.length} funcionário(s) ativo(s). Ao desativá-lo, eles perderão acesso ao sistema. Deseja continuar?`
        )
        if (!confirmed) return
      }
    }

    await onSave(formData)
    onOpenChange(false)
  }

  const affectedEmployees =
    isEdit && group ? getEmployeesByGroup(group.id) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Novo Grupo de Acesso"}
            {mode === "edit" && "Editar Grupo de Acesso"}
            {mode === "duplicate" && "Duplicar Grupo de Acesso"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Nome do Grupo *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Vendedores, Gerentes, Estoque"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Descrição (opcional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva as responsabilidades deste grupo"
                rows={3}
                maxLength={255}
              />
              <p className="text-xs text-foreground/60 mt-1">
                {formData.description.length}/255 caracteres
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="is_active" className="text-sm font-medium mb-0">
                  Grupo Ativo
                </Label>
                <p className="text-xs text-foreground/60 mt-1">
                  Grupos inativos não podem ser atribuídos a novos funcionários
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          {/* Preview de Funcionários Afetados */}
          {isEdit && affectedEmployees.length > 0 && (
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Funcionários Afetados
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    {affectedEmployees.length} funcionário(s) neste grupo:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {affectedEmployees.slice(0, 5).map((emp) => (
                      <li
                        key={emp.id}
                        className="text-xs text-foreground/80"
                      >
                        • {emp.name} {emp.last_name} (
                        {emp.status === "active" ? "Ativo" : "Inativo"})
                      </li>
                    ))}
                    {affectedEmployees.length > 5 && (
                      <li className="text-xs text-foreground/60">
                        ... e mais {affectedEmployees.length - 5} funcionário(s)
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Permissões */}
          <div>
            <PermissionSelector
              value={formData.permissions}
              onChange={(permissions) =>
                setFormData({ ...formData, permissions })
              }
            />
            {errors.permissions && (
              <p className="text-sm text-red-600 mt-2">
                {errors.permissions}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" && "Criar Grupo"}
              {mode === "edit" && "Salvar Alterações"}
              {mode === "duplicate" && "Criar Cópia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}