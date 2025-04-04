
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Home,
  BarChart3,
  LogOut,
  Menu,
  X,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ href, children, icon }: { href: string, children: React.ReactNode, icon: React.ReactNode }) => {
    const isActive = location.pathname === href;
    
    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isActive 
            ? "bg-darkblue-800 text-white" 
            : "hover:bg-darkblue-800/50 text-gray-300 hover:text-white"
        )}
        onClick={() => setIsOpen(false)}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-darkblue-900/80 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <MessageCircle size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Ticket AI Wizard</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} />}>
                    Statistiques
                  </NavLink>
                )}
                
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-darkblue-800/50"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </Button>
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-darkblue-800 text-white">
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden bg-darkblue-900/95 backdrop-blur-md shadow-lg p-4">
          <nav className="flex flex-col space-y-3">
            {isAuthenticated && (
              <>
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} />}>
                    Statistiques
                  </NavLink>
                )}
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-darkblue-800 text-white w-fit">
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start gap-2 text-gray-300 hover:text-white hover:bg-darkblue-800/50"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
