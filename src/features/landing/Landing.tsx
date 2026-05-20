// src/features/landing/Landing.tsx
import { useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Input } from '../../shared/ui/Input';
import {
  Brain, Mail, Phone, MapPin, Star, Send, Calendar, Award, BookOpen,
  MessageSquare, Clock, Globe, Instagram, Linkedin, Monitor, Users, Video
} from 'lucide-react';
import { useLocation } from 'wouter';
import { usePsychologistProfile } from '../../shared/hooks/usePsychologistProfile';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { profile } = usePsychologistProfile();

  const [testimonialForm, setTestimonialForm] = useState({ name: '', message: '', rating: 5 });
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Ana Martínez', message: 'Excelente profesional. Me ayudó a superar mi ansiedad y ahora me siento mucho mejor.', rating: 5, date: 'Hace 2 semanas' },
    { id: 2, name: 'Carlos López', message: 'Muy recomendable. Sus técnicas de manejo del estrés me han sido muy útiles.', rating: 5, date: 'Hace 1 mes' },
    { id: 3, name: 'Laura Pérez', message: 'Empática y profesional. Siempre me escucha con atención y me da herramientas prácticas.', rating: 4, date: 'Hace 2 meses' },
  ]);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonials([{ id: Date.now(), ...testimonialForm, date: 'Ahora' }, ...testimonials]);
    setTestimonialForm({ name: '', message: '', rating: 5 });
    alert('¡Gracias por tu comentario!');
  };

  const socialLinks = [
    { href: profile.socialLinks.instagram ? `https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}` : '', icon: Instagram, label: 'Instagram' },
    { href: profile.socialLinks.linkedin ? `https://${profile.socialLinks.linkedin.startsWith('http') ? '' : ''}${profile.socialLinks.linkedin}` : '', icon: Linkedin, label: 'LinkedIn' },
    { href: profile.socialLinks.website || '', icon: Globe, label: 'Web' },
  ].filter(l => l.href);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-black">PsicoConecta</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['Inicio', 'Sobre Mí', 'Servicios', 'Testimonios', 'Contacto'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-').replace('í', 'i').replace('ó', 'o')}`}
                  className="text-gray-700 hover:text-black transition-colors text-sm font-medium"
                >
                  {link}
                </a>
              ))}
            </div>
            <Button onClick={() => setLocation('/login')} variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block relative mb-6">
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/256x256?text=Foto'; }}
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">5.0</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{profile.name}</h1>
              <p className="text-xl text-gray-600 mb-1">{profile.title}</p>
              <p className="text-gray-400 text-sm mb-2">{profile.license}</p>
              {profile.shortBio && <p className="text-gray-600 mb-6">{profile.shortBio}</p>}

              {/* Modalidad badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                {profile.onlineAvailable && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    <Video className="w-3 h-3" /> Online disponible
                  </span>
                )}
                {profile.inPersonAvailable && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    <Users className="w-3 h-3" /> Presencial
                  </span>
                )}
                {profile.sessionDuration && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> {profile.sessionDuration} min
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{profile.yearsExperience}</div>
                  <div className="text-xs text-gray-600">Años</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{profile.totalPatients}</div>
                  <div className="text-xs text-gray-600">Pacientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{profile.satisfactionRate}</div>
                  <div className="text-xs text-gray-600">Satisfacción</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  onClick={() => setLocation('/login')}
                  style={{ backgroundColor: profile.primaryColor }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {profile.ctaText}
                </Button>
                {profile.socialLinks.whatsapp && (
                  <a
                    href={`https://wa.me/${profile.socialLinks.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-black transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sobre mí card */}
            <div className="space-y-4" id="sobre-mi">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-black mb-3">Sobre Mí</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{profile.bio}</p>
                <div className="space-y-4">
                  {profile.specialties.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-black mb-1">Especialidades</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.specialties.map((s, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {profile.education.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-black mb-1">Formación</h4>
                        <ul className="space-y-1">
                          {profile.education.map((e, i) => (
                            <li key={i} className="text-gray-600 text-sm">• {e}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {profile.languages.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-black" />
                      <span className="font-medium">Idiomas:</span>
                      {profile.languages.join(', ')}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-black" />
                  <h3 className="text-lg font-bold text-black">Horarios</h3>
                </div>
                <div className="space-y-1 text-gray-700 text-sm">
                  {profile.weekdaysSchedule && <p>{profile.weekdaysSchedule}</p>}
                  {profile.saturdaySchedule && <p>{profile.saturdaySchedule}</p>}
                  {profile.sundaySchedule && <p>{profile.sundaySchedule}</p>}
                </div>
                {profile.showPricing && profile.sessionPrice && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Sesión ({profile.sessionDuration} min): <span style={{ color: profile.primaryColor }}>{profile.sessionPrice}</span>
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      {profile.showTestimonials && (
        <section id="testimonios" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">Lo que dicen mis pacientes</h2>
              <p className="text-gray-600">Testimonios reales de personas que han trabajado conmigo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {testimonials.map(t => (
                <Card key={t.id} className="p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{t.message}"</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-black">{t.name}</span>
                    <span className="text-gray-500">{t.date}</span>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-black mb-4">Deja tu comentario</h3>
              <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Tu nombre</label>
                  <Input value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Tu experiencia</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
                    placeholder="Cuéntanos sobre tu experiencia..."
                    value={testimonialForm.message}
                    onChange={e => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: r })}>
                        <Star className={`w-8 h-8 ${r <= testimonialForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />Enviar Comentario
                </Button>
              </form>
            </Card>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Contacto</h2>
            <p className="text-gray-600">¿Listo para comenzar tu proceso terapéutico?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Email</h3>
              <a href={`mailto:${profile.email}`} className="text-gray-600 hover:text-black text-sm break-all">{profile.email}</a>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Teléfono</h3>
              <a href={`tel:${profile.phone}`} className="text-gray-600 hover:text-black text-sm">{profile.phone}</a>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Ubicación</h3>
              <p className="text-gray-600 text-sm">{profile.location}</p>
              {profile.address && <p className="text-gray-400 text-xs mt-1">{profile.address}</p>}
            </Card>
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={() => setLocation('/login')} style={{ backgroundColor: profile.primaryColor }}>
              <MessageSquare className="w-5 h-5 mr-2" />
              {profile.ctaText}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold">PsicoConecta</span>
          </div>
          <p className="text-gray-400 text-sm mb-2">{profile.name} — {profile.title}</p>
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} PsicoConecta. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}