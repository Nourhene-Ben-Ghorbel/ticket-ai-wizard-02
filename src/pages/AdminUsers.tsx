
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { Card } from "@/components/ui/card";
import { createUser } from "@/api/fastApiService";
import { AdminUsersHeader } from "@/components/admin/AdminUsersHeader";
import { AdminUsersInfo } from "@/components/admin/AdminUsersInfo";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { UserPlus } from "lucide-react";

const AdminUsers = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isDark ? "text-white bg-[#0a1535]" : "bg-white text-gray-800"
    )}>
      {isDark && <StarfieldBackground />}
      {isDark && <CosmicElements />}
      <Navbar />
      
      <main className="container mx-auto pt-16 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AdminUsersHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className={cn(
              "p-8 relative",
              isDark ? "bg-card/70 border-white/10" : "bg-white border-gray-200"
            )}>
              <div className="flex items-center mb-6">
                <div className={cn(
                  "p-2 rounded-lg mr-3",
                  isDark ? "bg-blue-900/50" : "bg-blue-100" 
                )}>
                  <UserPlus size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
                </div>
                <h2 className="text-xl font-medium">Ajouter un utilisateur</h2>
              </div>
              
              <CreateUserForm />
            </Card>
            
            <AdminUsersInfo />
          </div>
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

export default AdminUsers;
