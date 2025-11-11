import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, MessageSquare } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Primera sesión gratuita
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Terapia Psicológica
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Profesional</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Encuentra el equilibrio emocional que buscas con nuestros especialistas certificados.
                Atención personalizada y confidencial para tu bienestar mental.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Agenda tu Consulta
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-gray-50">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contáctanos
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in-delay">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/7176325/pexels-photo-7176325.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Consulta psicológica"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
