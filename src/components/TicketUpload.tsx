
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileCode2, Upload, X, FileSpreadsheet, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchSimilarTickets, validateExcelFormat } from "../api/fastApiService";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export const TicketUpload = ({ onFileUploaded }: { onFileUploaded: (text: string, ticketIds?: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const { addToHistory } = useSearchHistory();
  const isDark = theme === "dark";

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      // Vérifier le format du fichier
      const fileType = selectedFile.type;
      if (
        fileType !== "application/vnd.ms-excel" &&
        fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        fileType !== "text/csv" &&
        !selectedFile.name.endsWith('.xlsx') &&
        !selectedFile.name.endsWith('.xls') &&
        !selectedFile.name.endsWith('.csv')
      ) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier Excel (.xlsx, .xls) ou CSV",
          variant: "destructive",
        });
        return;
      }
      
      // Valider le format du contenu (en-tête + 1 ligne)
      try {
        const validationResult = await validateExcelFormat(selectedFile);
        if (!validationResult.isValid) {
          toast({
            title: "Format incorrect",
            description: validationResult.message || "Le fichier doit contenir un en-tête et une seule ligne de données",
            variant: "destructive",
          });
          return;
        }
        
        setFile(selectedFile);
        setExpanded(true);
      } catch (error) {
        toast({
          title: "Erreur de validation",
          description: "Impossible de valider le format du fichier",
          variant: "destructive",
        });
      }
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
    
    try {
      // Simulation file reading for content extraction
      const fileContent = await readFileAsText(file);
      
      // Search for similar tickets using the file content
      const searchResult = await searchSimilarTickets(fileContent);
      
      // Process the search result
      if (searchResult.status === 'success' && searchResult.tickets && searchResult.tickets.length > 0) {
        // Found similar tickets - display the best solution
        const bestMatch = searchResult.tickets[0];
        const ticketIds = searchResult.tickets.map(t => t.ticket_id);
        
        // Construire un message avec tous les IDs de tickets similaires
        const ticketIdList = searchResult.tickets
          .map(t => `- ID: ${t.ticket_id} (score: ${(t.similarity_score * 100).toFixed(1)}%)`)
          .join('\n');
        
        const responseMessage = `
          J'ai trouvé une solution pour votre ticket! 
          
          **Problème identifié:** ${bestMatch.problem}
          
          **Solution:** ${bestMatch.solution}
          
          *Temps de recherche: ${searchResult.temps_recherche?.toFixed(2)}s*
        `;
        
        toast({
          title: "Solution trouvée",
          description: `Une solution a été trouvée avec un score de similarité de ${(bestMatch.similarity_score * 100).toFixed(1)}%`,
        });
        
        // Ajouter à l'historique de recherche
        addToHistory({
          queryText: file.name,
          result: responseMessage,
          ticketIds: ticketIds
        });
        
        onFileUploaded(responseMessage, ticketIds);
      } else if (searchResult.status === 'not_found') {
        // No similar tickets found
        const noMatchMessage = `
          Je n'ai pas trouvé de ticket similaire dans notre base de données.
          
          Veuillez soumettre ce ticket à notre équipe support pour une résolution manuelle.
        `;
        
        toast({
          title: "Aucune correspondance",
          description: "Aucun ticket similaire n'a été trouvé dans notre base de données.",
        });
        
        // Ajouter à l'historique de recherche
        addToHistory({
          queryText: file.name,
          result: noMatchMessage
        });
        
        onFileUploaded(noMatchMessage);
      } else {
        // Error in search
        toast({
          title: "Erreur de recherche",
          description: searchResult.message || "Une erreur est survenue lors de la recherche.",
          variant: "destructive",
        });
        
        onFileUploaded("Une erreur est survenue lors de l'analyse de votre ticket. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du fichier.",
        variant: "destructive",
      });
      
      onFileUploaded("Une erreur est survenue lors de l'analyse de votre ticket. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  };
  
  // Helper function to read file content as text
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
    <div className="w-full max-w-lg mx-auto">
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-4 text-center transition-colors",
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
        <div className={cn(
          "border rounded-xl",
          isDark ? "bg-card/30 border-gray-800" : "bg-white border-gray-200"
        )}>
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
          </div>
          
          {expanded && (
            <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  Ce fichier sera analysé pour trouver des tickets similaires
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeFile}
                  disabled={uploading}
                  className="text-gray-500 h-7"
                >
                  <X size={14} />
                </Button>
              </div>
              
              {uploading ? (
                <div className="py-4 flex flex-col items-center space-y-2">
                  <div className="animate-spin text-blue-500">
                    <Loader className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium">Analyse en cours...</p>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={uploadFile} 
                  className={cn(
                    "w-full",
                    isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
                  )}
                  size="sm"
                >
                  <FileCode2 size={14} className="mr-2" />
                  Analyser
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
