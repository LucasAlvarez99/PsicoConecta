// ===== src/features/ai-assistant/AIAssistant.tsx =====
import { Card } from '../../shared/ui/Card';
import { Brain, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Asistente IA</h1>
            <p className="text-gray-600">Análisis y diagnósticos con inteligencia artificial</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <Sparkles className="w-8 h-8 mb-4 text-black" />
            <h3 className="text-lg font-bold mb-2">Análisis Emocional</h3>
            <p className="text-sm text-gray-600 mb-4">
              Analiza patrones emocionales en conversaciones con pacientes
            </p>
          </Card>

          <Card className="p-6">
            <Sparkles className="w-8 h-8 mb-4 text-black" />
            <h3 className="text-lg font-bold mb-2">Diagnóstico Asistido</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sugerencias de diagnóstico basadas en síntomas
            </p>
          </Card>

          <Card className="p-6">
            <Sparkles className="w-8 h-8 mb-4 text-black" />
            <h3 className="text-lg font-bold mb-2">Reportes Automáticos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Genera reportes profesionales automáticamente
            </p>
          </Card>
        </div>

        <Card className="p-8 mt-6">
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Funcionalidades de IA en desarrollo</p>
          </div>
        </Card>
      </div>
    </div>
  );
}