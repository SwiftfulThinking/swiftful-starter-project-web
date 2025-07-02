'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Home, Package, Settings, LogOut, User, Bot, Loader2 } from "lucide-react"
import { openAIManager } from "@/lib/openai-manager"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function OpenAIPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo")

  useEffect(() => {
    // Redirect to landing page if not authenticated
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Successfully signed out!")
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    if (!openAIManager.isConfigured()) {
      setError("OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.")
      return
    }

    setIsLoading(true)
    setError("")
    setResponse("")

    try {
      const result = await openAIManager.prompt(prompt, {
        model: selectedModel,
        temperature: 0.7,
        maxOutputTokens: 2048,
        reasoningEffort: 'medium'
      })
      setResponse(result)
    } catch (error: any) {
      console.error("OpenAI error:", error)
      setError(error.message || "Failed to get response from OpenAI")
      toast.error("Failed to get AI response")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit()
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
                    <SidebarMenuButton asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
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
                <h1 className="text-4xl font-bold">OpenAI Playground</h1>
                <p className="text-muted-foreground mt-2">Chat with AI using OpenAI's API</p>
              </div>

              <div className="grid gap-6">
                {/* Prompt Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send a Prompt</CardTitle>
                    <CardDescription>
                      Enter your message below and press Submit or Cmd+Enter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger id="model">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {openAIManager.availableModels.map((model) => (
                              <SelectItem key={model.value} value={model.value}>
                                {model.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="info">Model Info</Label>
                        <div className="text-sm text-muted-foreground p-2 border rounded-md h-[40px] flex items-center">
                          {selectedModel.includes('o1') || selectedModel.includes('o3') 
                            ? 'Advanced reasoning model' 
                            : 'Standard chat model'}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Your Prompt</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ask me anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[100px]"
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isLoading || !prompt.trim()}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Response...
                        </>
                      ) : (
                        <>
                          <Bot className="mr-2 h-4 w-4" />
                          Submit Prompt
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Section */}
                {(response || error || isLoading) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Response</CardTitle>
                      <CardDescription>
                        {isLoading ? "Waiting for response..." : "Generated by OpenAI"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {error ? (
                        <div className="text-destructive p-4 bg-destructive/10 rounded-md">
                          <p className="font-medium">Error:</p>
                          <p className="text-sm mt-1">{error}</p>
                        </div>
                      ) : isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                          <div className="whitespace-pre-wrap text-sm">{response}</div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}