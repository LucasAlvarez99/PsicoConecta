// src/features/mobile/booking/BookingSuccess.tsx
import { CheckCircle } from 'lucide-react';

interface BookingSuccessProps {
  date: Date;
  time: string;
  email: string;
  onReset: () => void;
}

export function BookingSuccess({ date, time, email, onReset }: BookingSuccessProps) {
  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-black mb-2 animate-fade-in">
          ¡Cita Confirmada!
        </h1>
        
        <p className="text-gray-600 mb-6 animate-fade-in">
          Te enviamos un email de confirmación a <strong>{email}</strong>
        </p>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">Fecha</span>
            <span className="font-semibold text-black">
              {formatDate(date)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hora</span>
            <span className="font-semibold text-black">{time}</span>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="w-full bg-black text-white rounded-xl py-4 font-semibold hover:bg-gray-800 transition-colors active:scale-95"
        >
          Agendar Otra Cita
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Recibirás un recordatorio 24 horas antes de tu cita
        </p>
      </div>
    </div>
  );
}