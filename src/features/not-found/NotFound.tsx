// ===== src/features/not-found/NotFound.tsx =====
import { Button } from '../../shared/ui/Button';
import { Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-black mb-4">404</h1>
        <h2 className="text-3xl font-bold text-black mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Button onClick={() => setLocation('/')}>
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}