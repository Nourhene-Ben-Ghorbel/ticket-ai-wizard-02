
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { WaveAnimation } from "@/components/WaveAnimation";
import { Bot, BarChart3, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();

  // Feature cards data
  const features = [
    {
      icon: <Bot size={24} />,
      title: "Analyse IA",
      description: "Identification automatique des doublons et des solutions basées sur l'historique"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Tableau de bord",
      description: "Suivi des performances et visualisation des statistiques en temps réel"
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Confidentialité",
      description: "Traitement local des données pour garantir la sécurité et la confidentialité"
    }
  ];

  // Animate on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in-element").forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-darkblue-950 text-white overflow-x-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            <span className="text-gradient">Automatisez</span> le traitement de vos 
            <span className="text-gradient"> tickets Jira</span> avec l'IA
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Optimisez la gestion des incidents, détectez les doublons, et trouvez des solutions 
            basées sur l'historique des résolutions passées.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              className="text-lg px-8 py-6 bg-blue-gradient hover:opacity-90"
              onClick={() => navigate("/signup")}
            >
              Commencer gratuitement
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-6 border border-blue-500 hover:bg-blue-900/20"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </Button>
          </div>
        </div>
        <WaveAnimation />
      </div>
      
      {/* Features Section */}
      <div className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-element">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités principales</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Notre solution combine l'IA et l'analyse des données pour améliorer 
              l'efficacité de la gestion de vos tickets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card p-8 rounded-xl hover-scale fade-in-element",
                  "transition-all duration-300"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-3 bg-blue-900/30 rounded-xl w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center fade-in-element">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à révolutionner votre gestion de tickets?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui ont réduit leur temps de résolution 
            et amélioré leur efficacité grâce à notre solution d'IA.
          </p>
          <Button 
            className="text-lg px-8 py-6 bg-blue-gradient hover:opacity-90"
            onClick={() => navigate("/signup")}
          >
            Commencer dès maintenant
          </Button>
        </div>
        <WaveAnimation />
      </div>
    </div>
  );
};

export default Index;
