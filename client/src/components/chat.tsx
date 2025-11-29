import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessageItem } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import type { ChatMessage, User as UserType } from "@shared/schema";
import { API_ENDPOINTS, WEBSOCKET_CONFIG } from "@/lib/constants";

export default function Chat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch psychologist information
  const { data: psychologist } = useQuery<UserType>({
    queryKey: [API_ENDPOINTS.psychologist],
    retry: false,
  });
  
  // Determine the other user ID based on current user role
  const otherUserId = user?.role === 'psychologist' 
    ? null // Psychologists should use admin panel for patient-specific chats
    : psychologist?.id; // Patients chat with the psychologist

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: [API_ENDPOINTS.chat, otherUserId],
    retry: false,
    enabled: !!user && !!otherUserId,
  });

  // Get WebSocket token and connect
  const [wsToken, setWsToken] = useState<string>("");
  
  useEffect(() => {
    if (!user) return;
    
    const fetchToken = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.auth.wsToken, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const { token } = await response.json();
          setWsToken(token);
        }
      } catch (error) {
        console.error('Failed to fetch WebSocket token:', error);
      }
    };
    
    fetchToken();
  }, [user]);

  // Initialize WebSocket connection
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.port 
    ? `${window.location.hostname}:${window.location.port}` 
    : window.location.hostname;
  const wsUrl = wsToken ? `${protocol}//${host}/ws?token=${encodeURIComponent(wsToken)}` : "";

  const { isConnected, sendMessage: wsSendMessage } = useWebSocket({
    url: wsUrl,
    enabled: !!user && !!wsUrl,
    onMessage: (data) => {
      if (data.type === 'chat_message') {
        // Invalidate and refetch messages when new message received
        queryClient.invalidateQueries({ 
          queryKey: [API_ENDPOINTS.chat, otherUserId] 
        });
      }
    },
    reconnectAttempts: WEBSOCKET_CONFIG.reconnectAttempts,
    reconnectDelay: WEBSOCKET_CONFIG.reconnectDelay,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!user || !otherUserId) return;

    const messageData = {
      type: 'chat_message',
      receiverId: otherUserId,
      message,
    };

    wsSendMessage(messageData);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Cargando mensajes...</p>
      </div>
    );
  }

  const chatTitle = user?.role === 'psychologist' 
    ? 'Chat con Pacientes' 
    : 'Chat con Dra. González';

  return (
    <div className="flex flex-col h-96 bg-muted/50 rounded-2xl" data-testid="chat-container">
      <ChatHeader title={chatTitle} isConnected={isConnected} />

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
            messages.map((msg: ChatMessage) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isOwnMessage={msg.senderId === user?.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput 
        onSend={handleSendMessage}
        disabled={!isConnected || !user || !otherUserId}
      />
    </div>
  );
}
