import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Appointment, User } from "@shared/schema";

export default function CalendarComponent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch psychologist information
  const { data: psychologist } = useQuery<User>({
    queryKey: ["/api/psychologist"],
    retry: false,
  });

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    retry: false,
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: { scheduledAt: string; psychologistId: string; duration: number }) => {
      await apiRequest("POST", "/api/appointments", appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "Cita agendada",
        description: "Tu cita se ha programado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setSelectedDate(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo agendar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if date has appointments
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt: Appointment) => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle booking appointment
  const handleBookAppointment = (time: string) => {
    if (!selectedDate || !psychologist) return;
    
    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = time.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    
    createAppointmentMutation.mutate({
      scheduledAt: appointmentDate.toISOString(),
      psychologistId: psychologist.id,
      duration: 60
    });
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Cargando calendario...</p>
      </div>
    );
  }

  const upcomingAppointments = appointments
    .filter((apt: Appointment) => 
      apt.status === 'scheduled' && new Date(apt.scheduledAt) > new Date()
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Próximas Citas</span>
          </h4>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10" data-testid={`upcoming-appointment-${appointment.id}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground" data-testid={`appointment-date-${appointment.id}`}>
                      {new Date(appointment.scheduledAt).toLocaleDateString()} - {new Date(appointment.scheduledAt).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Duración: {appointment.duration} minutos</p>
                  </div>
                  <Badge variant="secondary" data-testid={`appointment-status-${appointment.id}`}>
                    {appointment.status === 'scheduled' ? 'Programada' : appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-muted/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-semibold text-foreground" data-testid="calendar-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              data-testid="button-next-month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentDate).map((date, index) => {
            if (!date) {
              return <div key={index} className="p-3"></div>;
            }

            const dateAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateSelect(date)}
                disabled={isPast}
                className={`
                  p-3 text-center text-sm rounded-lg transition-all duration-200 relative
                  ${isPast 
                    ? 'text-muted-foreground cursor-not-allowed opacity-50' 
                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                  }
                  ${isToday ? 'bg-primary text-primary-foreground font-semibold' : ''}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${dateAppointments.length > 0 ? 'bg-accent/20' : ''}
                `}
                data-testid={`calendar-day-${date.getDate()}`}
              >
                {date.getDate()}
                {dateAppointments.length > 0 && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-full" data-testid={`appointment-indicator-${date.getDate()}`}></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Time Slots for Selected Date */}
        {selectedDate && user?.role !== 'psychologist' && (
          <div className="mt-6 pt-6 border-t border-border">
            <h5 className="font-medium text-foreground mb-4" data-testid="available-times-title">
              Horarios disponibles - {selectedDate.toLocaleDateString()}
            </h5>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableTimes.map(time => {
                const appointmentTime = new Date(selectedDate);
                const [hours, minutes] = time.split(':');
                appointmentTime.setHours(parseInt(hours), parseInt(minutes));
                
                const isBooked = appointments.some((apt: Appointment) => 
                  new Date(apt.scheduledAt).getTime() === appointmentTime.getTime() && 
                  apt.status === 'scheduled'
                );

                return (
                  <Button
                    key={time}
                    variant={isBooked ? "secondary" : "outline"}
                    size="sm"
                    disabled={isBooked || createAppointmentMutation.isPending}
                    onClick={() => handleBookAppointment(time)}
                    data-testid={`time-slot-${time}`}
                  >
                    {time}
                    {isBooked && " (Ocupado)"}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
