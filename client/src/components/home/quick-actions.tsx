import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Star, Brain, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

interface QuickActionsProps {
  role: 'patient' | 'psychologist';
}

export function QuickActions({ role }: QuickActionsProps) {
  const actions = role === 'psychologist'
    ? [
        { icon: Calendar, label: 'Ver Agenda', href: '/admin', variant: 'default' as const },
        { icon: MessageSquare, label: 'Gestionar Pacientes', href: '/admin', variant: 'outline' as const },
      ]
    : [
        { icon: Calendar, label: 'Agendar Cita', href: '/appointments', variant: 'default' as const },
        { icon: Star, label: 'Recursos', href: '/resources', variant: 'outline' as const },
      ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {actions.map((action, index) => (
        <Link key={index} href={action.href}>
          <Button 
            variant={action.variant}
            size="lg"
            className="group hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <action.icon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            {action.label}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
