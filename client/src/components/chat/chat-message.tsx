import { User } from 'lucide-react';
import type { ChatMessage } from '@shared/schema';

interface ChatMessageProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function ChatMessageItem({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div 
      className={`flex items-start space-x-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
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
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${
          isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'N/A'}
        </p>
      </div>

      {isOwnMessage && (
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}
