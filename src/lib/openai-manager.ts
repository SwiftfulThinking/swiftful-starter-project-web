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

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY environment variable.')
    }
  }

  /**
   * Send a prompt to OpenAI and get a text response
   */
  async prompt(
    userPrompt: string,
    options: OpenAIRequestOptions = {}
  ): Promise<string> {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 1,
      maxOutputTokens = 2048,
      topP = 1,
      store = true,
      systemMessage,
      previousMessages = []
    } = options

    // Build messages array
    const messages: OpenAIMessage[] = []

    // Add system message if provided
    if (systemMessage) {
      messages.push({
        role: 'system',
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
      const response = await this.createResponse(messages, {
        model,
        temperature,
        maxOutputTokens,
        topP,
        store
      })

      // Extract text from the response
      return this.extractTextFromResponse(response)
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Create a response using the OpenAI API
   */
  private async createResponse(
    messages: OpenAIMessage[],
    options: {
      model: string
      temperature: number
      maxOutputTokens: number
      topP: number
      store: boolean
    }
  ): Promise<OpenAIResponse> {
    // Use the standard chat completions endpoint
    const requestBody = {
      model: options.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content.map(c => c.text).join('\n')
      })),
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens,
      top_p: options.topP
    }

    console.log('OpenAI Request:', JSON.stringify(requestBody, null, 2))

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
      console.error('OpenAI API Error:', errorData)
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    console.log('OpenAI Response:', JSON.stringify(data, null, 2))
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

    // Handle alternative response format
    if (response.output && response.output.content) {
      if (typeof response.output.content === 'string') {
        return response.output.content
      }
      if (Array.isArray(response.output.content)) {
        return response.output.content
          .filter((c: any) => c.type === 'text')
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