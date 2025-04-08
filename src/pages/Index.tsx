
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, LogIn, UserPlus, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen text-white font-['Space_Grotesk'] relative overflow-hidden">
      <StarfieldBackground />
      <CosmicElements />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shadow-neon relative animate-pulse-slow">
              <MessageCircle size={40} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-indigo-600 blur-md opacity-50"></div>
              <Star className="absolute -top-1 -right-1 text-yellow-300 animate-twinkle" size={16} />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gradient"
            variants={itemVariants}
          >
            IA Ticket Wizard
          </motion.h1>
          
          <motion.p 
            className="text-lg text-blue-100/80 mb-10 max-w-xl mx-auto"
            variants={itemVariants}
          >
            Explorez l'univers des tickets avec notre intelligence artificielle avancée
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            variants={itemVariants}
          >
            {!isAuthenticated ? (
              <>
                <Button 
                  className="text-lg px-8 py-7 cosmic-button group relative overflow-hidden"
                  onClick={() => navigate("/login")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn size={18} className="text-white" />
                    <span>Se connecter</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-7 border-2 border-indigo-400/30 text-white hover:bg-indigo-900/30 rounded-lg transition-all duration-300 backdrop-blur-sm relative"
                  onClick={() => navigate("/signup")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <UserPlus size={18} className="text-white" />
                    <span>Créer un compte</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </>
            ) : (
              <Button 
                className="text-lg px-8 py-7 cosmic-button group relative overflow-hidden"
                onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
              >
                <span className="relative z-10">Accéder à mon tableau de bord</span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            )}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-sm text-blue-200/50"
            variants={itemVariants}
          >
            <p>© 2025 IA Ticket Wizard. Tous droits réservés.</p>
          </motion.div>
        </motion.div>

        <GlowingOrb className="top-1/3 left-1/4 -z-10" size={200} color="rgba(79, 70, 229, 0.2)" />
        <GlowingOrb className="bottom-1/4 right-1/4 -z-10" size={300} color="rgba(124, 58, 237, 0.15)" />
      </div>
    </div>
  );
};

export default Index;
