"use client"

import { useAuth } from './auth-provider'
import { hasAccess, getDefaultPath } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate default path for user's role
      const defaultPath = getDefaultPath(user.role)
      router.push(defaultPath)
      return
    }

    // Check if user has access to current path
    const currentPath = window.location.pathname
    if (!hasAccess(user.role, currentPath)) {
      const defaultPath = getDefaultPath(user.role)
      router.push(defaultPath)
      return
    }
  }, [user, isAuthenticated, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}

