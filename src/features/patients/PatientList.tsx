import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Users, Plus } from 'lucide-react';

export default function PatientList() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Mis Pacientes</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        <Card className="p-8">
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No hay pacientes registrados</p>
            <p className="text-sm">Agrega tu primer paciente para comenzar</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

