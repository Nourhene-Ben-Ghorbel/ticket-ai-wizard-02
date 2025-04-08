
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "./ui/form";
import { Control } from "react-hook-form";

interface PasswordInputProps {
  control?: Control<any>;
  name: string;
  label: string;
  className?: string;
  // Ajoutés pour résoudre l'erreur TypeScript
  labelClass?: string;
  inputClass?: string;
}

export const PasswordInput = ({ control, name, label, labelClass, inputClass, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { error } = useFormField();

  return (
    <FormItem>
      <FormLabel className={labelClass}>{label}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            type={showPassword ? "text" : "password"}
            className={`pr-10 ${inputClass || "bg-white/10 border-white/20"}`}
            {...props}
          />
        </FormControl>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
      <FormMessage />
    </FormItem>
  );
};
