
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TicketUpload } from "@/components/TicketUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { MessageCircle, Upload } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  
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
    <div className="min-h-screen text-white relative overflow-x-hidden font-['Space_Grotesk']">
      <StarfieldBackground />
      <CosmicElements />
      <Navbar />
      
      <main className="container mx-auto pt-24 px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Ticket AI Wizard</span>
            </h1>
            <p className="text-blue-200/80 max-w-lg mx-auto">
              Explorez l'univers de vos tickets avec notre IA avancée. Importez votre fichier pour obtenir des réponses instantanées.
            </p>
          </motion.div>
          
          <motion.div 
            className="cosmic-card mb-6"
            variants={itemVariants}
          >
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4 text-white flex items-center">
                <Upload className="mr-2 text-indigo-400" size={20} />
                Importez votre fichier de tickets
              </h2>
              <TicketUpload onFileUploaded={handleFileUploaded} />
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
      
      <GlowingOrb className="fixed top-1/4 left-1/5 -z-10" size={250} color="rgba(79, 70, 229, 0.08)" />
      <GlowingOrb className="fixed bottom-1/4 right-1/5 -z-10" size={300} color="rgba(124, 58, 237, 0.06)" />
    </div>
  );
};

export default Dashboard;
