interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: Array<{
    type: 'input_text' | 'output_text'
    text: string
  }>
}

interface OpenAIRequestOptions {
  model?: string
  temperature?: number
  maxOutputTokens?: number
  topP?: number
  store?: boolean
  systemMessage?: string
  previousMessages?: OpenAIMessage[]
  reasoningEffort?: 'low' | 'medium' | 'high'
  reasoningSummary?: 'auto' | 'disabled'
}

interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    message: {
      role: string
      content: Array<{
        type: string
        text: string
      }>
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class OpenAIManager {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'
  
  // Reasoning models that use the new API format
  private reasoningModels = ['o1-preview', 'o1-mini', 'o3', 'o3-mini']
  
  // Available models
  public readonly availableModels = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'o1-preview', label: 'O1 Preview (Reasoning)' },
    { value: 'o1-mini', label: 'O1 Mini (Reasoning)' },
    { value: 'o3', label: 'O3 (Advanced Reasoning)' },
    { value: 'o3-mini', label: 'O3 Mini (Reasoning)' }
  ]

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY environment variable.')
    }
  }

  /**
   * Send a prompt to any OpenAI model and get a text response
   * Automatically routes to the appropriate API based on the model
   */
  async prompt(
    userPrompt: string,
    options: OpenAIRequestOptions = {}
  ): Promise<string> {
    const model = options.model || 'gpt-3.5-turbo'
    
    // Check if this is a reasoning model
    if (this.reasoningModels.includes(model)) {
      return this.promptReasoning(userPrompt, options)
    } else {
      return this.promptChat(userPrompt, options)
    }
  }

  /**
   * Send a prompt to standard chat models (GPT-3.5, GPT-4, etc.)
   */
  async promptChat(
    userPrompt: string,
    options: OpenAIRequestOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 1,
      maxOutputTokens = 2048,
      topP = 1,
      systemMessage,
      previousMessages = []
    } = options

    // Build messages array for chat format
    const messages: Array<{ role: string; content: string }> = []

    // Add system message if provided
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage
      })
    }

    // Add previous messages if provided
    previousMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content.map(c => c.text).join('\n')
      })
    })

    // Add current user prompt
    messages.push({
      role: 'user',
      content: userPrompt
    })

    try {
      const response = await this.createChatResponse(messages, {
        model,
        temperature,
        maxOutputTokens,
        topP
      })

      // Extract text from the response
      return this.extractTextFromResponse(response)
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Send a prompt to reasoning models (o1, o3, etc.)
   */
  async promptReasoning(
    userPrompt: string,
    options: OpenAIRequestOptions = {}
  ): Promise<string> {
    const {
      model = 'o3',
      store = true,
      systemMessage,
      previousMessages = [],
      reasoningEffort = 'medium',
      reasoningSummary = 'auto'
    } = options

    // Build messages array for reasoning format
    const messages: OpenAIMessage[] = []

    // Add developer message if system message provided
    if (systemMessage) {
      messages.push({
        role: 'system' as any, // Will be converted to 'developer' in the request
        content: [{
          type: 'input_text',
          text: systemMessage
        }]
      })
    }

    // Add previous messages if provided
    messages.push(...previousMessages)

    // Add current user prompt
    messages.push({
      role: 'user',
      content: [{
        type: 'input_text',
        text: userPrompt
      }]
    })

    try {
      const response = await this.createReasoningResponse(messages, {
        model,
        store,
        reasoningEffort,
        reasoningSummary
      })

      // Extract text from the response
      return this.extractTextFromResponse(response)
    } catch (error) {
      console.error('OpenAI Reasoning API error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Create a response using the standard chat completions API
   */
  private async createChatResponse(
    messages: Array<{ role: string; content: string }>,
    options: {
      model: string
      temperature: number
      maxOutputTokens: number
      topP: number
    }
  ): Promise<OpenAIResponse> {
    const requestBody = {
      model: options.model,
      messages: messages,
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens,
      top_p: options.topP
    }

    console.log('OpenAI Chat Request:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI Chat API Error:', errorData)
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log('OpenAI Chat Response:', JSON.stringify(data, null, 2))
    return data
  }

  /**
   * Create a response using the reasoning API
   */
  private async createReasoningResponse(
    messages: OpenAIMessage[],
    options: {
      model: string
      store: boolean
      reasoningEffort: 'low' | 'medium' | 'high'
      reasoningSummary: 'auto' | 'disabled'
    }
  ): Promise<any> {
    // Convert system role to developer for reasoning API
    const convertedMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'developer' : msg.role,
      content: msg.content
    }))

    const requestBody = {
      model: options.model,
      input: convertedMessages,
      text: {
        format: {
          type: 'text'
        }
      },
      reasoning: {
        effort: options.reasoningEffort,
        summary: options.reasoningSummary
      },
      tools: [],
      store: options.store
    }

    console.log('OpenAI Reasoning Request:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI Reasoning API Error:', errorData)
      throw new Error(
        errorData.error?.message || 
        `OpenAI Reasoning API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log('OpenAI Reasoning Response:', JSON.stringify(data, null, 2))
    return data
  }

  /**
   * Extract text content from OpenAI response
   */
  private extractTextFromResponse(response: any): string {
    // Handle standard chat completions format
    if (response.choices && response.choices.length > 0) {
      const choice = response.choices[0]
      
      // Standard format has content as a string
      if (choice.message && typeof choice.message.content === 'string') {
        return choice.message.content
      }
      
      // Handle array format if present
      if (choice.message && Array.isArray(choice.message.content)) {
        const textContents = choice.message.content
          .filter((content: any) => content.type === 'output_text' || content.type === 'text')
          .map((content: any) => content.text)
          .join('\n')
        return textContents
      }
    }

    // Handle reasoning API response format
    if (response.output && Array.isArray(response.output)) {
      // Find the assistant's output_text
      const assistantOutput = response.output.find((item: any) => 
        item.role === 'assistant' && 
        item.content && 
        Array.isArray(item.content)
      )
      
      if (assistantOutput) {
        const textContent = assistantOutput.content
          .filter((c: any) => c.type === 'output_text')
          .map((c: any) => c.text)
          .join('\n')
        
        if (textContent) return textContent
      }
    }

    // Handle alternative response format
    if (response.output && response.output.content) {
      if (typeof response.output.content === 'string') {
        return response.output.content
      }
      if (Array.isArray(response.output.content)) {
        return response.output.content
          .filter((c: any) => c.type === 'text' || c.type === 'output_text')
          .map((c: any) => c.text)
          .join('\n')
      }
    }

    console.error('Unexpected response format:', response)
    throw new Error('Unable to extract text from OpenAI response')
  }

  /**
   * Build a message object for the API
   */
  buildMessage(
    role: 'system' | 'user' | 'assistant',
    text: string,
    type: 'input_text' | 'output_text' = role === 'assistant' ? 'output_text' : 'input_text'
  ): OpenAIMessage {
    return {
      role,
      content: [{
        type,
        text
      }]
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error
    }
    return new Error('An unexpected error occurred with the OpenAI API')
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }
}

// Export singleton instance
export const openAIManager = new OpenAIManager()

// Export types and class for custom instances
export type { OpenAIMessage, OpenAIRequestOptions, OpenAIResponse }
export { OpenAIManager }