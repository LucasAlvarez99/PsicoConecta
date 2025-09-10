import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  CheckCircle, 
  XCircle, 
  Eye,
  TrendingUp,
  Clock,
  UserCheck
} from "lucide-react";
import type { User, Appointment, Testimonial } from "@shared/schema";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not psychologist
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'psychologist')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Fetch patients
  const { data: patients = [], isLoading: patientsLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/patients"],
    enabled: user?.role === 'psychologist',
    retry: false,
  });

  // Fetch appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    enabled: user?.role === 'psychologist',
    retry: false,
  });

  // Fetch testimonials
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    enabled: user?.role === 'psychologist',
    retry: false,
  });

  // Toggle testimonial visibility
  const toggleTestimonialMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      await apiRequest("PATCH", `/api/admin/testimonials/${id}`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({
        title: "Testimonial updated",
        description: "The testimonial visibility has been updated.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update testimonial.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'psychologist') return null;

  // Calculate statistics
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((apt: Appointment) => apt.status === 'completed').length;
  const upcomingAppointments = appointments.filter((apt: Appointment) => 
    apt.status === 'scheduled' && new Date(apt.scheduledAt) > new Date()
  ).length;
  const publishedTestimonials = testimonials.filter((t: Testimonial) => t.isPublished).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-admin-title">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona tus pacientes, citas y testimonios</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-stat-total-patients">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-total-patients">{totalPatients}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-appointments">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Citas Programadas</p>
                  <p className="text-3xl font-bold text-accent" data-testid="text-upcoming-appointments">{upcomingAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-completed">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sesiones Completadas</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-completed-sessions">{completedAppointments}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-testimonials">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testimonios Publicados</p>
                  <p className="text-3xl font-bold text-accent" data-testid="text-published-testimonials">{publishedTestimonials}</p>
                </div>
                <Star className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="patients" data-testid="tab-patients">Pacientes</TabsTrigger>
            <TabsTrigger value="appointments" data-testid="tab-appointments">Citas</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">Testimonios</TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <Card data-testid="card-patients-list">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Lista de Pacientes ({totalPatients})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando pacientes...</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay pacientes registrados aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient: User) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`patient-card-${patient.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {patient.profileImageUrl ? (
                              <img 
                                src={patient.profileImageUrl} 
                                alt={patient.firstName || "Patient"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-primary font-semibold text-sm">
                                {(patient.firstName?.[0] || '') + (patient.lastName?.[0] || '')}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground" data-testid={`text-patient-name-${patient.id}`}>
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-patient-email-${patient.id}`}>
                              {patient.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">
                            Activo
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Desde {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/chat/${patient.id}`}
                            data-testid={`button-chat-${patient.id}`}
                            className="flex items-center space-x-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card data-testid="card-appointments-list">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Historial de Citas ({totalAppointments})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando citas...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay citas programadas aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment: Appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`appointment-card-${appointment.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground" data-testid={`text-appointment-date-${appointment.id}`}>
                              {new Date(appointment.scheduledAt).toLocaleDateString()} - {new Date(appointment.scheduledAt).toLocaleTimeString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Duración: {appointment.duration} minutos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={appointment.status === 'completed' ? 'default' : appointment.status === 'scheduled' ? 'secondary' : 'destructive'}
                            data-testid={`badge-appointment-status-${appointment.id}`}
                          >
                            {appointment.status === 'completed' ? 'Completada' : 
                             appointment.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card data-testid="card-testimonials-list">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Gestión de Testimonios ({testimonials.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando testimonios...</p>
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay testimonios aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial: Testimonial) => (
                      <div key={testimonial.id} className="p-6 border border-border rounded-lg" data-testid={`testimonial-card-${testimonial.id}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'fill-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground" data-testid={`text-testimonial-rating-${testimonial.id}`}>
                              {testimonial.rating}/5 estrellas
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={testimonial.isPublished ? 'default' : 'secondary'}
                              data-testid={`badge-testimonial-status-${testimonial.id}`}
                            >
                              {testimonial.isPublished ? 'Publicado' : 'Oculto'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTestimonialMutation.mutate({
                                id: testimonial.id,
                                isPublished: !testimonial.isPublished
                              })}
                              disabled={toggleTestimonialMutation.isPending}
                              data-testid={`button-toggle-testimonial-${testimonial.id}`}
                            >
                              {testimonial.isPublished ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Ocultar
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-1" />
                                  Publicar
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-foreground mb-4" data-testid={`text-testimonial-comment-${testimonial.id}`}>
                          {testimonial.comment}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
