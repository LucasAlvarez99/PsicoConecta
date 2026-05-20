// src/shared/hooks/usePsychologistProfile.ts
import { useState, useEffect } from 'react';

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  whatsapp?: string;
}

export interface PsychologistProfile {
  // Identidad
  name: string;
  title: string;
  license: string;
  photo: string;
  bio: string;
  shortBio: string;

  // Especialidades y formación
  specialties: string[];
  education: string[];
  certifications: string[];
  languages: string[];

  // Contacto
  email: string;
  phone: string;
  location: string;
  address: string;
  socialLinks: SocialLinks;

  // Horarios
  weekdaysSchedule: string;
  saturdaySchedule: string;
  sundaySchedule: string;
  sessionDuration: number; // minutos
  sessionPrice: string;
  onlineAvailable: boolean;
  inPersonAvailable: boolean;

  // Apariencia landing
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  showTestimonials: boolean;
  showPricing: boolean;
  metaTitle: string;
  metaDescription: string;

  // Stats
  yearsExperience: string;
  totalPatients: string;
  satisfactionRate: string;
}

export const DEFAULT_PROFILE: PsychologistProfile = {
  name: 'Dr. María González',
  title: 'Psicóloga Clínica',
  license: 'MP 12345',
  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  bio: 'Especialista en terapia cognitivo-conductual con más de 10 años de experiencia. Me enfoco en ayudar a las personas a superar la ansiedad, depresión y mejorar su bienestar emocional.',
  shortBio: 'Psicóloga clínica especialista en TCC.',

  specialties: [
    'Terapia Cognitivo-Conductual',
    'Ansiedad y Depresión',
    'Terapia de Pareja',
    'Manejo del Estrés',
  ],
  education: [
    'Licenciatura en Psicología - UBA',
    'Maestría en Psicología Clínica - UBA',
    'Especialización en TCC - Instituto Beck',
  ],
  certifications: ['Certificada en EMDR', 'Miembro APA'],
  languages: ['Español', 'Inglés'],

  email: 'dra.gonzalez@psicoconecta.com',
  phone: '+54 11 1234-5678',
  location: 'Buenos Aires, Argentina',
  address: 'Av. Santa Fe 1234, Piso 3, CABA',
  socialLinks: {
    instagram: '',
    linkedin: '',
    twitter: '',
    website: '',
    whatsapp: '',
  },

  weekdaysSchedule: 'Lunes a Viernes: 9:00 - 18:00',
  saturdaySchedule: 'Sábado: 10:00 - 14:00',
  sundaySchedule: 'Domingo: Cerrado',
  sessionDuration: 50,
  sessionPrice: '$5.000',
  onlineAvailable: true,
  inPersonAvailable: true,

  primaryColor: '#000000',
  accentColor: '#4F46E5',
  heroTitle: 'Tu bienestar mental, nuestra prioridad',
  heroSubtitle: 'Sesiones presenciales y online. Primer contacto gratuito.',
  ctaText: 'Agendar una Cita',
  showTestimonials: true,
  showPricing: false,
  metaTitle: 'Dra. María González - Psicóloga Clínica en Buenos Aires',
  metaDescription: 'Psicóloga clínica especialista en TCC. Atención presencial y online.',

  yearsExperience: '10+',
  totalPatients: '500+',
  satisfactionRate: '98%',
};

const STORAGE_KEY = 'psychologist-profile';

export function usePsychologistProfile() {
  const [profile, setProfile] = useState<PsychologistProfile>(DEFAULT_PROFILE);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      } catch {
        // ignore
      }
    }
  }, []);

  const updateProfile = (updates: Partial<PsychologistProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsDirty(false);
    return true;
  };

  const resetProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
    setIsDirty(false);
  };

  return { profile, updateProfile, saveProfile, resetProfile, isDirty };
}