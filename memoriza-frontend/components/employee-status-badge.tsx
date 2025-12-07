import type { EmployeeStatus } from '@/lib/employee-types'

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus
}

export function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const styles = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const labels = {
    active: 'Ativo',
    inactive: 'Inativo'
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}