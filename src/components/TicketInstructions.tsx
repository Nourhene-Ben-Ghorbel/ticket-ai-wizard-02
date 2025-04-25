
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export const TicketInstructions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "p-6 rounded-xl border",
      isDark ? "bg-card/30 border-gray-800" : "bg-white border-gray-200"
    )}>
      <h3 className="text-lg font-medium mb-4">Comment ça marche ?</h3>
      <div className="space-y-6">
        {/* Étape 1 */}
        <motion.div 
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-shrink-0 w-16 h-16">
            <img 
              src="https://media.giphy.com/media/3o7TKqm1mNz6jxRcqY/giphy.gif"
              alt="Sélectionner un fichier"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h4 className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-blue-300" : "text-blue-600"
            )}>
              1. Sélectionnez votre ticket
            </h4>
            <p className="text-sm text-muted-foreground">
              Préparez votre ticket au format Excel (.xlsx ou .xls)
            </p>
          </div>
        </motion.div>

        {/* Étape 2 */}
        <motion.div 
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex-shrink-0 w-16 h-16">
            <img 
              src="https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif"
              alt="Upload en cours"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h4 className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-blue-300" : "text-blue-600"
            )}>
              2. Importez le ticket
            </h4>
            <p className="text-sm text-muted-foreground">
              Glissez-déposez ou cliquez pour sélectionner le fichier
            </p>
          </div>
        </motion.div>

        {/* Étape 3 */}
        <motion.div 
          className="flex items-start gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex-shrink-0 w-16 h-16">
            <img 
              src="https://media.giphy.com/media/3o7TKo0x4qrYCaRZ4Y/giphy.gif"
              alt="Analyse en cours"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h4 className={cn(
              "text-sm font-medium mb-1",
              isDark ? "text-blue-300" : "text-blue-600"
            )}>
              3. Attendez l'analyse
            </h4>
            <p className="text-sm text-muted-foreground">
              Notre système analyse votre ticket et trouve la meilleure solution
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
