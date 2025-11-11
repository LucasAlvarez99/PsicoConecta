import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User, ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { ChatMessage, User as UserType } from "@shared/schema";

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get patient ID from route
  const [match, params] = useRoute("/chat/:patientId");
  const patientId = params?.patientId;

  // Fetch patient information
  const { data: patient } = useQuery<UserType>({
    queryKey: ["/api/admin/patients", patientId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/patients`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch patients');
      const patients = await response.json();
      return patients.find((p: UserType) => p.id === patientId);
    },
    enabled: !!patientId && user?.role === 'psychologist',
    retry: false,
  });

  // For patients, determine the psychologist to chat with
  const { data: psychologist } = useQuery<UserType>({
    queryKey: ["/api/psychologist"],
    retry: false,
    enabled: user?.role === 'patient',
  });
  
  // Determine the other user ID based on current user role
  const otherUserId = user?.role === 'psychologist' 
    ? patientId // Psychologist chats with selected patient
    : psychologist?.id; // Patients chat with the real psychologist

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", otherUserId],
    queryFn: async () => {
      if (!otherUserId) throw new Error('Other user ID is required');
      const response = await fetch(`/api/chat/${otherUserId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      return response.json();
    },
    retry: false,
    enabled: !!user && !!otherUserId,
  });

  // Initialize WebSocket connection with secure authentication
  useEffect(() => {
    if (!user || !otherUserId) return;
    
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = async (isReconnect = false) => {
      try {
        if (isReconnect && reconnectAttempts >= maxReconnectAttempts) {
          console.log('Max reconnection attempts reached');
          return null;
        }
        
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
          if (event.code === 4001 || event.code === 4003) {
            toast({
              title: "Authentication Failed",
              description: "Chat session expired. Please refresh the page.",
              variant: "destructive",
            });
          } else if (event.code !== 1000 && event.code !== 1001) {
            // Attempt to reconnect for abnormal closures
            reconnectAttempts++;
            reconnectTimeout = setTimeout(() => {
              console.log(`Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`);
              connectWebSocket(true);
            }, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
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
        cleanup = () => {
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          ws.close();
        };
      }
    });
    
    return () => {
      if (cleanup) {
        cleanup();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
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

    // SECURITY: Don't send senderId from client - server uses verified JWT identity
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

  // Redirect if not authorized
  if (!user || (user.role === 'psychologist' && !patientId) || (user.role === 'patient' && !psychologist)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No authorized to access this chat</p>
          <Button onClick={() => window.location.href = user?.role === 'psychologist' ? '/admin' : '/'}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Cargando mensajes...</p>
          </div>
        </div>
      </div>
    );
  }

  const chatPartner = user?.role === 'psychologist' ? patient : psychologist;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = user?.role === 'psychologist' ? '/admin' : '/'}
              data-testid="button-back-to-admin"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {chatPartner?.profileImageUrl ? (
                <img 
                  src={chatPartner.profileImageUrl} 
                  alt={chatPartner.firstName || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-chat-partner-name">
                {chatPartner?.firstName} {chatPartner?.lastName}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === 'psychologist' ? 'Paciente' : 'Psicóloga'} • {chatPartner?.email}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              En línea
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {/* Messages Area */}
          <ScrollArea className="h-96 p-4" data-testid="chat-messages-area">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay mensajes aún. ¡Inicia la conversación!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.senderId === user.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'Ahora'}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                data-testid="input-chat-message"
                disabled={!socket || socket.readyState !== WebSocket.OPEN}
              />
              <Button 
                onClick={sendMessage}
                disabled={!message.trim() || !socket || socket.readyState !== WebSocket.OPEN}
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                socket && socket.readyState === WebSocket.OPEN 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`} />
              {socket && socket.readyState === WebSocket.OPEN 
                ? 'Conectado • Mensajes cifrados end-to-end' 
                : 'Desconectado • Reconectando...'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}