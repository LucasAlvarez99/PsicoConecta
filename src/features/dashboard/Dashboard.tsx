// Ruta: src/features/dashboard/Dashboard.tsx
import { useAuthStore } from '../auth/store';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { 
  Brain, 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  const isPsychologist = user?.role === 'psychologist';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Bienvenido, {user?.firstName}
                </h1>
                <p className="text-sm text-gray-600">
                  {isPsychologist ? 'Panel de Psicólogo' : 'Panel de Paciente'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation('/profile')}
            >
              Mi Perfil
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isPsychologist ? 'Total Pacientes' : 'Sesiones'}
                </p>
                <p className="text-3xl font-bold text-black">0</p>
              </div>
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Citas Próximas</p>
                <p className="text-3xl font-bold text-black">0</p>
              </div>
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mensajes</p>
                <p className="text-3xl font-bold text-black">0</p>
              </div>
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progreso</p>
                <p className="text-3xl font-bold text-black">--</p>
              </div>
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Próximas Citas</h2>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setLocation('/appointments')}
              >
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay citas programadas</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Actividad Reciente</h2>
            </div>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay actividad reciente</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-black mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => setLocation('/chat')}
            >
              <MessageSquare className="w-6 h-6" />
              <span>Mensajes</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => setLocation('/appointments')}
            >
              <Calendar className="w-6 h-6" />
              <span>Agendar Cita</span>
            </Button>

            {isPsychologist && (
              <>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => setLocation('/patients')}
                >
                  <Users className="w-6 h-6" />
                  <span>Mis Pacientes</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                  onClick={() => setLocation('/ai-assistant')}
                >
                  <Brain className="w-6 h-6" />
                  <span>Asistente IA</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}