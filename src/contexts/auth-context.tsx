'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authManager, AuthUser } from '@/lib/auth-manager'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signInWithGoogle: () => Promise<AuthUser>
  signInAnonymously: () => Promise<AuthUser>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle: authManager.signInWithGoogle.bind(authManager),
    signInAnonymously: authManager.signInAnonymously.bind(authManager),
    signOut: authManager.signOut.bind(authManager),
    deleteAccount: authManager.deleteAccount.bind(authManager),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}