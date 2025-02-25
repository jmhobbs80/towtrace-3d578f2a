
import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "mobile" | "icon"
  size?: "sm" | "md" | "lg"
}

export function Logo({ 
  variant = "default", 
  size = "md", 
  className,
  ...props 
}: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  }

  if (variant === "icon") {
    return (
      <div 
        className={cn(
          "font-display font-bold text-primary",
          sizeClasses[size],
          className
        )} 
        {...props}
      >
        TT
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "font-display font-bold text-primary tracking-tight",
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      {variant !== "mobile" ? "TowTrace" : "TT"}
    </div>
  )
}
