// ===== src/shared/ui/Layout.tsx (MEJORADO) =====
import { useAuthStore } from '../../features/auth/store';
import { useLocation } from 'wouter';
import { 
  Brain, 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users, 
  User,
  Sparkles,
  LogOut,
  Home,
  Settings
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { authApi } from '../../features/auth/api';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [location, setLocation] = useLocation();

  // No mostrar layout en páginas públicas
  if (!isAuthenticated || location === '/login' || location === '/') {
    return <>{children}</>;
  }

  const isPsychologist = user?.role === 'psychologist';

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      setLocation('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Mensajes', icon: MessageSquare, path: '/chat', badge: 0 },
    { name: 'Citas', icon: Calendar, path: '/appointments' },
    ...(isPsychologist ? [
      { name: 'Pacientes', icon: Users, path: '/patients' },
      { name: 'Asistente IA', icon: Sparkles, path: '/ai-assistant' },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black">PsicoConecta</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Botón para volver al landing */}
          <button
            onClick={() => {
              logout();
              setLocation('/');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              transition-colors text-left text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Volver al Inicio</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          {navigation.map((item) => {
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg
                  transition-colors text-left
                  ${isActive 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge 
                    variant={isActive ? 'default' : 'info'} 
                    size="sm"
                    className={isActive ? 'bg-white text-black' : ''}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}

          <div className="border-t border-gray-200 my-2"></div>

          {/* Configuración y Perfil */}
          <button
            onClick={() => setLocation('/profile')}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              transition-colors text-left
              ${location === '/profile'
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Mi Perfil</span>
          </button>

          {isPsychologist && (
            <button
              onClick={() => setLocation('/settings')}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors text-left
                ${location === '/settings'
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configuración</span>
            </button>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar
              src={user?.profileImageUrl}
              fallback={`${user?.firstName} ${user?.lastName}`}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge 
                variant="info" 
                size="sm"
                className="mt-1"
              >
                {user?.role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}