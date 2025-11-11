import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import CalendarComponent from "@/components/calendar";
import Chat from "@/components/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, User, Clock, CircleCheck as CheckCircle, Heart, Brain, Shield, Star, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso requerido",
        description: "Por favor inicia sesión para acceder a tu panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Cargando tu panel</h3>
            <p className="text-gray-600">Preparando tu espacio personal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-200/10 rounded-full blur-xl animate-float"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || "Usuario"}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  data-testid="img-user-avatar"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white font-bold text-xl" data-testid="text-user-initials">
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome-message">
                  ¡Hola, {user.firstName || 'Usuario'}! 👋
                </h1>
                <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {user.role === 'psychologist' ? 'Profesional' : 'Paciente'}
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">
                {user.role === 'psychologist' 
                  ? 'Bienvenido a tu panel de gestión profesional' 
                  : 'Tu espacio personal de bienestar mental te está esperando'
                }
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Próxima Cita</p>
                    <p className="text-lg font-bold text-blue-900">Hoy 3:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Sesiones</p>
                    <p className="text-lg font-bold text-green-900">12 Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Bienestar</p>
                    <p className="text-lg font-bold text-purple-900">Excelente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700">Progreso</p>
                    <p className="text-lg font-bold text-orange-900">85%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300" data-testid="card-calendar">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span>Mi Calendario</span>
                  <Badge variant="secondary" className="ml-auto">
                    <Clock className="w-3 h-3 mr-1" />
                    Tiempo Real
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent />
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <div>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300" data-testid="card-chat">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span>Chat Directo</span>
                  <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    En línea
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Chat />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-primary/5 via-white to-accent/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span>Acciones Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    className="w-full h-auto p-4 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 group"
                    data-testid="button-edit-profile"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <p className="font-medium">Editar Perfil</p>
                        <p className="text-sm text-muted-foreground">Actualiza tu información</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 hover:bg-accent/5 hover:border-accent/30 hover:text-accent transition-all duration-300 group"
                  data-testid="button-resources"
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <p className="font-medium">Recursos</p>
                      <p className="text-sm text-muted-foreground">Ejercicios y técnicas</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-300 group"
                  data-testid="button-emergency"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <p className="font-medium">Ayuda Inmediata</p>
                      <p className="text-sm text-muted-foreground">Contacto de emergencia</p>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}