'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Home, Package, Settings, LogOut, User, Bot } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userDocument, setUserDocument] = useState<Record<string, any> | null>(null)
  const [loadingDoc, setLoadingDoc] = useState(true)

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

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

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Successfully signed out!")
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Global Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/home">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/components">
                        <Package className="mr-2 h-4 w-4" />
                        Components
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/openai">
                        <Bot className="mr-2 h-4 w-4" />
                        OpenAI
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left text-sm min-w-0 flex-1">
                      <span className="font-medium truncate w-full text-left">{user.displayName || 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">{user.email}</span>
                    </div>
                    <Settings className="h-4 w-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end" side="right">
                  <div className="grid gap-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h1 className="text-4xl font-bold">User Profile</h1>
                <p className="text-muted-foreground mt-2">Complete data from Firestore document</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Data</CardTitle>
                  <CardDescription>All fields from your user document in Firestore</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingDoc ? (
                    <div className="text-center py-8">Loading profile data...</div>
                  ) : userDocument ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Field</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTableData().map(({ key, value }) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium">{key}</TableCell>
                            <TableCell className="font-mono text-sm">{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No profile data found</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}