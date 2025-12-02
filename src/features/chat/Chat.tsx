// ===== src/features/chat/Chat.tsx =====
import { Card } from '../../shared/ui/Card';
import { MessageSquare } from 'lucide-react';

export default function Chat() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Mensajes</h1>

        <Card className="p-8">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No hay conversaciones activas</p>
            <p className="text-sm">Los mensajes aparecerán aquí</p>
          </div>
        </Card>
      </div>
    </div>
  );
}