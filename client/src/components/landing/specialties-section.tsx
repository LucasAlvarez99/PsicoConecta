import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Shield, Users } from "lucide-react";

const specialties = [
  {
    icon: Brain,
    title: "Terapia Cognitivo-Conductual",
    description: "Técnicas efectivas para manejar pensamientos y conductas",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Heart,
    title: "Terapia de Pareja",
    description: "Fortalece tus relaciones y mejora la comunicación",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Shield,
    title: "Manejo de Ansiedad",
    description: "Aprende a controlar el estrés y la ansiedad",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Terapia Familiar",
    description: "Armonía y entendimiento en el núcleo familiar",
    color: "from-purple-500 to-violet-600"
  }
];

export default function SpecialtiesSection() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestras Especialidades
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Servicios profesionales adaptados a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialties.map((specialty, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${specialty.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <specialty.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{specialty.title}</h3>
                <p className="text-gray-600">{specialty.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
