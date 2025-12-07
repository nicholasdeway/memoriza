import type { UserGroup, Employee, AccessLog, Permission, ModuleType, ActionType } from './employee-types';

// ============================================
// GRUPOS DE ACESSO MOCKADOS
// ============================================

export const mockUserGroups: UserGroup[] = [
    {
        id: '1',
        name: 'Vendedores',
        description: 'Equipe de vendas com acesso a produtos e pedidos',
        is_active: true,
        created_at: new Date('2024-01-15'),
        employee_count: 5,
        permissions: [
            {
                module: 'dashboard',
                actions: { view: true, export: false }
            },
            {
                module: 'products',
                actions: { view: true, create: false, edit: false, delete: false }
            },
            {
                module: 'orders',
                actions: { view: true, create: true, edit: true, delete: false, update_status: true }
            }
        ]
    },
    {
        id: '2',
        name: 'Gerentes',
        description: 'Gerentes com acesso completo exceto configurações',
        is_active: true,
        created_at: new Date('2024-01-10'),
        employee_count: 3,
        permissions: [
            {
                module: 'dashboard',
                actions: { view: true, export: true }
            },
            {
                module: 'products',
                actions: { view: true, create: true, edit: true, delete: true }
            },
            {
                module: 'categories',
                actions: { view: true, create: true, edit: true, delete: true }
            },
            {
                module: 'sizes',
                actions: { view: true, create: true, edit: true, delete: true }
            },
            {
                module: 'colors',
                actions: { view: true, create: true, edit: true, delete: true }
            },
            {
                module: 'orders',
                actions: { view: true, create: true, edit: true, delete: true, update_status: true }
            }
        ]
    },
    {
        id: '3',
        name: 'Estoque',
        description: 'Equipe de estoque com foco em produtos',
        is_active: true,
        created_at: new Date('2024-02-01'),
        employee_count: 4,
        permissions: [
            {
                module: 'dashboard',
                actions: { view: true, export: false }
            },
            {
                module: 'products',
                actions: { view: true, create: true, edit: true, delete: false }
            },
            {
                module: 'categories',
                actions: { view: true, create: false, edit: false, delete: false }
            },
            {
                module: 'sizes',
                actions: { view: true, create: true, edit: true, delete: false }
            },
            {
                module: 'colors',
                actions: { view: true, create: true, edit: true, delete: false }
            }
        ]
    },
    {
        id: '4',
        name: 'Suporte',
        description: 'Equipe de suporte ao cliente',
        is_active: false,
        created_at: new Date('2024-03-10'),
        employee_count: 2,
        permissions: [
            {
                module: 'dashboard',
                actions: { view: true, export: false }
            },
            {
                module: 'orders',
                actions: { view: true, create: false, edit: true, delete: false, update_status: true }
            },
            {
                module: 'account_settings',
                actions: { view: true, edit: false }
            }
        ]
    }
];

// ============================================
// FUNCIONÁRIOS MOCKADOS
// ============================================

