
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileCode2, Upload, X, FileSpreadsheet, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    
    // Simulate upload process with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    // Simulate processing data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, you'd send the file to your Django backend:
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('YOUR_API_URL/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // For demo, we'll just simulate a response
    const mockResponse = `Les données de votre fichier ${file.name} ont été traitées. Vous pouvez maintenant discuter avec notre IA.`;
    
    toast({
      title: "Téléchargement réussi",
      description: `Le fichier ${file.name} a été téléchargé et traité avec succès.`,
    });
    
    setUploading(false);
    onFileUploaded(mockResponse);
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragActive 
              ? "border-blue-500 bg-darkblue-800/50" 
              : "border-gray-600 hover:border-blue-500 hover:bg-darkblue-800/30"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-500/20' : 'bg-darkblue-800/50'}`}>
              <Upload 
                size={36} 
                className={isDragActive ? 'text-blue-400 animate-pulse' : 'text-gray-400'} 
              />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {isDragActive ? "Déposez votre fichier ici" : "Glissez-déposez votre fichier"}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Formats supportés: XLSX, XLS, CSV
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline"
              className="mt-2"
            >
              Parcourir les fichiers
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-darkblue-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <FileSpreadsheet size={24} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              disabled={uploading}
            >
              <X size={18} />
            </Button>
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-gray-400">
                {progress < 100 ? `Téléchargement ${progress}%...` : "Traitement des données..."}
              </p>
            </div>
          ) : (
            <Button 
              onClick={uploadFile} 
              className="w-full mt-2 bg-blue-gradient"
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
