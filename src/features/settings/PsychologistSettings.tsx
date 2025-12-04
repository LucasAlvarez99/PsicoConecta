// Ruta: src/features/settings/PsychologistSettings.tsx
import { useState } from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { 
  Settings, 
  User, 
  Camera, 
  Save,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface LandingSettings {
  name: string;
  title: string;
  license: string;
  photo: string;
  bio: string;
  specialties: string[];
  education: string[];
  email: string;
  phone: string;
  location: string;
  weekdaysSchedule: string;
  saturdaySchedule: string;
}

export default function PsychologistSettings() {
  const [settings, setSettings] = useState<LandingSettings>({
    name: "Dr. María González",
    title: "Psicóloga Clínica",
    license: "MP 12345",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Especialista en terapia cognitivo-conductual con más de 10 años de experiencia. Me enfoco en ayudar a las personas a superar la ansiedad, depresión y mejorar su bienestar emocional.",
    specialties: [
      "Terapia Cognitivo-Conductual",
      "Ansiedad y Depresión",
      "Terapia de Pareja",
      "Manejo del Estrés"
    ],
    education: [
      "Licenciatura en Psicología - Universidad de Buenos Aires",
      "Maestría en Psicología Clínica - UBA",
      "Especialización en TCC - Instituto Beck"
    ],
    email: "dra.gonzalez@psicoconecta.com",
    phone: "+54 11 1234-5678",
    location: "Buenos Aires, Argentina",
    weekdaysSchedule: "Lunes a Viernes: 9:00 - 18:00",
    saturdaySchedule: "Sábado: 10:00 - 14:00"
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem('landing-settings', JSON.stringify(settings));
    
    alert('Configuración guardada exitosamente');
    setIsSaving(false);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSettings({
        ...settings,
        specialties: [...settings.specialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setSettings({
      ...settings,
      specialties: settings.specialties.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setSettings({
        ...settings,
        education: [...settings.education, newEducation.trim()]
      });
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setSettings({
      ...settings,
      education: settings.education.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Configuración de Página</h1>
            <p className="text-gray-600">Administra la información de tu landing page</p>
          </div>
        </div>

        {/* Información Personal */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información Personal
          </h2>

          <div className="space-y-4">
            {/* Foto de Perfil */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Foto de Perfil (URL)
              </label>
              <div className="flex items-center space-x-4">
                <img 
                  src={settings.photo} 
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <Input
                    type="url"
                    value={settings.photo}
                    onChange={(e) => setSettings({ ...settings, photo: e.target.value })}
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ingresa la URL de tu foto profesional
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nombre Completo
                </label>
                <Input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Título Profesional
                </label>
                <Input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Matrícula Profesional
              </label>
              <Input
                type="text"
                value={settings.license}
                onChange={(e) => setSettings({ ...settings, license: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Biografía
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/20"
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Especialidades */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Especialidades
          </h2>

          <div className="space-y-3">
            {settings.specialties.map((specialty, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={specialty} readOnly className="flex-1" />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSpecialty(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nueva especialidad..."
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                className="flex-1"
              />
              <Button onClick={addSpecialty}>
                Agregar
              </Button>
            </div>
          </div>
        </Card>

        {/* Formación */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Formación Académica
          </h2>

          <div className="space-y-3">
            {settings.education.map((edu, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={edu} readOnly className="flex-1" />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nueva formación..."
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEducation()}
                className="flex-1"
              />
              <Button onClick={addEducation}>
                Agregar
              </Button>
            </div>
          </div>
        </Card>

        {/* Contacto */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">
            Información de Contacto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Teléfono
              </label>
              <Input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Ubicación
              </label>
              <Input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Horarios */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Horarios de Atención
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Lunes a Viernes
              </label>
              <Input
                type="text"
                value={settings.weekdaysSchedule}
                onChange={(e) => setSettings({ ...settings, weekdaysSchedule: e.target.value })}
                placeholder="Ej: Lunes a Viernes: 9:00 - 18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Sábado
              </label>
              <Input
                type="text"
                value={settings.saturdaySchedule}
                onChange={(e) => setSettings({ ...settings, saturdaySchedule: e.target.value })}
                placeholder="Ej: Sábado: 10:00 - 14:00"
              />
            </div>
          </div>
        </Card>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[200px]"
          >
            {isSaving ? (
              <>
                <Save className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}