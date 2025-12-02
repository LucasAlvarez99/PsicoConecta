import { useAuthStore } from '../auth/store';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { authApi } from '../auth/api';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      setLocation('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Mi Perfil</h1>

        <Card className="p-8 mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>

            {user?.phone && (
              <div className="flex items-center space-x-3 text-gray-700">
                <Phone className="w-5 h-5" />
                <span>{user.phone}</span>
              </div>
            )}

            {user?.dateOfBirth && (
              <div className="flex items-center space-x-3 text-gray-700">
                <Calendar className="w-5 h-5" />
                <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button variant="outline" className="mr-4">
              Editar Perfil
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}