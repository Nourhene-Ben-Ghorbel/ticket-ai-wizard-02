
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-800 font-[Poppins]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            IA Ticket Wizard
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Optimisez la gestion des incidents avec notre solution d'IA spécialisée
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                  onClick={() => navigate("/login")}
                >
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 border border-blue-400 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  onClick={() => navigate("/signup")}
                >
                  Créer un compte
                </Button>
              </>
            ) : (
              <Button 
                className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
              >
                Accéder à mon tableau de bord
              </Button>
            )}
          </div>
          
          <div className="mt-16 text-sm text-gray-500">
            <p>© 2025 IA Ticket Wizard. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
