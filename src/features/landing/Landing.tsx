// ===== src/features/landing/Landing.tsx =====
import { Button } from '../../shared/ui/Button';
import { Brain, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-3xl mb-8">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-black mb-6">
            PsicoConecta 2.0
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Plataforma de psicología con inteligencia artificial integrada.
            Conecta con profesionales y mejora tu bienestar mental.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => setLocation('/login')}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}