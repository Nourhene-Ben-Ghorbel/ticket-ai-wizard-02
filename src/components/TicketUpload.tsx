
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileCode2, Upload, X, FileSpreadsheet, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchSimilarTickets } from "../api/fastApiService";

export const TicketUpload = ({ onFileUploaded }: { onFileUploaded: (text: string) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      // Check if file is Excel or CSV
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
      
      setFile(selectedFile);
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
    setProgress(0);
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Simulate file reading for content extraction
      const fileContent = await readFileAsText(file);
      
      // Set progress to simulate file reading completion
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // Search for similar tickets using the file content
      const searchResult = await searchSimilarTickets(fileContent);
      
      // Complete the progress bar
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // Process the search result
      if (searchResult.status === 'success' && searchResult.tickets && searchResult.tickets.length > 0) {
        // Found similar tickets - display the best solution
        const bestMatch = searchResult.tickets[0];
        const responseMessage = `
          J'ai trouvé une solution pour votre ticket! 
          
          **Problème identifié:** ${bestMatch.problem}
          
          **Solution:** ${bestMatch.solution}
          
          *Score de similarité: ${(bestMatch.similarity_score * 100).toFixed(1)}%*
        `;
        
        toast({
          title: "Solution trouvée",
          description: `Une solution a été trouvée avec un score de similarité de ${(bestMatch.similarity_score * 100).toFixed(1)}%`,
        });
        
        onFileUploaded(responseMessage);
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
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Upload 
                size={36} 
                className={isDragActive ? 'text-blue-600' : 'text-gray-400'} 
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez votre fichier"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Formats supportés: XLSX, XLS, CSV
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline"
              className="mt-2 border-blue-400 text-blue-600"
            >
              Parcourir les fichiers
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet size={24} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-800" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              disabled={uploading}
              className="text-gray-500"
            >
              <X size={18} />
            </Button>
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-gray-500">
                {progress < 50 ? `Analyse du fichier ${progress}%...` : `Recherche de solutions ${progress}%...`}
              </p>
            </div>
          ) : (
            <Button 
              onClick={uploadFile} 
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileCode2 size={18} className="mr-2" />
              Analyser avec l'IA
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
