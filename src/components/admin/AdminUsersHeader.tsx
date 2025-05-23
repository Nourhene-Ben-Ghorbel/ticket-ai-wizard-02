
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export const AdminUsersHeader = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h1 className={cn(
          "text-2xl md:text-3xl font-bold text-gradient mb-2",
          isDark ? "text-white" : "text-gray-800"
        )}>
          Gestion des utilisateurs
        </h1>
        
        <p className={cn(
          "text-sm md:text-base",
          isDark ? "text-blue-200/90" : "text-blue-700/90"
        )}>
          Créez de nouveaux comptes utilisateurs pour accéder à l'application
        </p>
      </div>
      
      <Button
        onClick={() => navigate('/admin/manage-users')}
        className={cn(
          "cosmic-button",
          isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        Voir les utilisateurs existants
      </Button>
    </div>
  );
};
