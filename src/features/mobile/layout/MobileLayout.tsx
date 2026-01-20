// src/features/mobile/layout/MobileLayout.tsx
import { useLocation } from 'wouter';
import { Calendar, Home, User, MessageSquare } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location, setLocation] = useLocation();

  const navigation = [
    { name: 'Inicio', icon: Home, path: '/' },
    { name: 'Agendar', icon: Calendar, path: '/mobile/booking' },
    { name: 'Mis Citas', icon: Calendar, path: '/mobile/appointments' },
    { name: 'Perfil', icon: User, path: '/mobile/profile' },
  ];

  // Don't show bottom nav on booking flow
  const showBottomNav = !location.includes('/mobile/booking');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around px-2 py-2">
            {navigation.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-black bg-gray-100'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}