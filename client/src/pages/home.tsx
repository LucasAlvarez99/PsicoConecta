import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import CalendarComponent from "@/components/calendar";
import Chat from "@/components/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { MessageCircle, Calendar, User, Settings } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  // Load user notes
  useEffect(() => {
    if (user?.personalNotes) {
      setNotes(user.personalNotes);
    }
  }, [user]);

  // Save notes mutation
  const saveNotesMutation = useMutation({
    mutationFn: async (personalNotes: string) => {
      await apiRequest("PATCH", "/api/profile/notes", { notes: personalNotes });
    },
    onSuccess: () => {
      toast({
        title: "Notas guardadas",
        description: "Tus notas personales se han guardado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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
        description: "No se pudieron guardar las notas. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSaveNotes = () => {
    saveNotesMutation.mutate(notes);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.firstName || "Usuario"}
                    className="w-16 h-16 rounded-full object-cover"
                    data-testid="img-user-avatar"
                  />
                ) : (
                  <span className="text-primary font-bold text-xl" data-testid="text-user-initials">
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-welcome-user">
                  ¡Hola, {user.firstName || 'Usuario'}!
                </h1>
                <p className="text-muted-foreground" data-testid="text-user-role">
                  {user.role === 'psychologist' ? 'Psicólogo' : 'Paciente'} • Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {user.role === 'psychologist' ? 'Profesional' : 'Paciente Activo'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card data-testid="card-calendar">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Mi Calendario de Sesiones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent />
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card className="mt-8" data-testid="card-chat">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat con mi Psicólogo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chat />
              </CardContent>
            </Card>
          </div>

          {/* Personal Notes Sidebar */}
          <div>
            <Card data-testid="card-personal-notes">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Mis Notas Personales</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe aquí tus pensamientos, objetivos o temas que quieras tratar en la próxima sesión..."
                    rows={12}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    data-testid="textarea-personal-notes"
                  />
                  <Button 
                    onClick={handleSaveNotes}
                    disabled={saveNotesMutation.isPending}
                    className="w-full"
                    data-testid="button-save-notes"
                  >
                    {saveNotesMutation.isPending ? "Guardando..." : "Guardar Notas"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6" data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/profile"}
                  data-testid="button-edit-profile"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                {user.role === 'psychologist' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/admin"}
                    data-testid="button-admin-panel"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Panel de Administración
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