export const mockEmployees: Employee[] = [
    {
        id: 'emp-001',
        name: 'João',
        last_name: 'Silva',
        email: 'joao.silva@memoriza.com',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-01-15'),
        status: 'active',
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15')
    },
    {
        id: 'emp-002',
        name: 'Maria',
        last_name: 'Santos',
        email: 'maria.santos@memoriza.com',
        phone: '(11) 98765-4322',
        cpf: '234.567.890-11',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-02-01'),
        status: 'active',
        created_at: new Date('2024-02-01'),
        updated_at: new Date('2024-02-01')
    },
    {
        id: 'emp-003',
        name: 'Pedro',
        last_name: 'Oliveira',
        email: 'pedro.oliveira@memoriza.com',
        phone: '(11) 98765-4323',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-02-15'),
        status: 'active',
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
    },
    {
        id: 'emp-004',
        name: 'Ana',
        last_name: 'Costa',
        email: 'ana.costa@memoriza.com',
        phone: '(11) 98765-4324',
        cpf: '345.678.901-22',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-03-01'),
        status: 'active',
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
    },
    {
        id: 'emp-005',
        name: 'Carlos',
        last_name: 'Ferreira',
        email: 'carlos.ferreira@memoriza.com',
        phone: '(11) 98765-4325',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-03-15'),
        status: 'inactive',
        created_at: new Date('2024-03-15'),
        updated_at: new Date('2024-11-20')
    },
    {
        id: 'emp-006',
        name: 'Juliana',
        last_name: 'Almeida',
        email: 'juliana.almeida@memoriza.com',
        phone: '(11) 98765-4326',
        cpf: '456.789.012-33',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-04-01'),
        status: 'active',
        created_at: new Date('2024-04-01'),
        updated_at: new Date('2024-04-01')
    },
    {
        id: 'emp-007',
        name: 'Roberto',
        last_name: 'Souza',
        email: 'roberto.souza@memoriza.com',
        phone: '(11) 98765-4327',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-05-01'),
        status: 'active',
        created_at: new Date('2024-05-01'),
        updated_at: new Date('2024-05-01')
    },
    {
        id: 'emp-008',
        name: 'Fernanda',
        last_name: 'Lima',
        email: 'fernanda.lima@memoriza.com',
        phone: '(11) 98765-4328',
        cpf: '567.890.123-44',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-06-01'),
        status: 'active',
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01')
    },
    {
        id: 'emp-009',
        name: 'Ricardo',
        last_name: 'Pereira',
        email: 'ricardo.pereira@memoriza.com',
        phone: '(11) 98765-4329',
        group_id: '4',
        group_name: 'Suporte',
        hire_date: new Date('2024-07-01'),
        status: 'active',
        created_at: new Date('2024-07-01'),
        updated_at: new Date('2024-07-01')
    },
    {
        id: 'emp-010',
        name: 'Beatriz',
        last_name: 'Rodrigues',
        email: 'beatriz.rodrigues@memoriza.com',
        phone: '(11) 98765-4330',
        cpf: '678.901.234-55',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-08-01'),
        status: 'active',
        created_at: new Date('2024-08-01'),
        updated_at: new Date('2024-08-01')
    },
    {
        id: 'emp-011',
        name: 'Lucas',
        last_name: 'Martins',
        email: 'lucas.martins@memoriza.com',
        phone: '(11) 98765-4331',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-09-01'),
        status: 'active',
        created_at: new Date('2024-09-01'),
        updated_at: new Date('2024-09-01')
    },
    {
        id: 'emp-012',
        name: 'Camila',
        last_name: 'Barbosa',
        email: 'camila.barbosa@memoriza.com',
        phone: '(11) 98765-4332',
        cpf: '789.012.345-66',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-10-01'),
        status: 'active',
        created_at: new Date('2024-10-01'),
        updated_at: new Date('2024-10-01')
    },
    {
        id: 'emp-013',
        name: 'Gabriel',
        last_name: 'Araújo',
        email: 'gabriel.araujo@memoriza.com',
        phone: '(11) 98765-4333',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-10-15'),
        status: 'active',
        created_at: new Date('2024-10-15'),
        updated_at: new Date('2024-10-15')
    },
    {
        id: 'emp-014',
        name: 'Patrícia',
        last_name: 'Mendes',
        email: 'patricia.mendes@memoriza.com',
        phone: '(11) 98765-4334',
        group_id: '4',
        group_name: 'Suporte',
        hire_date: new Date('2024-11-01'),
        status: 'inactive',
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2024-11-25')
    }
];

// ============================================
// LABELS E HELPERS
// ============================================

export const moduleLabels: Record<ModuleType, string> = {
    dashboard: 'Dashboard',
    products: 'Produtos',
    categories: 'Categorias',
    sizes: 'Tamanhos',
    colors: 'Cores',
    orders: 'Pedidos',
    carousel: 'Carrossel',
    settings: 'Configurações',
    employees: 'Funcionários',
    groups: 'Grupos',
    logs: 'Logs',
    account_settings: 'Configurações da Conta'
};

