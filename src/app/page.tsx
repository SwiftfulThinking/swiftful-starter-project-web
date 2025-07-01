'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Home() {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Successfully signed in!")
      router.push("/home")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    }
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