
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignupFormValues } from "../lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

const Signup = () => {
  const { signup, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: SignupFormValues) => {
    await signup(values.username, values.email, values.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4 font-[Poppins]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-blue-100 relative">
        <div className="absolute top-4 left-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            <span>Retour</span>
          </Button>
        </div>
        
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <MessageCircle size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h1>
          <p className="text-gray-600">
            Rejoignez notre plateforme d'IA
          </p>
        </div>
        <AuthForm type="signup" onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default Signup;
