
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { FileSpreadsheet, Upload, Search } from 'lucide-react';

export const TicketInstructions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Gifs pour expliquer le processus
  const instructionGifs = [
    {
      title: "1. Sélectionnez votre ticket",
      description: "Préparez votre ticket au format Excel (.xlsx ou .xls)",
      icon: <FileSpreadsheet size={28} className={cn(isDark ? "text-blue-300" : "text-blue-600")} />,
      animation: { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] },
      gifUrl: "https://img.lovable.ai/photo-1488590528505-98d2b5aba04b" 
    },
    {
      title: "2. Importez le ticket",
      description: "Glissez-déposez ou cliquez pour sélectionner le fichier",
      icon: <Upload size={28} className={cn(isDark ? "text-blue-300" : "text-blue-600")} />,
      animation: { y: [0, -5, 0] },
      gifUrl: "https://img.lovable.ai/photo-1461749280684-dccba630e2f6"
    },
    {
      title: "3. Attendez l'analyse",
      description: "Notre système analyse votre ticket et trouve la meilleure solution",
      icon: <Search size={28} className={cn(isDark ? "text-blue-300" : "text-blue-600")} />,
      animation: { rotate: 360 },
      gifUrl: "https://img.lovable.ai/photo-1531297484001-80022131f5a1"
    }
  ];

  return (
    <div className={cn(
      "p-5 rounded-xl border h-full",
      isDark ? "bg-card/30 border-gray-800" : "bg-white border-gray-200"
    )}>
      <h3 className="text-base font-medium mb-4">Comment ça marche ?</h3>
      <div className="space-y-5">
        {instructionGifs.map((instruction, index) => (
          <div key={index} className="space-y-3">
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              )}>
                <motion.div
                  animate={instruction.animation}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  {instruction.icon}
                </motion.div>
              </div>
              <div>
                <h4 className={cn(
                  "text-sm font-medium mb-1",
                  isDark ? "text-blue-300" : "text-blue-600"
                )}>
                  {instruction.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {instruction.description}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 * (index + 1) }}
              className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img 
                src={instruction.gifUrl} 
                alt={`Étape ${index + 1}`} 
                className="w-full h-auto object-cover aspect-video"
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
