// Ruta: src/shared/ui/LoadingScreen.tsx
import { Brain, Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-black mx-auto" />
        <p className="text-sm text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}