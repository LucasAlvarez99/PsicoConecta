// src/features/settings/PsychologistSettings.tsx
import { useState } from 'react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import {
  Settings, User, Save, Clock, FileText, Mail, Phone, MapPin,
  Image, Palette, Globe, Instagram, Linkedin, MessageSquare,
  Eye, EyeOff, Plus, X, CheckCircle, AlertCircle, ExternalLink,
  Star, DollarSign, Languages, Award, BookOpen, Monitor
} from 'lucide-react';
import { usePsychologistProfile } from '../../shared/hooks/usePsychologistProfile';
import { useLocation } from 'wouter';

type TabKey = 'identity' | 'services' | 'contact' | 'schedule' | 'appearance' | 'seo';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'identity', label: 'Identidad', icon: User },
  { key: 'services', label: 'Servicios', icon: Star },
  { key: 'contact', label: 'Contacto', icon: Phone },
  { key: 'schedule', label: 'Horarios', icon: Clock },
  { key: 'appearance', label: 'Apariencia', icon: Palette },
  { key: 'seo', label: 'SEO', icon: Globe },
];

function TagList({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState('');
  const add = () => {
    if (value.trim()) { onAdd(value.trim()); setValue(''); }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
          >
            {item}
            <button onClick={() => onRemove(i)} className="hover:text-red-600 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

export default function PsychologistSettings() {
  const { profile, updateProfile, saveProfile, isDirty } = usePsychologistProfile();
  const [activeTab, setActiveTab] = useState<TabKey>('identity');
  const [saved, setSaved] = useState(false);
  const [, setLocation] = useLocation();

  const handleSave = () => {
    saveProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addToList = (field: keyof typeof profile, value: string) => {
    const current = profile[field] as string[];
    updateProfile({ [field]: [...current, value] });
  };

  const removeFromList = (field: keyof typeof profile, index: number) => {
    const current = profile[field] as string[];
    updateProfile({ [field]: current.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Configuración de Página</h1>
              <p className="text-xs text-gray-500">Personaliza tu landing page pública</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                saveProfile();
                setLocation('/');
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Landing
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className={saved ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {saved ? (
                <><CheckCircle className="w-4 h-4 mr-2" />Guardado</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Guardar{isDirty && ' *'}</>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* TAB: IDENTIDAD */}
        {activeTab === 'identity' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <Card className="p-4 lg:col-span-1 h-fit sticky top-40">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Vista previa</p>
              <div className="text-center">
                <img
                  src={profile.photo}
                  alt="preview"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-lg"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/96x96?text=Foto'; }}
                />
                <p className="font-bold text-gray-900">{profile.name || '—'}</p>
                <p className="text-sm text-gray-500">{profile.title || '—'}</p>
                <p className="text-xs text-gray-400 mt-1">{profile.license || '—'}</p>
                <div className="mt-3 flex justify-center gap-4 text-center">
                  <div>
                    <div className="font-bold text-gray-900">{profile.yearsExperience}</div>
                    <div className="text-xs text-gray-500">Años</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{profile.totalPatients}</div>
                    <div className="text-xs text-gray-500">Pacientes</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{profile.satisfactionRate}</div>
                    <div className="text-xs text-gray-500">Satisfacción</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Section title="Datos básicos">
                  <Field label="Foto de perfil (URL)">
                    <Input
                      value={profile.photo}
                      onChange={e => updateProfile({ photo: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nombre completo">
                      <Input
                        value={profile.name}
                        onChange={e => updateProfile({ name: e.target.value })}
                        placeholder="Dr./Lic. Nombre Apellido"
                      />
                    </Field>
                    <Field label="Título profesional">
                      <Input
                        value={profile.title}
                        onChange={e => updateProfile({ title: e.target.value })}
                        placeholder="Psicólogo/a Clínico/a"
                      />
                    </Field>
                  </div>
                  <Field label="Matrícula / Licencia">
                    <Input
                      value={profile.license}
                      onChange={e => updateProfile({ license: e.target.value })}
                      placeholder="MP 12345"
                    />
                  </Field>
                  <Field label="Biografía completa" hint="Aparece en la sección 'Sobre mí' de tu landing">
                    <textarea
                      value={profile.bio}
                      onChange={e => updateProfile({ bio: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                      placeholder="Cuéntale a tus pacientes potenciales quién sos..."
                    />
                  </Field>
                  <Field label="Descripción corta" hint="Aparece debajo de tu nombre en el hero">
                    <Input
                      value={profile.shortBio}
                      onChange={e => updateProfile({ shortBio: e.target.value })}
                      placeholder="Psicóloga clínica especialista en TCC"
                    />
                  </Field>
                </Section>
              </Card>

              <Card className="p-6">
                <Section title="Estadísticas visibles">
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Años de experiencia">
                      <Input
                        value={profile.yearsExperience}
                        onChange={e => updateProfile({ yearsExperience: e.target.value })}
                        placeholder="10+"
                      />
                    </Field>
                    <Field label="Pacientes atendidos">
                      <Input
                        value={profile.totalPatients}
                        onChange={e => updateProfile({ totalPatients: e.target.value })}
                        placeholder="500+"
                      />
                    </Field>
                    <Field label="Satisfacción">
                      <Input
                        value={profile.satisfactionRate}
                        onChange={e => updateProfile({ satisfactionRate: e.target.value })}
                        placeholder="98%"
                      />
                    </Field>
                  </div>
                </Section>
              </Card>

              <Card className="p-6">
                <Section title="Idiomas">
                  <TagList
                    items={profile.languages}
                    onAdd={v => addToList('languages', v)}
                    onRemove={i => removeFromList('languages', i)}
                    placeholder="Agregar idioma (ej: Inglés)"
                  />
                </Section>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: SERVICIOS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <Card className="p-6">
              <Section title="Especialidades">
                <TagList
                  items={profile.specialties}
                  onAdd={v => addToList('specialties', v)}
                  onRemove={i => removeFromList('specialties', i)}
                  placeholder="Ej: Terapia Cognitivo-Conductual"
                />
              </Section>
            </Card>

            <Card className="p-6">
              <Section title="Formación académica">
                <TagList
                  items={profile.education}
                  onAdd={v => addToList('education', v)}
                  onRemove={i => removeFromList('education', i)}
                  placeholder="Ej: Licenciatura - Universidad de Buenos Aires"
                />
              </Section>
            </Card>

            <Card className="p-6">
              <Section title="Certificaciones y membresías">
                <TagList
                  items={profile.certifications}
                  onAdd={v => addToList('certifications', v)}
                  onRemove={i => removeFromList('certifications', i)}
                  placeholder="Ej: Certificada en EMDR"
                />
              </Section>
            </Card>

            <Card className="p-6">
              <Section title="Modalidad y precios">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Duración de sesión (minutos)">
                    <Input
                      type="number"
                      value={profile.sessionDuration}
                      onChange={e => updateProfile({ sessionDuration: Number(e.target.value) })}
                      min={15}
                      max={120}
                    />
                  </Field>
                  <Field label="Precio por sesión">
                    <Input
                      value={profile.sessionPrice}
                      onChange={e => updateProfile({ sessionPrice: e.target.value })}
                      placeholder="$5.000 / USD 50"
                    />
                  </Field>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.onlineAvailable}
                      onChange={e => updateProfile({ onlineAvailable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Sesiones online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.inPersonAvailable}
                      onChange={e => updateProfile({ inPersonAvailable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Sesiones presenciales</span>
                  </label>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.showPricing}
                      onChange={e => updateProfile({ showPricing: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Mostrar precio en landing</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.showTestimonials}
                      onChange={e => updateProfile({ showTestimonials: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Mostrar testimonios</span>
                  </label>
                </div>
              </Section>
            </Card>
          </div>
        )}

        {/* TAB: CONTACTO */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card className="p-6">
              <Section title="Datos de contacto">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email">
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={e => updateProfile({ email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </Field>
                  <Field label="Teléfono / WhatsApp">
                    <Input
                      value={profile.phone}
                      onChange={e => updateProfile({ phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                    />
                  </Field>
                </div>
                <Field label="Ciudad / País">
                  <Input
                    value={profile.location}
                    onChange={e => updateProfile({ location: e.target.value })}
                    placeholder="Buenos Aires, Argentina"
                  />
                </Field>
                <Field label="Dirección del consultorio" hint="Opcional. Solo se muestra si agregás sesiones presenciales">
                  <Input
                    value={profile.address}
                    onChange={e => updateProfile({ address: e.target.value })}
                    placeholder="Av. Santa Fe 1234, Piso 3, CABA"
                  />
                </Field>
              </Section>
            </Card>

            <Card className="p-6">
              <Section title="Redes sociales">
                {(
                  [
                    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@tuusuario' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/tuusuario' },
                    { key: 'twitter', label: 'Twitter / X', icon: MessageSquare, placeholder: '@tuusuario' },
                    { key: 'website', label: 'Sitio web', icon: Globe, placeholder: 'https://tuwebsite.com' },
                    { key: 'whatsapp', label: 'WhatsApp (número con código)', icon: MessageSquare, placeholder: '+5491112345678' },
                  ] as const
                ).map(({ key, label, icon: Icon, placeholder }) => (
                  <Field key={key} label={label}>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={profile.socialLinks[key] || ''}
                        onChange={e => updateProfile({ socialLinks: { ...profile.socialLinks, [key]: e.target.value } })}
                        placeholder={placeholder}
                        className="pl-9"
                      />
                    </div>
                  </Field>
                ))}
              </Section>
            </Card>
          </div>
        )}

        {/* TAB: HORARIOS */}
        {activeTab === 'schedule' && (
          <Card className="p-6">
            <Section title="Horarios de atención">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Lunes a Viernes">
                  <Input
                    value={profile.weekdaysSchedule}
                    onChange={e => updateProfile({ weekdaysSchedule: e.target.value })}
                    placeholder="Lunes a Viernes: 9:00 - 18:00"
                  />
                </Field>
                <Field label="Sábado">
                  <Input
                    value={profile.saturdaySchedule}
                    onChange={e => updateProfile({ saturdaySchedule: e.target.value })}
                    placeholder="Sábado: 10:00 - 14:00 (o vacío si no atendés)"
                  />
                </Field>
                <Field label="Domingo">
                  <Input
                    value={profile.sundaySchedule}
                    onChange={e => updateProfile({ sundaySchedule: e.target.value })}
                    placeholder="Domingo: Cerrado"
                  />
                </Field>
              </div>
            </Section>
          </Card>
        )}

        {/* TAB: APARIENCIA */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <Card className="p-6">
              <Section title="Textos del hero">
                <Field label="Título principal" hint="El mensaje grande que ven primero los visitantes">
                  <Input
                    value={profile.heroTitle}
                    onChange={e => updateProfile({ heroTitle: e.target.value })}
                    placeholder="Tu bienestar mental, nuestra prioridad"
                  />
                </Field>
                <Field label="Subtítulo">
                  <Input
                    value={profile.heroSubtitle}
                    onChange={e => updateProfile({ heroSubtitle: e.target.value })}
                    placeholder="Sesiones presenciales y online. Primer contacto gratuito."
                  />
                </Field>
                <Field label="Texto del botón CTA">
                  <Input
                    value={profile.ctaText}
                    onChange={e => updateProfile({ ctaText: e.target.value })}
                    placeholder="Agendar una Cita"
                  />
                </Field>
              </Section>
            </Card>

            <Card className="p-6">
              <Section title="Colores">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Color primario" hint="Botones, links, acentos">
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={profile.primaryColor}
                        onChange={e => updateProfile({ primaryColor: e.target.value })}
                        className="h-10 w-16 rounded-lg border-2 border-gray-200 cursor-pointer p-1"
                      />
                      <Input
                        value={profile.primaryColor}
                        onChange={e => updateProfile({ primaryColor: e.target.value })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </Field>
                  <Field label="Color de acento" hint="Detalles, badges, highlights">
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={profile.accentColor}
                        onChange={e => updateProfile({ accentColor: e.target.value })}
                        className="h-10 w-16 rounded-lg border-2 border-gray-200 cursor-pointer p-1"
                      />
                      <Input
                        value={profile.accentColor}
                        onChange={e => updateProfile({ accentColor: e.target.value })}
                        placeholder="#4F46E5"
                        className="flex-1"
                      />
                    </div>
                  </Field>
                </div>
                {/* Preview color */}
                <div className="mt-2 p-4 rounded-xl border-2 border-gray-100 flex gap-3 items-center">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: profile.primaryColor }}
                  >
                    {profile.ctaText}
                  </button>
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                    style={{ backgroundColor: profile.accentColor }}
                  >
                    Online disponible
                  </span>
                </div>
              </Section>
            </Card>
          </div>
        )}

        {/* TAB: SEO */}
        {activeTab === 'seo' && (
          <Card className="p-6">
            <Section title="Metadatos de búsqueda">
              <Field label="Título de la página" hint="Aparece en la pestaña del navegador y en Google (máx. 60 caracteres)">
                <Input
                  value={profile.metaTitle}
                  onChange={e => updateProfile({ metaTitle: e.target.value })}
                  placeholder="Dra. María González - Psicóloga en Buenos Aires"
                  maxLength={60}
                />
                <p className="text-xs text-gray-400 mt-1">{profile.metaTitle.length}/60 caracteres</p>
              </Field>
              <Field label="Descripción" hint="Aparece en los resultados de Google (máx. 160 caracteres)">
                <textarea
                  value={profile.metaDescription}
                  onChange={e => updateProfile({ metaDescription: e.target.value })}
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  placeholder="Psicóloga clínica especialista en TCC. Atención presencial y online en Buenos Aires."
                />
                <p className="text-xs text-gray-400 mt-1">{profile.metaDescription.length}/160 caracteres</p>
              </Field>
            </Section>

            {/* Preview Google */}
            <div className="mt-4 p-4 border-2 border-gray-100 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-2">Vista previa en Google</p>
              <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                {profile.metaTitle || 'Título de tu página'}
              </div>
              <div className="text-green-700 text-sm">psicoconecta.com</div>
              <div className="text-gray-600 text-sm mt-1">
                {profile.metaDescription || 'Descripción de tu página...'}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}