
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/20": variant === "default",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            "border border-indigo-400/30 bg-transparent text-white hover:bg-indigo-900/30": variant === "outline",
            "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50": variant === "secondary",
            "text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30": variant === "ghost",
            "text-indigo-400 underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 rounded-md text-sm": size === "sm",
            "h-11 px-8 rounded-md": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

// Export buttonVariants for use in other components
export const buttonVariants = (props?: Partial<ButtonProps>) => {
  const { variant = "default", size = "default" } = props || {}
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
      "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/20": variant === "default",
      "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
      "border border-indigo-400/30 bg-transparent text-white hover:bg-indigo-900/30": variant === "outline",
      "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50": variant === "secondary",
      "text-blue-200/80 hover:text-indigo-300 hover:bg-indigo-900/30": variant === "ghost",
      "text-indigo-400 underline-offset-4 hover:underline": variant === "link",
    },
    {
      "h-10 py-2 px-4": size === "default",
      "h-9 px-3 rounded-md text-sm": size === "sm",
      "h-11 px-8 rounded-md": size === "lg",
      "h-10 w-10": size === "icon",
    }
  )
}
