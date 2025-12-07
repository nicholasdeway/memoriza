import type { ModuleType } from '@/lib/employee-types'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Ruler, 
  Palette, 
  ShoppingCart, 
  Settings,
  Image,
  Users,
  Shield,
  FileText
} from 'lucide-react'

interface ModuleIconProps {
  module: ModuleType
  size?: number
  className?: string
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
  employees: Users,
  groups: Shield,
  logs: FileText,
  account_settings: Settings
}

export function ModuleIcon({ module, size = 16, className = '' }: ModuleIconProps) {
  const Icon = moduleIcons[module] || LayoutDashboard
  return <Icon size={size} className={className} />
}
