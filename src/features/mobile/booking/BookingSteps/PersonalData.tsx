// src/features/mobile/booking/BookingSteps/PersonalData.tsx
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface PersonalDataProps {
  date: Date;
  time: string;
  onSubmit: (data: { name: string; email: string; phone: string; reason: string }) => void;
}

export function PersonalData({ date, time, onSubmit }: PersonalDataProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre es muy corto';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(formData);
  };

  const isValid = formData.name && formData.email && formData.phone;

  return (
    <>
      {/* Resumen de la cita */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Fecha y hora</span>
          <span className="font-semibold text-black">
            {formatDate(date)} - {time}
          </span>
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full rounded-xl border-2 px-4 py-3 focus:outline-none transition-colors ${
              errors.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-black'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Email *
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            className={`w-full rounded-xl border-2 px-4 py-3 focus:outline-none transition-colors ${
              errors.email
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-black'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            placeholder="+54 11 1234-5678"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            className={`w-full rounded-xl border-2 px-4 py-3 focus:outline-none transition-colors ${
              errors.phone
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-black'
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Motivo de consulta (opcional)
          </label>
          <textarea
            placeholder="Cuéntanos brevemente por qué quieres agendar..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={3}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="w-full mt-6 bg-black text-white rounded-xl py-4 font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Confirmando...</span>
          </>
        ) : (
          <>
            <span>Confirmar Cita</span>
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Al confirmar, aceptas nuestros términos y políticas de privacidad
      </p>
    </>
  );
}