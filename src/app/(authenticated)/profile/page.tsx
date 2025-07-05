'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ProfilePage() {
  const { user, loading, deleteAccount } = useAuth()
  const router = useRouter()
  const [userDocument, setUserDocument] = useState<Record<string, any> | null>(null)
  const [loadingDoc, setLoadingDoc] = useState(true)

  useEffect(() => {
    // Fetch user document from Firestore
    const fetchUserDocument = async () => {
      if (!user) return
      
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const data = userSnap.data()
          // Add the document ID to the data
          setUserDocument({ id: user.uid, ...data })
        } else {
          toast.error("User profile not found")
        }
      } catch (error) {
        console.error("Error fetching user document:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoadingDoc(false)
      }
    }

    if (user) {
      fetchUserDocument()
    }
  }, [user])

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      await deleteAccount()
      toast.success("Account deleted successfully")
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Convert document data to sorted array for table display
  const getTableData = () => {
    if (!userDocument) return []
    
    return Object.entries(userDocument)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        // Format the value for display
        let displayValue = value
        if (value === null || value === undefined) {
          displayValue = 'N/A'
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Yes' : 'No'
        } else if (value?.toDate && typeof value.toDate === 'function') {
          // Handle Firestore timestamps
          displayValue = value.toDate().toLocaleString()
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value)
        } else {
          displayValue = String(value)
        }
        
        return { key, value: displayValue }
      })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Firebase Auth Card */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Details</CardTitle>
          <CardDescription>Information from Firebase Auth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UID</p>
                  <p className="font-mono text-sm">{user.uid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                  <p>{user.displayName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                  <p>{user.isAnonymous ? 'Anonymous' : 'Google'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firestore Document Card */}
      <Card>
        <CardHeader>
          <CardTitle>Firestore Document</CardTitle>
          <CardDescription>Raw data from the users collection</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDoc ? (
            <p className="text-muted-foreground">Loading document...</p>
          ) : userDocument ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Field</TableHead>
                    <TableHead className="font-medium">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTableData().map(({ key, value }) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono text-sm">{key}</TableCell>
                      <TableCell className="text-sm">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No document found</p>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}