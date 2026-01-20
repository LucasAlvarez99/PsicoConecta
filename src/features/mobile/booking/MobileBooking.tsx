// src/features/mobile/booking/MobileBooking.tsx
import { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, ChevronRight } from 'lucide-react';
import { BookingSuccess } from './BookingSuccess';
import { DateSelection } from './BookingSteps/DateSelection';
import { TimeSelection } from './BookingSteps/TimeSelection';
import { PersonalData } from './BookingSteps/PersonalData';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  reason: string;
}

export default function MobileBooking() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    date: null,
    time: '',
    reason: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, date });
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setStep(3);
  };

  const handleSubmit = async (formData: Partial<BookingData>) => {
    const finalData = { ...bookingData, ...formData };
    
    // Guardar en localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push({
      ...finalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    setIsSuccess(true);
  };

  const handleReset = () => {
    setStep(1);
    setIsSuccess(false);
    setBookingData({
      name: '',
      email: '',
      phone: '',
      date: null,
      time: '',
      reason: '',
    });
  };

  if (isSuccess) {
    return (
      <BookingSuccess
        date={bookingData.date!}
        time={bookingData.time}
        email={bookingData.email}
        onReset={handleReset}
      />
    );
  }

  const stepTitles = [
    { icon: Calendar, title: 'Elige una fecha', subtitle: 'Selecciona el día que mejor te convenga' },
    { icon: Clock, title: 'Elige un horario', subtitle: bookingData.date ? formatDate(bookingData.date).full : '' },
    { icon: User, title: 'Tus datos', subtitle: 'Para confirmar tu cita' },
  ];

  const currentStep = stepTitles[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-black">Agendar Cita</h1>
            <p className="text-xs text-gray-600">Paso {step} de 3</p>
          </div>
          
          <div className="w-9" />
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <StepIcon className="w-5 h-5 text-black" />
            <h2 className="text-xl font-bold text-black">{currentStep.title}</h2>
          </div>
          <p className="text-sm text-gray-600">{currentStep.subtitle}</p>
        </div>

        {step === 1 && <DateSelection onDateSelect={handleDateSelect} />}
        {step === 2 && bookingData.date && (
          <TimeSelection date={bookingData.date} onTimeSelect={handleTimeSelect} />
        )}
        {step === 3 && (
          <PersonalData
            date={bookingData.date!}
            time={bookingData.time}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

// Helper function
function formatDate(date: Date) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return {
    dayName: days[date.getDay()],
    day: date.getDate(),
    month: months[date.getMonth()],
    full: `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
  };
}