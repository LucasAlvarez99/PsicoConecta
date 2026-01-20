// src/features/mobile/booking/BookingSteps/TimeSelection.tsx

interface TimeSelectionProps {
  date: Date;
  onTimeSelect: (time: string) => void;
}

export function TimeSelection({ date, onTimeSelect }: TimeSelectionProps) {
  const getAvailableSlots = (date: Date) => {
    const day = date.getDay();
    
    // Lunes a Viernes: 9:00 - 18:00
    if (day >= 1 && day <= 5) {
      return [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
      ];
    }
    
    // Sábado: 10:00 - 14:00
    if (day === 6) {
      return ['10:00', '11:00', '12:00', '13:00', '14:00'];
    }
    
    return [];
  };

  const availableSlots = getAvailableSlots(date);

  return (
    <div className="grid grid-cols-3 gap-3">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => onTimeSelect(slot)}
          className="bg-white border-2 border-gray-200 rounded-xl py-4 px-3 hover:border-black hover:shadow-md transition-all active:scale-95"
        >
          <div className="text-sm font-semibold text-black">
            {slot}
          </div>
        </button>
      ))}
    </div>
  );
}