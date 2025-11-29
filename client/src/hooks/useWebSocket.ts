import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  onMessage?: (data: any) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  error: Error | null;
}

export function useWebSocket({
  url,
  enabled = true,
  onMessage,
  reconnectAttempts = 5,
  reconnectDelay = 1000,
}: UseWebSocketOptions) {
  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    error: null,
  });
  
  const { toast } = useToast();
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(async () => {
    if (!enabled || reconnectCountRef.current >= reconnectAttempts) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setState({ socket: ws, isConnected: true, error: null });
        reconnectCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      ws.onclose = (event) => {
        setState(prev => ({ ...prev, isConnected: false, socket: null }));
        
        if (event.code === 4001 || event.code === 4003) {
          toast({
            title: 'Autenticación fallida',
            description: 'Por favor recarga la página',
            variant: 'destructive',
          });
        } else if (event.code !== 1000 && event.code !== 1001) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(
            connect,
            reconnectDelay * Math.pow(2, reconnectCountRef.current)
          );
        }
      };

      ws.onerror = () => {
        setState(prev => ({ ...prev, error: new Error('WebSocket error') }));
      };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Connection failed') 
      }));
    }
  }, [url, enabled, onMessage, reconnectAttempts, reconnectDelay, toast]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      state.socket?.close();
    };
  }, [enabled, connect]);

  const sendMessage = useCallback((data: any) => {
    if (state.socket?.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [state.socket]);

  return {
    ...state,
    sendMessage,
  };
}
