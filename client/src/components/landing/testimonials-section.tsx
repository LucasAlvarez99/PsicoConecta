import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "Paciente desde 2023",
    content: "La terapia ha transformado mi vida. El profesionalismo y la empatía son excepcionales.",
    rating: 5,
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    name: "Carlos Rodríguez",
    role: "Terapia de Pareja",
    content: "Gracias a la terapia, mi relación mejoró significativamente. Totalmente recomendado.",
    rating: 5,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"
  },
  {
    name: "Ana Martínez",
    role: "Manejo de Ansiedad",
    content: "Encontré las herramientas que necesitaba para manejar mi ansiedad. Muy agradecida.",
    rating: 5,
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Testimonios reales de personas que confiaron en nosotros
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
