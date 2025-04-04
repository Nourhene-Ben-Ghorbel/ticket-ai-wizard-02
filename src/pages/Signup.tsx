
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: { username: string; email: string; password: string }) => {
    await signup(values.username, values.email, values.password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Créer un compte</h1>
          <p className="text-gray-600 mt-2">
            Inscrivez-vous pour accéder à notre plateforme
          </p>
        </div>
        <AuthForm type="signup" onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default Signup;
