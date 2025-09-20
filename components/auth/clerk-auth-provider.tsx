"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'

interface ClerkAuthContextType {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => void
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined)

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false)
    }
  }, [isLoaded])

  const contextValue: ClerkAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut: () => signOut()
  }

  return (
    <ClerkAuthContext.Provider value={contextValue}>
      {children}
    </ClerkAuthContext.Provider>
  )
}

export function useClerkAuth() {
  const context = useContext(ClerkAuthContext)
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider')
  }
  return context
}

// Export ClerkSupabaseProvider as an alias for ClerkAuthProvider
export const ClerkSupabaseProvider = ClerkAuthProvider