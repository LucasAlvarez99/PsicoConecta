// src/shared/schemas/auth.schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido es demasiado largo'),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Nombre inválido'),
  lastName: z.string().min(2, 'Apellido inválido'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal('')),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Selecciona un paciente'),
  scheduledAt: z
    .string()
    .min(1, 'La fecha es requerida')
    .refine((date) => new Date(date) > new Date(), {
      message: 'La fecha debe ser futura',
    }),
  duration: z
    .number()
    .min(15, 'Duración mínima: 15 minutos')
    .max(240, 'Duración máxima: 4 horas'),
  notes: z.string().max(500, 'Notas muy largas').optional(),
});

export const testimonialSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje es demasiado largo'),
  rating: z
    .number()
    .min(1, 'Calificación mínima: 1')
    .max(5, 'Calificación máxima: 5'),
});

// Types inferidos
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;