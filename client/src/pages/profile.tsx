import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, Calendar, CreditCard as Edit, Save, Settings, Chrome as Home, ArrowRight, LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

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

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente.",
      });
      setIsEditing(false);
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
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1" data-testid="text-profile-title">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300" data-testid="card-profile-info">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>Información Personal</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-edit-profile"
                  className={`transition-all duration-300 ${
                    isEditing 
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg' 
                      : 'hover:bg-primary/5 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-pulse" />
                      {updateProfileMutation.isPending ? "Guardando..." : "Guardar"}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Editar
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                  <div className="relative">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl}
                        alt={user.firstName || "Usuario"}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                        data-testid="img-profile-picture"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl" data-testid="text-profile-initials">
                          {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900" data-testid="text-full-name">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600" data-testid="text-user-type">
                      {user.role === 'psychologist' ? 'Psicólogo Profesional' : 'Paciente'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Miembro desde {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      data-testid="input-first-name"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      data-testid="input-last-name"
                      className="border-gray-200 focus:border-primary focus:ring-primary/20 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    data-testid="input-email"
                    className="border-gray-200 focus:border-primary focus:ring-primary/20 disabled:bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="mt-6 shadow-lg border-0 bg-gradient-to-br from-white to-accent/5 hover:shadow-xl transition-all duration-300" data-testid="card-account-info">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <span>Información de Cuenta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm p-3 bg-green-50 rounded-lg border border-green-200">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">Email verificado</span>
                </div>
                <div className="flex items-center space-x-3 text-sm p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">
                    Registro: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">
                    Tipo: {user.role === 'psychologist' ? 'Profesional' : 'Paciente'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300" data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <span>Acciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-300 group"
                    data-testid="button-back-home"
                  >
                    <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Volver al Inicio
                    <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full hover:bg-red-600 transition-all duration-300 group"
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
