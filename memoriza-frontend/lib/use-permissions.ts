import { useAuth } from './auth-context';

type ModuleType =
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
    | 'account_settings';

type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'update_status';

/**
 * Hook para verificar permissões granulares de funcionários
 * 
 * @example
 * const { canCreate, canEdit, canDelete } = usePermissions('products');
 * 
 * return (
 *   <>
 *     {canCreate && <button>Criar Produto</button>}
 *     {canEdit && <button>Editar</button>}
 *     {canDelete && <button>Deletar</button>}
 *   </>
 * );
 */
export function usePermissions(module: ModuleType) {
    const { user, isAdmin } = useAuth();

    // Proprietário (admin sem employeeGroupId) tem todas as permissões
    if (isAdmin && !user?.employeeGroupId) {
        return {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
            canUpdateStatus: true,
            hasPermission: (action: ActionType) => true,
        };
    }

    // Funcionário: verifica permissões do grupo
    const groupPermissions = user?.groupPermissions || [];
    const modulePermission = groupPermissions.find(
        (p: any) => p.module === module
    );

    if (!modulePermission) {
        // Sem permissão para este módulo
        return {
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canExport: false,
            canUpdateStatus: false,
            hasPermission: (action: ActionType) => false,
        };
    }

    // Extrai ações permitidas
    const actions = modulePermission.actions || {};

    // Helper para verificar ação case-insensitive
    const hasAction = (action: string) => {
        if (!actions) return false;
        // 1. Match exato
        if (actions[action] === true) return true;
        // 2. Match Capitalized (Create)
        const capitalized = action.charAt(0).toUpperCase() + action.slice(1);
        if (actions[capitalized] === true) return true;
        // 3. Match UPPERCASE (CREATE)
        if (actions[action.toUpperCase()] === true) return true;

        return false;
    };

    return {
        canView: hasAction('view'),
        canCreate: hasAction('create'),
        canEdit: hasAction('edit'),
        canDelete: hasAction('delete'),
        canExport: hasAction('export'),
        canUpdateStatus: hasAction('update_status') || hasAction('updateStatus'), // suporte a camelCase também
        hasPermission: (action: ActionType) => hasAction(action),
    };
}
