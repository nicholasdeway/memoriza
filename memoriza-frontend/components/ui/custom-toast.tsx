import { toast } from "sonner"
import {
  CheckCircle2Icon,
  AlertCircle,
  Info
} from "lucide-react"

export const notify = {
  success: (title: string, description?: string) =>
    toast(title, {
      description,
      icon: <CheckCircle2Icon className="text-emerald-400" />,
    }),

  error: (title: string, description?: string) =>
    toast(title, {
      description,
      icon: <AlertCircle className="text-red-400" />,
    }),

  info: (title: string, description?: string) =>
    toast(title, {
      description,
      icon: <Info className="text-blue-400" />,
    }),
}