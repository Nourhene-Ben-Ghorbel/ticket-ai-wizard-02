
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { PasswordInput } from "./PasswordInput";
import { signupSchema, SignupFormValues } from "../lib/auth-schemas";

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void;
  isLoading: boolean;
}

export const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  className="bg-white border-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  className="bg-white border-gray-200"
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
            <PasswordInput 
              control={form.control} 
              name="password" 
              label="Mot de passe" 
              {...field}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput 
              control={form.control} 
              name="confirmPassword" 
              label="Confirmer le mot de passe" 
              {...field}
            />
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : "S'inscrire"}
        </Button>
        
        <div className="text-center text-sm">
          <p>
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
