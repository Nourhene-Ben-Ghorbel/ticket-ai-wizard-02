
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./ticket/FileDropzone";
import { FilePreview } from "./ticket/FilePreview";
import { UploadProgress } from "./ticket/UploadProgress";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useToast } from "@/hooks/use-toast";

export const TicketUpload = ({ onFileUploaded }: { onFileUploaded: (text: string, ticketIds?: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addToHistory } = useSearchHistory();
  const isDark = theme === "dark";

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
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
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du fichier.",
        variant: "destructive",
      });
      
      onFileUploaded("Une erreur est survenue lors de l'analyse de votre ticket. Veuillez réessayer.");
      setUploading(false);
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
    <div className="flex flex-col gap-6">
      <div>
        {!file ? (
          <FileDropzone onFileAccepted={setFile} />
        ) : (
          <div>
            <FilePreview file={file} onRemove={() => setFile(null)} />
            <div className="mt-4 flex justify-center">
              <button 
                onClick={handleUpload} 
                className={cn(
                  "px-6 py-2 rounded-lg font-medium transition-all",
                  isDark 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                Analyser le ticket
              </button>
            </div>
          </div>
        )}
        
        {uploading && <p className="text-center text-sm text-muted-foreground mt-4">Analyse en cours...</p>}
      </div>
    </div>
  );
};
