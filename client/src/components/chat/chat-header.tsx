import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  title: string;
  isConnected: boolean;
}

export function ChatHeader({ title, isConnected }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </p>
        </div>
      </div>
      
      <Badge variant={isConnected ? 'default' : 'secondary'}>
        {isConnected ? 'En línea' : 'Fuera de línea'}
      </Badge>
    </div>
  );
}
