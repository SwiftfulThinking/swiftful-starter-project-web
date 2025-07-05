'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/home")
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Successfully signed in!")
      router.push("/home")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <Button onClick={handleGoogleSignIn} size="lg">
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}