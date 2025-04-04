
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
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

  return <AuthForm type="signup" onSubmit={handleSubmit} isLoading={loading} />;
};

export default Signup;
