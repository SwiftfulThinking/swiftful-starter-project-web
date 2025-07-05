'use client'

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseAuthGuardOptions {
  redirectTo?: string
  allowedPaths?: string[]
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/', allowedPaths = ['/'] } = options
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip redirect if we're on an allowed path
    if (typeof window !== 'undefined' && allowedPaths.includes(window.location.pathname)) {
      return
    }

    // Redirect to specified path if not authenticated
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo, allowedPaths])

  return { user, loading, isAuthenticated: !!user }
}