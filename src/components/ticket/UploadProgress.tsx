
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
      <div className="w-full space-y-2">
        <Progress value={progress} className="h-2" />
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
