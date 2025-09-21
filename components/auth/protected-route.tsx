"use client"

import { useUser } from '@clerk/nextjs'
import { useSimpleAuth } from '@/hooks/use-simple-auth'
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
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { casalinkUser, isLoading: supabaseLoading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!clerkLoaded || supabaseLoading) return

    if (!clerkUser) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    if (!casalinkUser) {
      // User exists in Clerk but not synced to Supabase yet
      // Show loading or redirect to login
      return
    }

    // Check role-based access
    if (requiredRole && casalinkUser.role !== requiredRole) {
      // Redirect to appropriate default path for user's role
      const defaultPaths = {
        platform_admin: '/admin',
        management: '/admin',
        security: '/security',
        resident: '/resident',
        visitor: '/visitor',
        moderator: '/resident'
      }
      const defaultPath = defaultPaths[casalinkUser.role as keyof typeof defaultPaths] || '/demo'
      router.push(defaultPath)
      return
    }
  }, [clerkUser, clerkLoaded, casalinkUser, supabaseLoading, requiredRole, router])

  if (!clerkLoaded || supabaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!clerkUser) {
    return null // Will redirect to login
  }

  if (!casalinkUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Syncing user data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

