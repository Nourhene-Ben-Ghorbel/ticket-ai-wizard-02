
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
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
          isActive 
            ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50" 
            : "hover:bg-indigo-900/30 text-blue-200/80 hover:text-indigo-300"
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
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-neon relative">
                <MessageCircle size={20} className="text-white" />
                <div className="absolute inset-0 rounded-full bg-indigo-600 blur-md opacity-50"></div>
                <Star className="absolute -top-1 -right-1 text-yellow-300 animate-twinkle" size={12} />
              </div>
              <span className="text-xl font-bold text-gradient">Ticket AI Wizard</span>
            </Link>
          </motion.div>

          {/* Desktop navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            {isAuthenticated && (
              <>
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} className="text-indigo-300" />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} className="text-indigo-300" />}>
                    Statistiques
                  </NavLink>
                )}
                
                <div className="flex items-center px-3 py-1.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 space-x-2">
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30"
                >
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button className="cosmic-button">
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </div>
            )}
          </motion.nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className="text-indigo-300 hover:bg-indigo-900/30"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isOpen && (
        <motion.div 
          className="md:hidden cosmic-card m-2 p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <nav className="flex flex-col space-y-3">
            {isAuthenticated && (
              <>
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} className="text-indigo-300" />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} className="text-indigo-300" />}>
                    Statistiques
                  </NavLink>
                )}
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 w-fit">
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center justify-start gap-2 text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30"
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
                <Button variant="ghost" className="w-full text-blue-200/80 hover:text-indigo-300 justify-start">
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button className="w-full cosmic-button">
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
