
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { WaveAnimation } from "./WaveAnimation";
import { ParticleBackground } from "./ParticleBackground";

// Schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

const signupSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

export const AuthForm = ({ type, onSubmit, isLoading }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(type === "login" ? loginSchema : signupSchema),
    defaultValues: type === "login" 
      ? { email: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gradient mb-2">
              {type === "login" ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="text-gray-300">
              {type === "login" 
                ? "Connectez-vous pour accéder à votre espace"
                : "Inscrivez-vous pour commencer à utiliser Ticket AI Wizard"}
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {type === "signup" && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Entrez votre nom d'utilisateur" 
                            {...field} 
                            className="bg-darkblue-800/50 border-darkblue-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="votre.email@exemple.com" 
                          {...field} 
                          className="bg-darkblue-800/50 border-darkblue-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            className="pr-10 bg-darkblue-800/50 border-darkblue-700"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {type === "signup" && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                              className="pr-10 bg-darkblue-800/50 border-darkblue-700"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-gradient hover:opacity-90" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Chargement...
                    </>
                  ) : type === "login" ? "Se connecter" : "S'inscrire"}
                </Button>
                
                <div className="text-center text-sm">
                  {type === "login" ? (
                    <p>
                      Pas encore de compte ?{" "}
                      <Link to="/signup" className="text-blue-400 hover:underline">
                        Créer un compte
                      </Link>
                    </p>
                  ) : (
                    <p>
                      Déjà un compte ?{" "}
                      <Link to="/login" className="text-blue-400 hover:underline">
                        Se connecter
                      </Link>
                    </p>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      <WaveAnimation />
    </div>
  );
};