export const actionLabels: Record<ActionType, string> = {
    login: 'Login',
    logout: 'Logout',
    create: 'Criar',
    edit: 'Editar',
    delete: 'Excluir',
    view: 'Visualizar',
    export: 'Exportar',
    update_status: 'Atualizar Status',
    reorder: 'Reorganizar'
};

// ============================================
// LOGS DE ACESSO MOCKADOS
// ============================================

const generateMockLogs = (): AccessLog[] => {
    const logs: AccessLog[] = [];
    const now = new Date();

    // Gerar logs dos últimos 30 dias
    for (let i = 0; i < 60; i++) {
        const employee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
        const actions: ActionType[] = ['login', 'logout', 'create', 'edit', 'delete', 'view', 'export'];
        const modules: ModuleType[] = ['dashboard', 'products', 'categories', 'sizes', 'colors', 'orders'];

        const action = actions[Math.floor(Math.random() * actions.length)];
        const module = modules[Math.floor(Math.random() * modules.length)];

        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        let description = '';

        switch (action) {
            case 'login':
                description = `${employee.name} ${employee.last_name} fez login no sistema`;
                break;
            case 'logout':
                description = `${employee.name} ${employee.last_name} fez logout do sistema`;
                break;
            case 'create':
                description = `${employee.name} ${employee.last_name} criou um item em ${moduleLabels[module]}`;
                break;
            case 'edit':
                description = `${employee.name} ${employee.last_name} editou um item em ${moduleLabels[module]}`;
                break;
            case 'delete':
                description = `${employee.name} ${employee.last_name} excluiu um item de ${moduleLabels[module]}`;
                break;
            case 'view':
                description = `${employee.name} ${employee.last_name} visualizou ${moduleLabels[module]}`;
                break;
            case 'export':
                description = `${employee.name} ${employee.last_name} exportou relatório de ${moduleLabels[module]}`;
                break;
            case 'update_status':
                description = `${employee.name} ${employee.last_name} atualizou o status em ${moduleLabels[module]}`;
                break;
            case 'reorder':
                description = `${employee.name} ${employee.last_name} reorganizou a ordem do ${moduleLabels[module]}`;
                break;
        }

        logs.push({
            id: `log-${i + 1}`,
            employee_id: employee.id,
            employee_name: `${employee.name} ${employee.last_name}`,
            employee_role: employee.group_name || 'N/A',
            action,
            module,
            description,
            timestamp
        });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockAccessLogs = generateMockLogs();

export const actionColors: Record<ActionType, string> = {
    login: 'bg-green-100 text-green-700 border-green-200',
    logout: 'bg-gray-100 text-gray-700 border-gray-200',
    create: 'bg-blue-100 text-blue-700 border-blue-200',
    edit: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    delete: 'bg-red-100 text-red-700 border-red-200',
    view: 'bg-purple-100 text-purple-700 border-purple-200',
    export: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    update_status: 'bg-orange-100 text-orange-700 border-orange-200',
    reorder: 'bg-cyan-100 text-cyan-700 border-cyan-200'
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

export const getEmployeesByGroup = (groupId: string): Employee[] => {
    return mockEmployees.filter(emp => emp.group_id === groupId);
};

export const getGroupById = (groupId: string): UserGroup | undefined => {
    return mockUserGroups.find(group => group.id === groupId);
};

export const getEmployeeById = (employeeId: string): Employee | undefined => {
    return mockEmployees.find(emp => emp.id === employeeId);
};

export const isEmailUnique = (email: string, excludeId?: string): boolean => {
    return !mockEmployees.some(emp => emp.email === email && emp.id !== excludeId);
};

export const isCpfUnique = (cpf: string, excludeId?: string): boolean => {
    return !mockEmployees.some(emp => emp.cpf === cpf && emp.id !== excludeId);
};

export const isGroupNameUnique = (name: string, excludeId?: string): boolean => {
    return !mockUserGroups.some(group => group.name === name && group.id !== excludeId);
};
