
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  return (
    <motion.div 
      className="py-6 flex flex-col items-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin text-blue-500">
          <Loader className="h-8 w-8" />
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Analyse du ticket en cours...
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Veuillez patienter</p>
        <p className="text-xs text-muted-foreground mt-1">
          Notre système recherche la meilleure solution
        </p>
      </div>
    </motion.div>
  );
};
