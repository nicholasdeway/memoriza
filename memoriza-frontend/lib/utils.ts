import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRefundStatusLabel(status: string | null | undefined): string {
  if (!status) return "";
  const map: Record<string, string> = {
    "Requested": "Solicitado",
    "Approved": "Aprovado",
    "Rejected": "Recusado",
    "None": "",
  };
  return map[status] || status;
}
