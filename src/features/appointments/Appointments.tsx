// ===== src/features/appointments/Appointments.tsx =====
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Calendar, Plus } from 'lucide-react';

export default function Appointments() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Citas</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        <Card className="p-8">
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No hay citas programadas</p>
            <p className="text-sm">Agenda tu primera cita</p>
          </div>
        </Card>
      </div>
    </div>
  );
}