'use client'

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  allowedPaths?: string[]
  allow404?: boolean
}

export function AuthGuard({ children, redirectTo = '/', allowedPaths = ['/'], allow404 = false }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Known routes that require authentication
  const protectedRoutes = ['/home', '/profile', '/openai']
  
  useEffect(() => {
    // Don't do anything while loading
    if (loading) return

    // If user is authenticated, don't redirect (allow all pages including 404s)
    if (user) return

    // If on an allowed path, don't redirect
    if (allowedPaths.includes(pathname)) return

    // If allow404 is true and the path is not a known protected route, 
    // assume it's a 404 and don't redirect
    if (allow404 && !protectedRoutes.includes(pathname)) {
      return
    }

    // Not authenticated and on a protected path, redirect
    router.push(redirectTo)
  }, [user, loading, router, redirectTo, allowedPaths, pathname, allow404])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If authenticated, always render children
  // If not authenticated, only render if on allowed path
  if (user || allowedPaths.includes(pathname)) {
    return <>{children}</>
  }

  // Not authenticated and not on allowed path - don't render
  return null
}