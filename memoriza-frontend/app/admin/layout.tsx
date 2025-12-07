"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    } else if (!isLoading && user && !isAdmin && !user.employeeGroupId) {
      router.push("/")
    }
  }, [user, isLoading, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  // Permite acesso para Admin OU Funcionários (com employeeGroupId)
  if (!user || (!isAdmin && !user.employeeGroupId)) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
