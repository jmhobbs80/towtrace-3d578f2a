
import React from "react"
import { cn } from "@/lib/utils"

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent"
}

export function GradientBackground({ 
  variant = "primary",
  className,
  children,
  ...props 
}: GradientBackgroundProps) {
  const gradients = {
    primary: "bg-gradient-to-br from-primary/90 to-primary",
    secondary: "bg-gradient-to-br from-secondary/90 to-secondary",
    accent: "bg-gradient-to-br from-accent/90 to-accent"
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        gradients[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="relative">{children}</div>
    </div>
  )
}
