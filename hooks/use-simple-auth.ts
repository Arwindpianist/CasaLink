"use client"

import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export interface CasaLinkUser {
  id: string
  clerk_id: string
  condo_id: string
  unit_id?: string
  role: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  preferences: Record<string, any>
  is_active: boolean
  last_seen_at?: string
  created_at: string
  updated_at: string
}

export function useSimpleAuth() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { getToken } = useAuth()
  const [casalinkUser, setCasaLinkUser] = useState<CasaLinkUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!clerkLoaded || !clerkUser) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Get Clerk token
        const token = await getToken()
        
        if (!token) {
          throw new Error('No authentication token available')
        }

        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setCasaLinkUser(data.user)
        } else if (response.status === 404) {
          console.warn('User not found in Supabase:', clerkUser.id)
          setCasaLinkUser(null)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [clerkLoaded, clerkUser])

  const refreshUser = async () => {
    if (!clerkUser) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Get Clerk token
      const token = await getToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCasaLinkUser(data.user)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      console.error('Error refreshing user:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (updates: Partial<CasaLinkUser>) => {
    if (!clerkUser) return

    try {
      // Get Clerk token
      const token = await getToken()
      
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const user = await response.json()
        setCasaLinkUser(user)
        return user
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      console.error('Error updating user:', err)
      throw err
    }
  }

  return {
    clerkUser,
    casalinkUser,
    isLoading,
    error,
    refreshUser,
    updateUser,
    isAuthenticated: !!clerkUser && !!casalinkUser,
  }
}
