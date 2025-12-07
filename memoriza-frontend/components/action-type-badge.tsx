import type { ActionType } from '@/lib/employee-types'
import { actionLabels, actionColors } from '@/lib/employee-mock-data'

interface ActionTypeBadgeProps {
  action: ActionType
}

export function ActionTypeBadge({ action }: ActionTypeBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${actionColors[action]}`}>
      {actionLabels[action]}
    </span>
  )
}