
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TicketUpload } from "@/components/TicketUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { Upload, ArrowRight } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  
  const handleFileUploaded = (message: string) => {
    setInitialMessage(message);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sourcesans text-foreground">
      {isDark && <StarfieldBackground />}
      {isDark && <CosmicElements />}
      <Navbar />
      
      <main className="container mx-auto pt-24 px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className={cn(
              "text-4xl md:text-5xl font-bold text-gradient mb-4",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Ticket AI Wizard
            </h1>
            
            <p className={cn(
              "text-lg max-w-2xl mx-auto",
              isDark ? "text-blue-200/90" : "text-blue-700/90"
            )}>
              Explorez l'univers de vos tickets avec notre IA avancée. Importez votre fichier 
              pour obtenir des réponses instantanées.
            </p>
          </motion.div>
          
          {isAdmin && (
            <motion.div 
              className="mb-6 flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={() => navigate('/admin')} 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-2",
                  isDark ? "text-blue-300 hover:text-blue-200 hover:bg-blue-900/30" : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                )}
              >
                Voir le dashboard administrateur
                <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <div className="cosmic-card mb-6">
              <div className="p-6">
                <h2 className={cn(
                  "text-xl font-medium mb-4 flex items-center",
                  isDark ? "text-white" : "text-gray-800"
                )}>
                  <Upload className={cn("mr-2", isDark ? "text-indigo-400" : "text-blue-600")} size={20} />
                  Importez votre fichier de tickets
                </h2>
                <TicketUpload onFileUploaded={handleFileUploaded} />
              </div>
            </div>
          </motion.div>
          
          {initialMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChatInterface initialMessage={initialMessage} />
            </motion.div>
          )}
        </motion.div>
      </main>
      
      {isDark && (
        <>
          <GlowingOrb className="fixed top-1/4 left-1/5 -z-10" size={250} color="rgba(79, 70, 229, 0.08)" />
          <GlowingOrb className="fixed bottom-1/4 right-1/5 -z-10" size={300} color="rgba(124, 58, 237, 0.06)" />
        </>
      )}
    </div>
  );
};

export default Dashboard;
