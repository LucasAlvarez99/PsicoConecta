import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { User as UserType } from '@/lib/mappers';

interface WelcomeHeaderProps {
  user: UserType;
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative">
        {user.profileImageUrl ? (
          <img 
            src={user.profileImageUrl} 
            alt={user.firstName || 'Usuario'}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-white font-bold text-xl">
              {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
            </span>
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user.firstName}!
          </h1>
          <Badge variant="secondary" className="px-3 py-1">
            <User className="w-3 h-3 mr-1" />
            {user.role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
          </Badge>
        </div>
        <p className="text-gray-600">
          {user.role === 'psychologist' 
            ? 'Panel de gestión de pacientes y consultas' 
            : 'Tu espacio personal de bienestar mental'}
        </p>
      </div>
    </div>
  );
}
