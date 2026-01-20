// src/features/mobile/booking/BookingSteps/DateSelection.tsx

interface DateSelectionProps {
  onDateSelect: (date: Date) => void;
}

export function DateSelection({ onDateSelect }: DateSelectionProps) {
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 20; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Excluir domingos
      if (date.getDay() !== 0) {
        dates.push(date);
      }
      
      if (dates.length === 14) break;
    }
    
    return dates;
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      dayName: days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  const availableDates = getAvailableDates();
  const today = new Date().toDateString();

  return (
    <div className="grid grid-cols-2 gap-3">
      {availableDates.map((date, index) => {
        const formatted = formatDate(date);
        const isToday = date.toDateString() === today;
        
        return (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-black hover:shadow-md transition-all active:scale-95"
          >
            <div className="text-xs text-gray-600 mb-1">
              {formatted.dayName}
            </div>
            <div className="text-2xl font-bold text-black mb-1">
              {formatted.day}
            </div>
            <div className="text-xs text-gray-600">
              {formatted.month}
            </div>
            {isToday && (
              <div className="mt-2 text-xs font-semibold text-blue-600">
                Hoy
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}