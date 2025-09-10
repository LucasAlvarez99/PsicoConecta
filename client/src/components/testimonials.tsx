import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch published testimonials
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    retry: false,
  });

  // Submit testimonial mutation
  const submitTestimonialMutation = useMutation({
    mutationFn: async (testimonialData: { rating: number; comment: string }) => {
      await apiRequest("POST", "/api/testimonials", testimonialData);
    },
    onSuccess: () => {
      toast({
        title: "Testimonial enviado",
        description: "Tu testimonial ha sido enviado y está pendiente de aprobación.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setShowForm(false);
      setRating(0);
      setComment("");
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
        description: "No se pudo enviar el testimonial. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      toast({
        title: "Error",
        description: "Por favor, proporciona una calificación y comentario.",
        variant: "destructive",
      });
      return;
    }
    submitTestimonialMutation.mutate({ rating, comment: comment.trim() });
  };

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Lo que dicen mis pacientes</h2>
          <p className="text-xl text-muted-foreground">Testimonios reales de quienes han confiado en mi acompañamiento</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Cargando testimonios...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay testimonios disponibles aún</p>
            </div>
          ) : (
            testimonials.map((testimonial: Testimonial) => (
              <Card key={testimonial.id} className="testimonial-card hover:shadow-lg transition-all duration-300" data-testid={`testimonial-${testimonial.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground" data-testid={`testimonial-author-${testimonial.id}`}>
                        Paciente Verificado
                      </h4>
                      <div className="flex text-yellow-400 mb-1" data-testid={`testimonial-stars-${testimonial.id}`}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'fill-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed" data-testid={`testimonial-comment-${testimonial.id}`}>
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Add Review Section */}
        <Card className="max-w-2xl mx-auto" data-testid="testimonial-form-card">
          <CardHeader>
            <CardTitle className="text-center">Comparte tu experiencia</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated && user?.role === 'patient' ? (
              !showForm ? (
                <div className="text-center">
                  <Button 
                    onClick={() => setShowForm(true)}
                    data-testid="button-show-testimonial-form"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Escribir Testimonial
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-foreground font-medium mb-2">Tu calificación</label>
                    <div className="flex space-x-1" data-testid="star-rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className={`text-2xl transition-colors ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400`}
                          data-testid={`star-button-${star}`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-foreground font-medium mb-2">Tu comentario</label>
                    <Textarea 
                      rows={4} 
                      placeholder="Cuéntanos sobre tu experiencia..." 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      data-testid="testimonial-comment-input"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      disabled={submitTestimonialMutation.isPending || rating === 0 || !comment.trim()}
                      data-testid="button-submit-testimonial"
                    >
                      {submitTestimonialMutation.isPending ? "Enviando..." : "Enviar Testimonial"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setRating(0);
                        setComment("");
                      }}
                      data-testid="button-cancel-testimonial"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {!isAuthenticated 
                    ? "Inicia sesión para compartir tu experiencia" 
                    : "Solo los pacientes pueden enviar testimonios"
                  }
                </p>
                {!isAuthenticated && (
                  <Button 
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-login-for-testimonial"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
