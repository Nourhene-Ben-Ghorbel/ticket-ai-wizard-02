
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Star } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { motion } from "framer-motion";

const Login = () => {
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(values.email, values.password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-['Montserrat'] relative">
      <StarfieldBackground />
      <CosmicElements />
      
      <motion.div 
        className="w-full max-w-md cosmic-card p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute top-4 left-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-white hover:text-white hover:bg-white/5"
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </Button>
        </div>
        
        <div className="mb-8 text-center">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-neon relative">
              <MessageCircle size={32} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-50"></div>
              <Star className="absolute -top-1 -right-1 text-yellow-300 animate-twinkle" size={14} />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-white mb-2 text-glow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Connexion
          </motion.h1>
          
          <motion.p 
            className="text-blue-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Accédez à votre portail interstellaire
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AuthForm type="login" onSubmit={handleSubmit} isLoading={loading} />
        </motion.div>
      </motion.div>
      
      <GlowingOrb className="top-1/4 left-1/4 -z-10" size={200} color="rgba(59, 130, 246, 0.15)" />
      <GlowingOrb className="bottom-1/4 right-1/4 -z-10" size={150} color="rgba(59, 130, 246, 0.1)" />
    </div>
  );
};

export default Login;
