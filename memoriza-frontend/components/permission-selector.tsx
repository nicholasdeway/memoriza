"use client"

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Ruler, 
  Palette, 
  ShoppingCart, 
  Settings,
  Image
} from 'lucide-react'
import type { Permission, ModuleType } from '@/lib/employee-types'
import { moduleLabels } from '@/lib/employee-mock-data'

interface PermissionSelectorProps {
  value: Permission[]
  onChange: (permissions: Permission[]) => void
}

const moduleIcons: Record<ModuleType, React.ComponentType<{ size?: number; className?: string }>> = {
  dashboard: LayoutDashboard,
  products: Package,
  categories: FolderTree,
  sizes: Ruler,
  colors: Palette,
  orders: ShoppingCart,
  carousel: Image,
  settings: Settings,
  employees: LayoutDashboard,
  groups: LayoutDashboard,
  logs: LayoutDashboard,
  account_settings: Settings
}

const moduleActions: Record<ModuleType, string[]> = {
  dashboard: ['view', 'export'],
  products: ['view', 'create', 'edit', 'delete'],
  categories: ['view', 'create', 'edit', 'delete'],
  sizes: ['view', 'create', 'edit', 'delete'],
  colors: ['view', 'create', 'edit', 'delete'],
  orders: ['view', 'create', 'edit', 'delete', 'update_status'],
  carousel: ['view', 'create', 'edit', 'delete'],
  settings: ['view', 'edit'],
  employees: ['view', 'create', 'edit', 'delete'],
  groups: ['view', 'create', 'edit', 'delete'],
  logs: ['view', 'export'],
  account_settings: ['view', 'edit']
}

const actionLabels: Record<string, string> = {
  view: 'Visualizar',
  create: 'Criar novos',
  edit: 'Editar existentes',
  delete: 'Excluir',
  export: 'Exportar relatórios',
  update_status: 'Alterar status'
}

export function PermissionSelector({ value, onChange }: PermissionSelectorProps) {
  const modules: ModuleType[] = [
    'dashboard',
    'products',
    'categories',
    'sizes',
    'colors',
    'orders',
    'carousel',
    'account_settings'
  ]

  const getPermission = (module: ModuleType): Permission | undefined => {
    return value.find(p => p.module === module)
  }

  const hasAction = (module: ModuleType, action: string): boolean => {
    const permission = getPermission(module)
    if (!permission) return false
    return (permission.actions as any)[action] === true
  }

  const toggleAction = (module: ModuleType, action: string) => {
    const existingPermission = getPermission(module)
    
    if (!existingPermission) {
      // Criar nova permissão para este módulo
      const newPermission: Permission = {
        module,
        actions: { [action]: true } as any
      }
      onChange([...value, newPermission])
    } else {
      // Atualizar permissão existente
      const updatedActions = {
        ...existingPermission.actions,
        [action]: !existingPermission.actions[action as keyof typeof existingPermission.actions]
      }
      
      // Verificar se ainda há alguma ação ativa
      const hasAnyAction = Object.values(updatedActions).some(v => v === true)
      
      if (hasAnyAction) {
        // Atualizar permissão
        onChange(
          value.map(p =>
            p.module === module ? { ...p, actions: updatedActions } : p
          )
        )
      } else {
        // Remover permissão se não há ações ativas
        onChange(value.filter(p => p.module !== module))
      }
    }
  }

  const toggleAllModule = (module: ModuleType) => {
    const actions = moduleActions[module]
    const existingPermission = getPermission(module)
    
    // Verificar se todas as ações estão marcadas
    const allChecked = actions.every(action => hasAction(module, action))
    
    if (allChecked) {
      // Desmarcar todas (remover permissão)
      onChange(value.filter(p => p.module !== module))
    } else {
      // Marcar todas
      const newActions: any = {}
      actions.forEach(action => {
        newActions[action] = true
      })
      
      if (existingPermission) {
        onChange(
          value.map(p =>
            p.module === module ? { ...p, actions: newActions } : p
          )
        )
      } else {
        onChange([...value, { module, actions: newActions }])
      }
    }
  }

  const isModuleFullyChecked = (module: ModuleType): boolean => {
    const actions = moduleActions[module]
    return actions.every(action => hasAction(module, action))
  }

  const isModulePartiallyChecked = (module: ModuleType): boolean => {
    const actions = moduleActions[module]
    const checkedCount = actions.filter(action => hasAction(module, action)).length
    return checkedCount > 0 && checkedCount < actions.length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Permissões por Módulo</h3>
        <p className="text-xs text-foreground/60">
          {value.length} {value.length === 1 ? 'módulo selecionado' : 'módulos selecionados'}
        </p>
      </div>

      <div className="space-y-4">
        {modules.map(module => {
          const Icon = moduleIcons[module]
          const actions = moduleActions[module]
          const isFullyChecked = isModuleFullyChecked(module)
          const isPartiallyChecked = isModulePartiallyChecked(module)

          return (
            <div
              key={module}
              className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {moduleLabels[module]}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => toggleAllModule(module)}
                  className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  {isFullyChecked ? 'Desmarcar todas' : 'Selecionar todas'}
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
                {actions.map(action => (
                  <div key={action} className="flex items-center gap-2">
                    <Checkbox
                      id={`${module}-${action}`}
                      checked={hasAction(module, action)}
                      onCheckedChange={() => toggleAction(module, action)}
                    />
                    <Label
                      htmlFor={`${module}-${action}`}
                      className="text-sm text-foreground/80 cursor-pointer"
                    >
                      {actionLabels[action] || action}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Validation Message */}
      {value.length === 0 && (
        <p className="text-sm text-red-600 mt-2">
          Selecione pelo menos uma permissão
        </p>
      )}

      {/* Summary */}
      {value.length > 0 && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <p className="text-xs font-medium text-foreground mb-2">Resumo das Permissões:</p>
          <div className="flex flex-wrap gap-2">
            {value.map(permission => {
              const Icon = moduleIcons[permission.module]
              const actionCount = Object.values(permission.actions).filter(v => v === true).length
              
              return (
                <div
                  key={permission.module}
                  className="flex items-center gap-1.5 px-2 py-1 bg-background border border-border rounded text-xs"
                >
                  <Icon size={12} className="text-foreground/60" />
                  <span className="text-foreground/80">{moduleLabels[permission.module]}</span>
                  <span className="text-foreground/50">({actionCount})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
