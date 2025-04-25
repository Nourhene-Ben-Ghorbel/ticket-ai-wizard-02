
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileCode2, Upload, X, FileSpreadsheet, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchSimilarTickets } from "../api/fastApiService";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { TicketInstructions } from "./TicketInstructions";

export const TicketUpload = ({ onFileUploaded }: { onFileUploaded: (text: string, ticketIds?: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addToHistory } = useSearchHistory();
  const isDark = theme === "dark";

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();
      
      if (
        !fileName.endsWith('.xlsx') &&
        !fileName.endsWith('.xls') &&
        !fileName.endsWith('.csv')
      ) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier Excel (.xlsx, .xls) ou CSV",
          variant: "destructive",
        });
        return;
      }
      
      // Accepter directement le fichier sans validation backend
      setFile(selectedFile);
      setExpanded(true);
      
      toast({
        title: "Fichier accepté",
        description: `Le fichier ${selectedFile.name} a été chargé avec succès`,
      });
    }
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false,
  });
  
  const removeFile = () => {
    setFile(null);
    setExpanded(false);
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    let progressInterval: NodeJS.Timeout;

    try {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const fileContent = await readFileAsText(file);
      
      // Simuler une recherche de tickets similaires sans appel backend
      setTimeout(() => {
        // Exemple de réponse simulée
        const mockResponse = {
          status: 'success',
          tickets: [
            { 
              ticket_id: "T12345", 
              similarity_score: 0.87, 
              problem: "Erreur lors de la connexion à l'application",
              solution: "Vérifier les identifiants et réinitialiser le mot de passe si nécessaire."
            },
            { 
              ticket_id: "T67890", 
              similarity_score: 0.75,
              problem: "L'application ne répond pas",
              solution: "Redémarrer l'application et vérifier la connexion internet."
            }
          ],
          temps_recherche: 2.3
        };
        
        const bestMatch = mockResponse.tickets[0];
        const ticketIds = mockResponse.tickets.map(t => t.ticket_id);
        
        const responseMessage = `
          J'ai trouvé une solution pour votre ticket! 
          
          **Problème identifié:** ${bestMatch.problem}
          
          **Solution:** ${bestMatch.solution}
          
          *Temps de recherche: ${mockResponse.temps_recherche?.toFixed(2)}s*
        `;
        
        toast({
          title: "Solution trouvée",
          description: `Une solution a été trouvée avec un score de similarité de ${(bestMatch.similarity_score * 100).toFixed(1)}%`,
        });
        
        addToHistory({
          queryText: file.name,
          result: responseMessage,
          ticketIds: ticketIds
        });
        
        onFileUploaded(responseMessage, ticketIds);
        
        clearInterval(progressInterval);
        setProgress(100);
        setIsMinimized(true);
        setTimeout(() => setProgress(0), 1000);
        setUploading(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du fichier.",
        variant: "destructive",
      });
      
      onFileUploaded("Une erreur est survenue lors de l'analyse de votre ticket. Veuillez réessayer.");
      clearInterval(progressInterval);
      setUploading(false);
      setProgress(0);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className={cn(
        "transition-all duration-300",
        isMinimized ? "w-full md:w-1/3" : "w-full md:w-2/3"
      )}>
        {!file ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              isDragActive 
                ? isDark
                  ? "border-blue-500 bg-blue-900/20" 
                  : "border-blue-500 bg-blue-50"
                : isDark
                  ? "border-gray-700 hover:border-blue-500 hover:bg-blue-900/10"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className={cn(
                "p-2 rounded-full",
                isDragActive 
                  ? isDark
                    ? "bg-blue-900/50"
                    : "bg-blue-100" 
                  : isDark
                    ? "bg-gray-800"
                    : "bg-gray-100"
              )}>
                <Upload 
                  size={24} 
                  className={isDragActive ? 'text-blue-600' : 'text-gray-400'} 
                />
              </div>
              <h3 className="text-base font-medium text-foreground">
                {isDragActive ? "Déposez votre fichier ici" : "Importer un ticket"}
              </h3>
              <p className={cn(
                "text-xs",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                Formats supportés: XLSX, XLS, CSV
              </p>
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                className={cn(
                  isDark 
                    ? "border-blue-700 text-blue-400 hover:bg-blue-900/30"
                    : "border-blue-200 text-blue-600"
                )}
              >
                Parcourir
              </Button>
            </div>
          </div>
        ) : (
          <motion.div 
            className={cn(
              "border rounded-xl",
              isDark ? "bg-card/30 border-gray-800" : "bg-white border-gray-200"
            )}
            layout
          >
            <div 
              className={cn(
                "p-3 flex items-center justify-between cursor-pointer",
                isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-1.5 rounded-lg",
                  isDark ? "bg-blue-900/50" : "bg-blue-100"
                )}>
                  <FileSpreadsheet size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {!uploading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            {expanded && (
              <div className="p-4 pt-0 border-t border-gray-700">
                {uploading ? (
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
                ) : (
                  <Button 
                    onClick={uploadFile} 
                    className={cn(
                      "w-full mt-2",
                      isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    )}
                  >
                    <Upload size={18} className="mr-2" />
                    Analyser le ticket
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className={cn(
        "transition-all duration-300",
        isMinimized ? "hidden" : "w-full md:w-1/3"
      )}>
        <TicketInstructions />
      </div>
    </div>
  );
};
