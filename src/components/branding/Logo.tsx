
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
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 font-display font-bold text-primary",
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      {variant === "icon" ? (
        <svg
          className="h-full w-auto"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            className="fill-primary"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            className="fill-primary"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            className="fill-primary"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <>
          <svg
            className="h-full w-auto"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              className="fill-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              className="fill-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              className="fill-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {variant !== "mobile" && (
            <span className="text-2xl tracking-tight">TowTrace</span>
          )}
        </>
      )}
    </div>
  )
}
