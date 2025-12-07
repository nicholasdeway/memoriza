// Tipos de módulos disponíveis no sistema
export type ModuleType =
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'sizes'
    | 'colors'
    | 'orders'
    | 'carousel'
    | 'settings'
    | 'employees'
    | 'groups'
    | 'logs'
    | 'account_settings'

// Tipos de ações nos logs
export type ActionType =
    | 'login'
    | 'logout'
    | 'create'
    | 'edit'
    | 'delete'
    | 'view'
    | 'export'
    | 'update_status'
    | 'reorder'

// Permissões por módulo
export interface Permission {
    module: ModuleType
    actions: {
        view: boolean
        create?: boolean
        edit?: boolean
        delete?: boolean
        export?: boolean
        update_status?: boolean // específico para pedidos
    }
}

// Grupo de acesso
export interface UserGroup {
    id: string
    name: string
    description: string
    permissions: Permission[]
    created_at: Date
    is_active: boolean
    employee_count: number
}

// Status do funcionário
export type EmployeeStatus = 'active' | 'inactive'

// Funcionário
export interface Employee {
    id: string
    // Dados Pessoais
    name: string
    last_name: string
    email: string
    phone: string
    cpf?: string

    // Dados Profissionais
    group_id: string
    group_name?: string // denormalizado para facilitar exibição
    hire_date: Date
    status: EmployeeStatus

    // Metadados
    created_at: Date
    updated_at: Date
}

// Formulário de funcionário
export interface EmployeeFormData {
    name: string
    last_name: string
    email: string
    phone: string
    cpf?: string
    group_id: string
    hire_date: Date
    status: EmployeeStatus
    password?: string
    confirm_password?: string
}

// Formulário de grupo
export interface GroupFormData {
    name: string
    description: string
    is_active: boolean
    permissions: Permission[]
}

// Log de acesso (alinhado com o backend, sem IP)
export interface AccessLog {
    id: string
    employee_id: string
    employee_name: string
    employee_role: string // nome do grupo
    action: ActionType
    module: ModuleType
    description: string
    timestamp: Date
}

// Filtros de logs
export interface LogFilters {
    dateRange?: {
        start: Date
        end: Date
    }
    employeeId?: string
    actions?: ActionType[]
    modules?: ModuleType[]
}

// Estatísticas de logs
export interface LogStatistics {
    accessesToday: number
    accessesThisWeek: number
    accessesThisMonth: number
    topEmployees: Array<{
        employee_name: string
        access_count: number
    }>
    topModules: Array<{
        module: ModuleType
        access_count: number
    }>
}