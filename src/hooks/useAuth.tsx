
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // For demo purposes, we're using localStorage
  // In a real app, you'd connect to your Django backend
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This would be an API call to your Django backend
      // const response = await fetch("YOUR_API_URL/login", {...})
      
      // Simulating a successful login for demonstration
      const mockUser = {
        id: "1",
        username: email.split('@')[0],
        email,
        isAdmin: email.includes('admin'),
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur l'IA Ticket Wizard",
      });
      
      navigate(mockUser.isAdmin ? "/admin" : "/dashboard");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      // This would be an API call to your Django backend
      // const response = await fetch("YOUR_API_URL/signup", {...})
      
      // Simulating a successful signup for demonstration
      const mockUser = {
        id: "1",
        username,
        email,
        isAdmin: false,
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de créer votre compte",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
