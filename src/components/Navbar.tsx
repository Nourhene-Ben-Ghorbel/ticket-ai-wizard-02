
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
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle";

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
            ? isDark 
              ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50"
              : "bg-blue-100 text-blue-700 border border-blue-200"
            : isDark
              ? "hover:bg-indigo-900/30 text-blue-200/80 hover:text-indigo-300" 
              : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
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
        scrolled 
          ? isDark 
            ? "bg-background/80 backdrop-blur-md" 
            : "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
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
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center relative",
                isDark ? "bg-indigo-600 shadow-neon" : "bg-blue-500 shadow-md"
              )}>
                <MessageCircle size={20} className="text-white" />
                {isDark && (
                  <div className="absolute inset-0 rounded-full bg-indigo-600 blur-md opacity-50"></div>
                )}
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
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} className={isDark ? "text-indigo-300" : "text-blue-600"} />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} className={isDark ? "text-indigo-300" : "text-blue-600"} />}>
                    Statistiques
                  </NavLink>
                )}
                
                <div className={cn(
                  "flex items-center px-3 py-1.5 rounded-full space-x-2",
                  isDark 
                    ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50" 
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                )}>
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex items-center gap-2",
                    isDark 
                      ? "text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30" 
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
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
                  className={cn(
                    isDark 
                      ? "text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30" 
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
                >
                  <Link to="/login">Se connecter</Link>
                </Button>
                <Button className="cosmic-button">
                  <Link to="/signup">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Theme toggle for desktop */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </motion.nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Theme toggle for mobile */}
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className={isDark ? "text-indigo-300 hover:bg-indigo-900/30" : "text-blue-600 hover:bg-blue-50"}
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
                <NavLink href={isAdmin ? "/admin" : "/dashboard"} icon={<Home size={18} className={isDark ? "text-indigo-300" : "text-blue-600"} />}>
                  {isAdmin ? "Tableau de bord" : "Accueil"}
                </NavLink>
                
                {isAdmin && (
                  <NavLink href="/admin/statistics" icon={<BarChart3 size={18} className={isDark ? "text-indigo-300" : "text-blue-600"} />}>
                    Statistiques
                  </NavLink>
                )}
                
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full w-fit",
                  isDark 
                    ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50" 
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                )}>
                  <UserCircle size={18} />
                  <span>{user?.username || "Utilisateur"}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  className={cn(
                    "flex items-center justify-start gap-2",
                    isDark 
                      ? "text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  )}
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
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start",
                    isDark
                      ? "text-blue-200/80 hover:text-indigo-300"
                      : "text-gray-600 hover:text-blue-700"
                  )}
                >
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
