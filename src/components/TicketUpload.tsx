
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./ticket/FileDropzone";
import { FilePreview } from "./ticket/FilePreview";
import { UploadProgress } from "./ticket/UploadProgress";
import { TicketInstructions } from "./TicketInstructions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useToast } from "@/hooks/use-toast";

export const TicketUpload = ({ onFileUploaded }: { onFileUploaded: (text: string, ticketIds?: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addToHistory } = useSearchHistory();
  const isDark = theme === "dark";

  const handleUpload = async () => {
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
      
      // Simuler une recherche de tickets similaires
      setTimeout(() => {
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
          <FileDropzone onFileAccepted={setFile} />
        ) : (
          <FilePreview 
            file={file}
            onRemove={() => setFile(null)}
            onUpload={handleUpload}
            uploading={uploading}
          />
        )}
        
        {uploading && <UploadProgress progress={progress} />}
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
