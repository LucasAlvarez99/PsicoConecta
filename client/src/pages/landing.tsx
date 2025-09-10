import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Star, 
  Brain, 
  Calendar, 
  MessageCircle, 
  User, 
  Phone, 
  Mail, 
  Clock,
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/navigation";
import Testimonials from "@/components/testimonials";

export default function Landing() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to login for booking
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-bg py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Tu bienestar mental es mi prioridad
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                Terapia psicológica profesional con un enfoque personalizado. Agenda tu sesión, accede a tu perfil personal y mantente conectado en tu proceso de crecimiento personal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-card text-primary hover:bg-secondary"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-book-session"
                >
                  Agendar Primera Sesión
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-access-profile"
                >
                  Acceder a Mi Perfil
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
                  alt="Dra. María Elena González - Psicóloga Clínica" 
                  className="w-full h-[600px] object-cover"
                  data-testid="img-psychologist" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-white text-2xl font-bold mb-2" data-testid="text-psychologist-name">Dra. María Elena González</h3>
                  <p className="text-white/90 text-lg" data-testid="text-psychologist-title">Psicóloga Clínica • 12+ años de experiencia</p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" data-testid={`star-rating-${i + 1}`} />
                      ))}
                    </div>
                    <span className="text-white/90 text-sm" data-testid="text-rating">5.0 • 200+ pacientes atendidos</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-lg shadow-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-stat-patients">200+</div>
                  <div className="text-sm text-muted-foreground">Pacientes</div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -left-4 bg-card p-4 rounded-lg shadow-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-stat-years">12+</div>
                  <div className="text-sm text-muted-foreground">Años</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Una plataforma, todas las herramientas</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gestión integral de tu proceso terapéutico con tecnología diseñada para tu bienestar
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300" data-testid="card-service-calendar">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Agenda Inteligente</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Reserva tus citas de forma automática con recordatorios personalizados. Sistema integrado que se adapta a tus horarios y preferencias.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Reserva online 24/7
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Recordatorios automáticos
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Reprogramación flexible
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300" data-testid="card-service-profile">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <User className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Perfil Personal</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Tu espacio privado con historial de sesiones, notas personales y seguimiento de tu progreso terapéutico.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    Bloc de notas personal
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    Historial de sesiones
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-accent mr-3" />
                    Seguimiento de progreso
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300" data-testid="card-service-chat">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Chat en Vivo</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comunicación directa y segura entre sesiones para mantener el apoyo constante en tu proceso.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Mensajería segura
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Soporte entre sesiones
                  </li>
                  <li className="flex items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Respuesta rápida
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Statistics Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Resultados que hablan por sí solos</h2>
            <p className="text-xl text-muted-foreground">El impacto real en la vida de mis pacientes</p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <Card className="text-center" data-testid="card-stat-patients">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-total-patients">200+</div>
                <div className="text-muted-foreground font-medium">Pacientes atendidos</div>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="card-stat-experience">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent mb-2" data-testid="text-years-experience">12+</div>
                <div className="text-muted-foreground font-medium">Años de experiencia</div>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="card-stat-rating">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-average-rating">5.0</div>
                <div className="text-muted-foreground font-medium">Calificación promedio</div>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="card-stat-satisfaction">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent mb-2" data-testid="text-success-rate">95%</div>
                <div className="text-muted-foreground font-medium">Satisfacción pacientes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">¿Listo para comenzar tu proceso?</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Reserva tu primera sesión y da el primer paso hacia tu bienestar mental
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-card rounded-3xl p-8 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Teléfono</p>
                      <p className="text-muted-foreground" data-testid="text-phone">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground" data-testid="text-email">dra.gonzalez@psicoconecta.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Horarios</p>
                      <p className="text-muted-foreground" data-testid="text-schedule">Lun-Vie: 9:00-18:00<br/>Sáb: 9:00-14:00</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-2xl p-6">
                  <h4 className="font-bold text-foreground mb-3">Primera sesión gratuita</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Ofrezco una sesión inicial sin costo para conocerte y determinar el mejor enfoque terapéutico para tu situación particular.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Reservar Primera Sesión</h3>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-foreground font-medium mb-2">Nombre</label>
                      <Input 
                        type="text" 
                        name="name"
                        placeholder="Tu nombre completo" 
                        value={formData.name}
                        onChange={handleInputChange}
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-2">Email</label>
                      <Input 
                        type="email" 
                        name="email"
                        placeholder="tu@email.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-foreground font-medium mb-2">Teléfono</label>
                      <Input 
                        type="tel" 
                        name="phone"
                        placeholder="+1 (555) 000-0000" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground font-medium mb-2">Fecha preferida</label>
                      <Input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        data-testid="input-date"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-foreground font-medium mb-2">Cuéntame brevemente tu situación</label>
                    <Textarea 
                      rows={4} 
                      name="message"
                      placeholder="Describe qué te gustaría trabajar en terapia..." 
                      value={formData.message}
                      onChange={handleInputChange}
                      data-testid="textarea-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    data-testid="button-submit-booking"
                  >
                    Reservar Primera Sesión Gratuita
                  </Button>
                </form>
                
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Al reservar aceptas nuestros términos de privacidad y confidencialidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary">PsicoConecta</span>
              </div>
              <p className="text-background/70 leading-relaxed max-w-md">
                Terapia psicológica profesional con tecnología moderna. Tu bienestar mental es mi prioridad, con herramientas diseñadas para acompañarte en cada paso de tu proceso.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-background mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Inicio</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Servicios</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Testimonios</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Contacto</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-background mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Términos de Uso</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Privacidad</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Confidencialidad</a>
                <a href="#" className="block text-background/70 hover:text-primary transition-colors">Código de Ética</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 mt-8 text-center">
            <p className="text-background/70">© 2024 PsicoConecta. Todos los derechos reservados. • Registro Profesional #123456</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
