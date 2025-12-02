import { useParams, useLocation } from 'wouter';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { ArrowLeft, User } from 'lucide-react';

export default function PatientDetail() {
  const { patientId } = useParams();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/patients')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pacientes
        </Button>

        <Card className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Detalle del Paciente</h1>
              <p className="text-gray-600">ID: {patientId}</p>
            </div>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <p>Detalles del paciente en desarrollo...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
