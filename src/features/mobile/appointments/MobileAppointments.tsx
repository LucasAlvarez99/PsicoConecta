// src/features/mobile/appointments/MobileAppointments.tsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function MobileAppointments() {
  const [, setLocation] = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
    );
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
  };

  const now = new Date();
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    if (filter === 'upcoming') {
      return aptDate >= now && apt.status !== 'cancelled';
    }
    return aptDate < now || apt.status === 'cancelled';
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-black mb-4">Mis Citas</h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Pasadas
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-6">
              {filter === 'upcoming'
                ? 'No tienes citas próximas'
                : 'No hay citas pasadas'}
            </p>
            {filter === 'upcoming' && (
              <button
                onClick={() => setLocation('/mobile/booking')}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Agendar Cita
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'pending' && 'Pendiente'}
                    {appointment.status === 'confirmed' && 'Confirmada'}
                    {appointment.status === 'cancelled' && 'Cancelada'}
                  </span>
                  
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (confirm('¿Seguro que quieres cancelar esta cita?')) {
                          cancelAppointment(appointment.id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Date & Time */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                </div>

                {/* Reason */}
                {appointment.reason && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">{appointment.reason}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  <p className="text-xs text-gray-600">
                    <strong>Nombre:</strong> {appointment.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Email:</strong> {appointment.email}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Teléfono:</strong> {appointment.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {filter === 'upcoming' && (
        <button
          onClick={() => setLocation('/mobile/booking')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}