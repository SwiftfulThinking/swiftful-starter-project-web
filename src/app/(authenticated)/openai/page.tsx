'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { openAIManager } from "@/lib/openai-manager"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function OpenAIPage() {
  const { user, loading } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo")

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">OpenAI</h1>
        <p className="text-muted-foreground mt-2">Test the OpenAI API integration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat with AI</CardTitle>
          <CardDescription>
            Send a prompt to OpenAI and get a response. Press Cmd+Enter to submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model">
                <SelectValue />
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
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px]"
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
                Processing...
              </>
            ) : (
              'Send Prompt'
            )}
          </Button>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>AI response to your prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="whitespace-pre-wrap text-sm">{response}</div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${openAIManager.isConfigured() ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>API Key: {openAIManager.isConfigured() ? 'Configured' : 'Not configured'}</span>
            </div>
            <div className="text-muted-foreground">
              Available models: {openAIManager.availableModels.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}