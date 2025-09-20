"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState, loginDemo, logoutDemo, getCurrentUser } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Check for existing session on mount
    const user = getCurrentUser()
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false
    })
  }, [])

  const login = (role: string) => {
    try {
      const user = loginDemo(role as any)
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = () => {
    logoutDemo()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

