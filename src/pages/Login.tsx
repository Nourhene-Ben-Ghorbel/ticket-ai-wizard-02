
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(values.email, values.password);
  };

  return <AuthForm type="login" onSubmit={handleSubmit} isLoading={loading} />;
};

export default Login;
