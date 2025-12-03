// Ruta: src/features/landing/Landing.tsx
import { useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Input } from '../../shared/ui/Input';
import { 
  Brain, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Send,
  Calendar,
  Award,
  BookOpen,
  Users,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    message: '',
    rating: 5
  });

  // Datos del psicólogo (esto vendría de la base de datos)
  const psychologist = {
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
    contact: {
      email: "dra.gonzalez@psicoconecta.com",
      phone: "+54 11 1234-5678",
      location: "Buenos Aires, Argentina"
    },
    schedule: {
      weekdays: "Lunes a Viernes: 9:00 - 18:00",
      saturday: "Sábado: 10:00 - 14:00"
    }
  };

  // Testimonios (esto vendría de la base de datos)
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Ana Martínez",
      message: "Excelente profesional. Me ayudó a superar mi ansiedad y ahora me siento mucho mejor.",
      rating: 5,
      date: "Hace 2 semanas"
    },
    {
      id: 2,
      name: "Carlos López",
      message: "Muy recomendable. Sus técnicas de manejo del estrés me han sido muy útiles.",
      rating: 5,
      date: "Hace 1 mes"
    },
    {
      id: 3,
      name: "Laura Pérez",
      message: "Empática y profesional. Siempre me escucha con atención y me da herramientas prácticas.",
      rating: 4,
      date: "Hace 2 meses"
    }
  ]);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTestimonial = {
      id: testimonials.length + 1,
      name: testimonialForm.name,
      message: testimonialForm.message,
      rating: testimonialForm.rating,
      date: "Ahora"
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setTestimonialForm({ name: '', message: '', rating: 5 });
    
    // Aquí guardarías en la base de datos
    alert('¡Gracias por tu comentario!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-black">PsicoConecta</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-black transition-colors">
                Inicio
              </a>
              <a href="#sobre-mi" className="text-gray-700 hover:text-black transition-colors">
                Sobre Mí
              </a>
              <a href="#testimonios" className="text-gray-700 hover:text-black transition-colors">
                Testimonios
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-black transition-colors">
                Contacto
              </a>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => setLocation('/login')}
              variant="outline"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Foto y Info Principal */}
            <div className="text-center md:text-left">
              <div className="inline-block relative mb-6">
                <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <img 
                    src={psychologist.photo} 
                    alt={psychologist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">5.0</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
                {psychologist.name}
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                {psychologist.title}
              </p>
              <p className="text-gray-500 mb-6">
                {psychologist.license}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">10+</div>
                  <div className="text-sm text-gray-600">Años</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">500+</div>
                  <div className="text-sm text-gray-600">Pacientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">100%</div>
                  <div className="text-sm text-gray-600">Satisfacción</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setLocation('/login')}
                className="w-full md:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Cita
              </Button>
            </div>

            {/* Info Card */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-black mb-4">Sobre Mí</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {psychologist.bio}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-black mt-1" />
                    <div>
                      <h4 className="font-semibold text-black mb-2">Especialidades</h4>
                      <ul className="space-y-1">
                        {psychologist.specialties.map((specialty, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            • {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-black mt-1" />
                    <div>
                      <h4 className="font-semibold text-black mb-2">Formación</h4>
                      <ul className="space-y-1">
                        {psychologist.education.map((edu, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            • {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Horarios */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-black" />
                  <h3 className="text-lg font-bold text-black">Horarios de Atención</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p>{psychologist.schedule.weekdays}</p>
                  <p>{psychologist.schedule.saturday}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Lo que dicen mis pacientes
            </h2>
            <p className="text-gray-600">
              Testimonios reales de personas que han trabajado conmigo
            </p>
          </div>

          {/* Lista de Testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.message}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black">{testimonial.name}</span>
                  <span className="text-gray-500">{testimonial.date}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Formulario de Testimonios */}
          <Card className="p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-black mb-4">
              Deja tu comentario
            </h3>
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tu nombre
                </label>
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tu experiencia
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/20"
                  placeholder="Cuéntanos sobre tu experiencia..."
                  value={testimonialForm.message}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Calificación
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= testimonialForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Enviar Comentario
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Contacto
            </h2>
            <p className="text-gray-600">
              ¿Listo para comenzar tu proceso terapéutico?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <a 
                href={`mailto:${psychologist.contact.email}`}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {psychologist.contact.email}
              </a>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Teléfono</h3>
              <a 
                href={`tel:${psychologist.contact.phone}`}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {psychologist.contact.phone}
              </a>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-2">Ubicación</h3>
              <p className="text-gray-600">
                {psychologist.contact.location}
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => setLocation('/login')}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Enviar Mensaje
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold">PsicoConecta 2.0</span>
            </div>
            <p className="text-gray-400 mb-4">
              Plataforma de psicología con inteligencia artificial integrada
            </p>
            <p className="text-sm text-gray-500">
              © 2024 PsicoConecta. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}