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
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setUser(user)
      // Only set loading to false after the first auth state change
      // This prevents the race condition where Firebase fires with null before loading persisted session
      if (!hasInitialized) {
        setHasInitialized(true)
        // Add a small delay to ensure Firebase has fully initialized
        setTimeout(() => setLoading(false), 50)
      } else {
        setLoading(false)
      }
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