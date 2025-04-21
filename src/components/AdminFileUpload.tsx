
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, X, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { uploadExcelFile } from "../api/fastApiService";

export const AdminFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expanded, setExpanded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType !== "application/vnd.ms-excel" &&
        fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        !selectedFile.name.endsWith('.xlsx') &&
        !selectedFile.name.endsWith('.xls')
      ) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier Excel (.xlsx, .xls)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setExpanded(true);
    }
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
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
      // Upload the file to the FastAPI backend
      const uploadResponse = await uploadExcelFile(file);
      
      if (uploadResponse.status === 'success') {
        toast({
          title: "Téléchargement réussi",
          description: uploadResponse.message || `Le fichier ${file.name} a été importé avec succès dans la base de données.`,
        });
      } else {
        toast({
          title: "Erreur lors du téléchargement",
          description: uploadResponse.message || "Une erreur est survenue lors du téléchargement du fichier.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setFile(null);
      setExpanded(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
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
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={cn(
              "p-3 rounded-full",
              isDragActive 
                ? isDark
                  ? "bg-blue-900/50"
                  : "bg-blue-100"
                : isDark
                  ? "bg-gray-800"
                  : "bg-gray-100"
            )}>
              <Upload 
                size={32} 
                className={cn(
                  isDragActive
                    ? "text-blue-400"
                    : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                )} 
              />
            </div>
            <div>
              <h3 className={cn(
                "text-xl font-medium",
                isDark ? "text-white" : "text-gray-800"
              )}>
                {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez votre fichier Excel"}
              </h3>
              <p className={cn(
                "text-sm mt-2",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                Format supporté: XLSX
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline"
              className={cn(
                "mt-2",
                isDark
                  ? "border-blue-700 text-blue-400 hover:bg-blue-900/30"
                  : "border-blue-200 text-blue-600"
              )}
            >
              Parcourir les fichiers
            </Button>
          </div>
        </div>
      ) : (
        <div className={cn(
          "border rounded-xl",
          isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"
        )}>
          <div 
            className={cn(
              "p-4 flex items-center justify-between cursor-pointer",
              isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
            )}
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-blue-900/50" : "bg-blue-100"
              )}>
                <FileSpreadsheet size={22} className={isDark ? "text-blue-400" : "text-blue-600"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isDark ? "text-white" : "text-gray-800"
                )} title={file.name}>
                  {file.name}
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
          
          {expanded && (
            <div className="p-4 pt-0 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                  Ce fichier sera importé dans la base de données tickets
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeFile}
                  disabled={uploading}
                  className={cn(
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500"
                  )}
                >
                  <X size={18} />
                </Button>
              </div>
              
              {uploading ? (
                <div className="py-6 flex flex-col items-center space-y-3">
                  <div className="animate-spin text-blue-500">
                    <Loader className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Traitement en cours...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Analyse et stockage des tickets dans la base de données
                    </p>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={uploadFile} 
                  className={cn(
                    "w-full mt-2",
                    isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  <Upload size={18} className="mr-2" />
                  Importer dans la base de données
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
