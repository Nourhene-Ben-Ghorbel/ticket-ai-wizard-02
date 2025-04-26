
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const powerBIEmbedUrl = "https://app.powerbi.com/view?r=eyJrIjoiZGZkYmM4MzUtZmM0YS00MzcwLTliOWMtMzAxYzY3Yzk5ZmZiIiwidCI6IjBmOGQxYjllLTUwMDMtNDBiNS05MmEyLWUzYTIxOWM5MzYxMCIsImMiOjF9";

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isDark ? "text-white bg-[#0a1535]" : "bg-white text-gray-800"
    )}>
      {isDark && <StarfieldBackground />}
      {isDark && <CosmicElements />}
      <Navbar />
      
      <main className="container mx-auto pt-12 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <h1 className={cn(
              "text-xl md:text-2xl font-bold text-gradient flex-grow",
              isDark ? "text-white" : "text-gray-800"
            )}>
              Dashboard administrateur
            </h1>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <p className={cn(
                "text-sm",
                isDark ? "text-blue-200/90" : "text-blue-700/90"
              )}>
                Consultez les statistiques et analyses de performances sur les tickets traités.
              </p>
            </div>
          </div>
          
          <Card className={cn(
            "mb-6 p-4 relative overflow-hidden",
            isDark ? "bg-card/70 border-white/10" : "bg-white border-gray-200"
          )}>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
                  <p className={isDark ? "text-blue-200" : "text-blue-700"}>Chargement du dashboard...</p>
                </div>
              </div>
            )}
            
            <div className={cn("w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden", !iframeLoaded ? "opacity-30" : "")}>
              <iframe 
                title="PowerBI Dashboard" 
                width="100%" 
                height="100%" 
                src={powerBIEmbedUrl}
                frameBorder="0" 
                allowFullScreen={true}
                onLoad={() => setIframeLoaded(true)}
              ></iframe>
            </div>
          </Card>
          
          <p className={cn(
            "text-sm text-center",
            isDark ? "text-blue-200/60" : "text-blue-700/60"
          )}>
            Dashboard alimenté par PowerBI. Les données sont mises à jour automatiquement.
          </p>
        </div>
      </main>
      
      {isDark && (
        <>
          <GlowingOrb className="fixed top-1/4 left-1/5 -z-10" size={250} color="rgba(79, 70, 229, 0.08)" />
          <GlowingOrb className="fixed bottom-1/4 right-1/5 -z-10" size={300} color="rgba(124, 58, 237, 0.06)" />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
