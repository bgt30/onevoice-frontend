import { TokenManager } from './http-client'
import { getApiUrl } from './config'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface VideoProcessingUpdate {
  videoId: string
  status: 'processing' | 'completed' | 'failed'
  progress?: number
  message?: string
  error?: string
}

export interface NotificationUpdate {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  createdAt: string
}

export interface SubscriptionUpdate {
  subscriptionId: string
  status: string
  creditsRemaining: number
  planName: string
}

export type WebSocketEventType = 
  | 'video.processing.started'
  | 'video.processing.progress'
  | 'video.processing.completed'
  | 'video.processing.failed'
  | 'notification.new'
  | 'subscription.updated'
  | 'credits.updated'

export interface WebSocketEventHandlers {
  'video.processing.started'?: (data: VideoProcessingUpdate) => void
  'video.processing.progress'?: (data: VideoProcessingUpdate) => void
  'video.processing.completed'?: (data: VideoProcessingUpdate) => void
  'video.processing.failed'?: (data: VideoProcessingUpdate) => void
  'notification.new'?: (data: NotificationUpdate) => void
  'subscription.updated'?: (data: SubscriptionUpdate) => void
  'credits.updated'?: (data: { credits_remaining: number }) => void
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private eventHandlers: Map<string, Set<Function>> = new Map()
  private isConnecting = false
  private shouldReconnect = true
  private tokenManager = TokenManager.getInstance()

  constructor() {
    this.connect()
  }

  private getWebSocketUrl(): string {
    const baseUrl = getApiUrl('').replace('http', 'ws')
    const token = this.tokenManager.getToken()
    return `${baseUrl}/ws${token ? `?token=${token}` : ''}`
  }

  public connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    if (typeof window === 'undefined') {
      return // Don't connect on server side
    }

    this.isConnecting = true

    try {
      const wsUrl = this.getWebSocketUrl()
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private handleOpen(): void {
    console.log('WebSocket connected')
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.startHeartbeat()
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      this.emit(message.type, message.data)
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason)
    this.isConnecting = false
    this.stopHeartbeat()

    if (this.shouldReconnect && event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error)
    this.isConnecting = false
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)

    setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // Send ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  public on<T extends keyof WebSocketEventHandlers>(
    event: T,
    handler: WebSocketEventHandlers[T]
  ): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    
    this.eventHandlers.get(event)!.add(handler as Function)

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event)
      if (handlers) {
        handlers.delete(handler as Function)
      }
    }
  }

  public off<T extends keyof WebSocketEventHandlers>(
    event: T,
    handler: WebSocketEventHandlers[T]
  ): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler as Function)
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error)
        }
      })
    }
  }

  public send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message)
    }
  }

  public disconnect(): void {
    this.shouldReconnect = false
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  public reconnect(): void {
    this.disconnect()
    this.shouldReconnect = true
    this.reconnectAttempts = 0
    this.connect()
  }

  public getConnectionState(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'open'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'closed'
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager()

// React hook for WebSocket events
export function useWebSocket() {
  return {
    manager: webSocketManager,
    isConnected: webSocketManager.isConnected(),
    connectionState: webSocketManager.getConnectionState(),
    connect: () => webSocketManager.connect(),
    disconnect: () => webSocketManager.disconnect(),
    reconnect: () => webSocketManager.reconnect(),
  }
}
