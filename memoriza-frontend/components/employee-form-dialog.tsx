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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Employee, EmployeeFormData, UserGroup } from "@/lib/employee-types"
import { toast } from "sonner"

interface EmployeeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null
  onSave: (data: EmployeeFormData) => void
  groups: UserGroup[]
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  onSave,
  groups,
}: EmployeeFormDialogProps) {
  
  const isEdit = !!employee

  const activeGroups = Array.isArray(groups)
    ? groups.filter(g => g.is_active)
    : []

  function maskCPF(value?: string) {
  return (value ?? "")
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14)
}

  function maskPhone(value?: string) {
  return (value ?? "")
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15)
}

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    cpf: "",
    group_id: "",
    hire_date: new Date(),
    status: "active",
    password: "",
    confirm_password: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({})

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        last_name: employee.last_name,
        email: employee.email,
        phone: maskPhone(employee.phone || ""),
        cpf: maskCPF(employee.cpf || ""),
        group_id: employee.group_id,
        hire_date: employee.hire_date,
        status: employee.status,
        password: "",
        confirm_password: "",
      })
    } else {
      setFormData({
        name: "",
        last_name: "",
        email: "",
        phone: "",
        cpf: "",
        group_id: "",
        hire_date: new Date(),
        status: "active",
        password: "",
        confirm_password: "",
      })
    }
    setErrors({})
  }, [employee, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {}

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!formData.last_name || formData.last_name.trim().length < 2) {
      newErrors.last_name = "Sobrenome deve ter pelo menos 2 caracteres"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 11) {
      newErrors.phone = "Telefone inválido"
    }

    if (formData.cpf && formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF deve ter 11 dígitos"
    }

    if (!formData.group_id) {
      newErrors.group_id = "Selecione um grupo"
    }

    if (!isEdit) {
      if (!formData.password || formData.password.length < 8) {
        newErrors.password = "Senha deve ter pelo menos 8 caracteres"
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "As senhas não coincidem"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Corrija os erros no formulário")
      return
    }

    onSave({
      ...formData,
      cpf: (formData.cpf ?? "").replace(/\D/g, ""),
      phone: (formData.phone ?? "").replace(/\D/g, "")
    })

    onOpenChange(false)
  }

  const baseInputClass =
    "mb-3 bg-zinc-50 dark:bg-zinc-800/40 placeholder:text-zinc-400 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-600"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* DADOS PESSOAIS */}
          <div>
            <h3 className="text-sm font-medium mb-4">Dados Pessoais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nome */}
              <div>
                <Label className="mb-1 block">Nome *</Label>
                <Input
                  placeholder="Digite o nome"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`${baseInputClass} ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Sobrenome */}
              <div>
                <Label className="mb-1 block">Sobrenome *</Label>
                <Input
                  placeholder="Digite o sobrenome"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  className={`${baseInputClass} ${errors.last_name ? "border-red-500" : ""}`}
                />
                {errors.last_name && <p className="text-xs text-red-600">{errors.last_name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label className="mb-1 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`${baseInputClass} ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Telefone */}
              <div>
                <Label className="mb-1 block">Telefone *</Label>
                <Input
                  placeholder="(99) 99999-9999"
                  value={formData.phone}
                  onChange={e =>
                    setFormData({ ...formData, phone: maskPhone(e.target.value) })
                  }
                  className={`${baseInputClass} ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* CPF */}
              <div>
                <Label className="mb-1 block">CPF (opcional)</Label>
                <Input
                  placeholder="999.999.999-99"
                  value={formData.cpf}
                  onChange={e =>
                    setFormData({ ...formData, cpf: maskCPF(e.target.value) })
                  }
                  className={`${baseInputClass} ${errors.cpf ? "border-red-500" : ""}`}
                />
                {errors.cpf && <p className="text-xs text-red-600">{errors.cpf}</p>}
              </div>

            </div>
          </div>

          {/* DADOS PROFISSIONAIS */}
          <div>
            <h3 className="text-sm font-medium mb-4">Dados Profissionais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Grupo */}
              <div>
                <Label className="mb-1 block">Grupo de Acesso *</Label>
                <Select
                  value={formData.group_id}
                  onValueChange={(value) => setFormData({ ...formData, group_id: value })}
                >
                  <SelectTrigger
                    className={`${baseInputClass} ${errors.group_id ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>

                  <SelectContent>
                    {activeGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.group_id && <p className="text-xs text-red-600">{errors.group_id}</p>}
              </div>

              {/* Data de admissão */}
              <div>
                <Label className="mb-1 block">Data de Admissão</Label>
                <Input
                  type="date"
                  value={formData.hire_date.toISOString().split("T")[0]}
                  onChange={e => setFormData({ ...formData, hire_date: new Date(e.target.value) })}
                  className={baseInputClass}
                />
              </div>

              {/* Status */}
              <div>
                <Label className="mb-1 block">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }>
                  <SelectTrigger className={baseInputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SENHA */}
          <div>
            <h3 className="text-sm font-medium mb-4">
              {isEdit ? "Alterar senha (opcional)" : "Senha de acesso *"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Senha */}
              <div>
                <Label className="mb-1 block">Senha</Label>
                <Input
                  placeholder="Digite a senha"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`${baseInputClass} ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              </div>

              {/* Confirmar Senha */}
              <div>
                <Label className="mb-1 block">Confirmar Senha</Label>
                <Input
                  placeholder="Repita a senha"
                  type="password"
                  value={formData.confirm_password}
                  onChange={e =>
                    setFormData({ ...formData, confirm_password: e.target.value })
                  }
                  className={`${baseInputClass} ${errors.confirm_password ? "border-red-500" : ""}`}
                />
                {errors.confirm_password && (
                  <p className="text-xs text-red-600">{errors.confirm_password}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            <Button type="submit">
              {isEdit ? "Salvar Alterações" : "Criar Funcionário"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}