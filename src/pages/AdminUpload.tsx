
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { Button } from "@/components/ui/button";
import { AdminFileUpload } from "@/components/AdminFileUpload";

const AdminUpload = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isDark ? "text-white bg-[#0a1535]" : "bg-white text-gray-800"
    )}>
      {isDark && <StarfieldBackground />}
      {isDark && <CosmicElements />}
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <div>
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold text-gradient mb-2",
                isDark ? "text-white" : "text-gray-800"
              )}>
                Import de données
              </h1>
              
              <p className={cn(
                "text-lg",
                isDark ? "text-blue-200/90" : "text-blue-700/90"
              )}>
                Importez vos fichiers Excel pour alimenter la base de données
              </p>
            </div>
          </div>
          
          <Card className={cn(
            "mb-6 p-8 relative",
            isDark ? "bg-card/70 border-white/10" : "bg-white border-gray-200"
          )}>
            <AdminFileUpload />
          </Card>
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

export default AdminUpload;
