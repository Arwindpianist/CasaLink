"use client"

import { useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { 
  CasaLinkUser, 
  getUserByClerkIdClient, 
  updateUserLastSeenClient,
  createClientSupabaseClient 
} from '@/lib/clerk-supabase-client'

export function useClerkSupabase() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { getToken } = useAuth()
  const [casalinkUser, setCasaLinkUser] = useState<CasaLinkUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function syncUser() {
      if (!clerkLoaded || !clerkUser) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Get Clerk token
        const token = await getToken({ template: 'supabase' })
        
        if (token) {
          // Get user from Supabase
          const user = await getUserByClerkIdClient(clerkUser.id, token)
          
          if (user) {
            setCasaLinkUser(user)
            // Update last seen timestamp
            await updateUserLastSeenClient(clerkUser.id, token)
          } else {
            // User doesn't exist in Supabase yet
            // This should be handled by the webhook, but we can create a placeholder
            console.warn('User not found in Supabase:', clerkUser.id)
          }
        }
      } catch (err) {
        console.error('Error syncing user:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    syncUser()
  }, [clerkLoaded, clerkUser])

  const refreshUser = async () => {
    if (!clerkUser) return

    try {
      setIsLoading(true)
      setError(null)
      
      const token = await getToken({ template: 'supabase' })
      
      if (token) {
        const user = await getUserByClerkIdClient(clerkUser.id, token)
        setCasaLinkUser(user)
        
        if (user) {
          await updateUserLastSeenClient(clerkUser.id, token)
        }
      }
    } catch (err) {
      console.error('Error refreshing user:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    clerkUser,
    casalinkUser,
    isLoading,
    error,
    refreshUser,
    isAuthenticated: !!clerkUser && !!casalinkUser,
  }
}

// Hook for getting Supabase client with Clerk token
export function useSupabaseClient() {
  const { getToken } = useAuth()
  const [supabaseClient, setSupabaseClient] = useState<any>(null)

  useEffect(() => {
    async function createClient() {
      try {
        const token = await getToken({ template: 'supabase' })
        if (token) {
          const client = createClientSupabaseClient(token)
          setSupabaseClient(client)
        }
      } catch (error) {
        console.error('Error creating Supabase client:', error)
      }
    }

    createClient()
  }, [getToken])

  return supabaseClient
}
