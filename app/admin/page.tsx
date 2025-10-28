"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLogin } from "@/components/admin-login"
import { AdminTable } from "@/components/admin-table"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_authenticated", "true")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AdminTable onLogout={handleLogout} />
      </div>
    </div>
  )
}
