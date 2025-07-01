'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/lib/models/user'
import { authManager } from '@/lib/managers/auth-manager'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
    signUp: authManager.signUp.bind(authManager),
    signIn: authManager.signIn.bind(authManager),
    signInWithGoogle: authManager.signInWithGoogle.bind(authManager),
    signOut: authManager.signOut.bind(authManager),
    sendPasswordReset: authManager.sendPasswordReset.bind(authManager),
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