
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { LoginFormValues, SignupFormValues } from "@/lib/auth-schemas";
import { ParticleBackground } from "./ParticleBackground";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

export const AuthForm = ({ type, onSubmit, isLoading }: AuthFormProps) => {
  return (
    <>
      {type === "login" ? (
        <LoginForm 
          onSubmit={onSubmit as (values: LoginFormValues) => void} 
          isLoading={isLoading} 
        />
      ) : (
        <SignupForm 
          onSubmit={onSubmit as (values: SignupFormValues) => void} 
          isLoading={isLoading} 
        />
      )}
    </>
  );
};
