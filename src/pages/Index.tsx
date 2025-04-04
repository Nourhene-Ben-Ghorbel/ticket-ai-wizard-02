
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, BarChart3, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();

  // Feature cards data
  const features = [
    {
      icon: <Bot size={24} className="text-blue-600" />,
      title: "Analyse IA",
      description: "Identification automatique des doublons et des solutions basées sur l'historique"
    },
    {
      icon: <BarChart3 size={24} className="text-blue-600" />,
      title: "Tableau de bord",
      description: "Suivi des performances et visualisation des statistiques en temps réel"
    },
    {
      icon: <CheckCircle size={24} className="text-blue-600" />,
      title: "Confidentialité",
      description: "Traitement local des données pour garantir la sécurité et la confidentialité"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 bg-blue-50">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            <span className="text-blue-600">Automatisez</span> le traitement de vos 
            <span className="text-blue-600"> tickets Jira</span> avec l'IA
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Optimisez la gestion des incidents, détectez les doublons, et trouvez des solutions 
            basées sur l'historique des résolutions passées.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/signup")}
            >
              Commencer gratuitement
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-6 border border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Fonctionnalités principales</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Notre solution combine l'IA et l'analyse des données pour améliorer 
              l'efficacité de la gestion de vos tickets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white p-8 rounded-xl card-shadow hover-scale",
                  "transition-all duration-300"
                )}
              >
                <div className="p-3 bg-blue-100 rounded-xl w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Prêt à révolutionner votre gestion de tickets?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui ont réduit leur temps de résolution 
            et amélioré leur efficacité grâce à notre solution d'IA.
          </p>
          <Button 
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/signup")}
          >
            Commencer dès maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
