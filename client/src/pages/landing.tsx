import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/landing/hero-section";
import SpecialtiesSection from "@/components/landing/specialties-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Heart, Shield, Clock, MapPin, Phone, Mail, Star, CircleCheck as CheckCircle, Users, Award, Sparkles, ArrowRight, Calendar, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Redirigiendo a tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-200/10 rounded-full blur-2xl animate-float-delay"></div>
      </div>

      <HeroSection />

      <SpecialtiesSection />

      <TestimonialsSection />

      <section id="contacto" className="py-20 bg-gradient-to-r from-primary/5 via-white to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              ¡Oferta Especial!
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Reserva tu Primera Consulta
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Gratuita</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Da el primer paso hacia tu bienestar. Agenda una sesión sin compromiso y descubre cómo podemos ayudarte.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Agenda tu Cita</h3>
                  <p className="text-gray-600">Completa el formulario y nos pondremos en contacto contigo</p>
                </div>

                <form className="space-y-4">
                  <div>
                    <Input placeholder="Nombre completo" className="h-12" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Correo electrónico" className="h-12" />
                  </div>
                  <div>
                    <Input type="tel" placeholder="Teléfono" className="h-12" />
                  </div>
                  <div>
                    <Textarea placeholder="¿En qué podemos ayudarte?" className="min-h-32" />
                  </div>
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white">
                    <Calendar className="mr-2 h-5 w-5" />
                    Solicitar Consulta Gratuita
                  </Button>
                </form>
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Ubicación</h4>
                    <p className="text-gray-600">Av. Principal 123, Centro Médico</p>
                    <p className="text-gray-600">Ciudad, País</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Teléfono</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Lun - Vie: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">contacto@terapia.com</p>
                    <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Terapia Psicológica</h3>
              <p className="text-gray-400">
                Profesionales dedicados a tu bienestar mental y emocional.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Terapia Individual</li>
                <li>Terapia de Pareja</li>
                <li>Terapia Familiar</li>
                <li>Manejo de Ansiedad</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#inicio">Inicio</Link></li>
                <li><Link href="/#servicios">Servicios</Link></li>
                <li><Link href="/#contacto">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Horario</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Lunes - Viernes: 9:00 - 19:00</li>
                <li>Sábado: 10:00 - 14:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Terapia Psicológica. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
