import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, User as UserType } from "@shared/schema";

export default function Chat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch psychologist information
  const { data: psychologist } = useQuery<UserType>({
    queryKey: ["/api/psychologist"],
    retry: false,
  });
  
  // Determine the other user ID based on current user role
  // NOTE: This component is used in home page - psychologists should use admin panel for patient-specific chats
  const otherUserId = user?.role === 'psychologist' 
    ? null // Psychologists should use admin panel for patient-specific chats
    : psychologist?.id; // Patients chat with the psychologist

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", otherUserId],
    retry: false,
    enabled: !!user && !!otherUserId,
  });

  // Initialize WebSocket connection with secure authentication
  useEffect(() => {
    if (!user) return;

    const connectWebSocket = async () => {
      try {
        // Fetch secure WebSocket token
        const response = await fetch('/api/auth/ws-token', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to get WebSocket token');
        }
        
        const { token } = await response.json();
        
        // Connect to WebSocket with secure token
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.port ? `${window.location.hostname}:${window.location.port}` : window.location.hostname;
        const wsUrl = `${protocol}//${host}/ws?token=${encodeURIComponent(token)}`;
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected securely');
          setSocket(ws);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_message') {
              // Invalidate and refetch messages when new message received
              queryClient.invalidateQueries({ queryKey: ["/api/chat", otherUserId] });
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected', event.code, event.reason);
          setSocket(null);
          
          // Handle authentication failures
          if (event.code === 4001) {
            toast({
              title: "Authentication Failed",
              description: "Chat session expired. Please refresh the page.",
              variant: "destructive",
            });
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast({
            title: "Connection Error",
            description: "Chat connection failed. Please check your connection.",
            variant: "destructive",
          });
        };

        return ws;
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        toast({
          title: "Connection Failed",
          description: "Unable to establish chat connection. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    };

    let cleanup: (() => void) | undefined;
    
    connectWebSocket().then((ws) => {
      if (ws) {
        cleanup = () => ws.close();
      }
    });
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [user, queryClient, otherUserId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !user || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const messageData = {
      type: 'chat_message',
      receiverId: otherUserId,
      message: message.trim(),
    };

    socket.send(JSON.stringify(messageData));
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-muted/50 rounded-2xl" data-testid="chat-container">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground" data-testid="chat-title">
              {user?.role === 'psychologist' ? 'Chat con Pacientes' : 'Chat con Dra. González'}
            </p>
            <p className="text-xs text-muted-foreground">
              {socket?.readyState === WebSocket.OPEN ? 'Conectado' : 'Desconectado'}
            </p>
          </div>
        </div>
        
        <Badge variant={socket?.readyState === WebSocket.OPEN ? "default" : "secondary"} data-testid="connection-status">
          {socket?.readyState === WebSocket.OPEN ? 'En línea' : 'Fuera de línea'}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" data-testid="messages-area">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground" data-testid="no-messages">
                No hay mensajes aún. ¡Inicia la conversación!
              </p>
            </div>
          ) : (
            messages.map((msg: ChatMessage) => {
              const isOwnMessage = msg.senderId === user?.id;
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start space-x-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${msg.id}`}
                >
                  {!isOwnMessage && (
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  
                  <div className={`flex-1 max-w-xs p-3 rounded-lg ${
                    isOwnMessage 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-card border border-border mr-12'
                  }`}>
                    <p className="text-sm" data-testid={`message-content-${msg.id}`}>
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`} data-testid={`message-time-${msg.id}`}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'N/A'}
                    </p>
                  </div>

                  {isOwnMessage && (
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={socket?.readyState !== WebSocket.OPEN}
            data-testid="message-input"
          />
          <Button 
            onClick={sendMessage}
            disabled={!message.trim() || socket?.readyState !== WebSocket.OPEN}
            size="icon"
            data-testid="send-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {socket?.readyState !== WebSocket.OPEN && (
          <p className="text-xs text-muted-foreground mt-2" data-testid="connection-error">
            Reconectando al chat...
          </p>
        )}
      </div>
    </div>
  );
}
