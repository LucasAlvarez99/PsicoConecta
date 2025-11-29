import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare, CheckCircle, Heart } from 'lucide-react';

interface StatsCardsProps {
  role: 'patient' | 'psychologist';
}

export function StatsCards({ role }: StatsCardsProps) {
  const stats = role === 'psychologist' 
    ? [
        { icon: Calendar, label: 'Citas Hoy', value: '8', color: 'from-blue-500 to-cyan-500' },
        { icon: MessageSquare, label: 'Mensajes', value: '12', color: 'from-purple-500 to-pink-500' },
        { icon: CheckCircle, label: 'Completadas', value: '45', color: 'from-green-500 to-emerald-500' },
        { icon: Heart, label: 'Pacientes', value: '24', color: 'from-red-500 to-rose-500' },
      ]
    : [
        { icon: Calendar, label: 'Próxima Cita', value: 'Mañana', color: 'from-blue-500 to-cyan-500' },
        { icon: MessageSquare, label: 'Mensajes', value: '5', color: 'from-purple-500 to-pink-500' },
        { icon: CheckCircle, label: 'Sesiones', value: '12', color: 'from-green-500 to-emerald-500' },
        { icon: Heart, label: 'Bienestar', value: '85%', color: 'from-red-500 to-rose-500' },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
        >
          <CardContent className="p-6 relative">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
