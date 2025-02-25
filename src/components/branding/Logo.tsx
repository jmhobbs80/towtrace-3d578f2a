
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
        "flex items-center gap-2 font-display font-bold",
        sizeClasses[size],
        className
      )} 
      {...props}
    >
      {variant === "icon" ? (
        <svg
          className="h-full w-auto"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M600 200H200L300 100H700L600 200Z"
            fill="#ff0000"
            className="animate-pulse"
          />
          <path
            d="M500 300H100L200 200H600L500 300Z"
            fill="#ff0000"
            opacity="0.8"
            className="animate-pulse"
          />
          <path
            d="M400 400H0L100 300H500L400 400Z"
            fill="#ff0000"
            opacity="0.6"
            className="animate-pulse"
          />
          <path
            d="M700 100H300L400 0H800L700 100Z"
            fill="#ff0000"
            opacity="0.4"
            className="animate-pulse"
          />
          <path
            d="M600 200L700 100H800L700 200H600Z"
            fill="#4B5563"
          />
          <path
            d="M500 300L600 200H700L600 300H500Z"
            fill="#4B5563"
          />
          <path
            d="M400 400L500 300H600L500 400H400Z"
            fill="#4B5563"
          />
        </svg>
      ) : (
        <>
          <svg
            className="h-full w-auto"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M600 200H200L300 100H700L600 200Z"
              fill="#ff0000"
              className="animate-pulse"
            />
            <path
              d="M500 300H100L200 200H600L500 300Z"
              fill="#ff0000"
              opacity="0.8"
              className="animate-pulse"
            />
            <path
              d="M400 400H0L100 300H500L400 400Z"
              fill="#ff0000"
              opacity="0.6"
              className="animate-pulse"
            />
            <path
              d="M700 100H300L400 0H800L700 100Z"
              fill="#ff0000"
              opacity="0.4"
              className="animate-pulse"
            />
            <path
              d="M600 200L700 100H800L700 200H600Z"
              fill="#4B5563"
            />
            <path
              d="M500 300L600 200H700L600 300H500Z"
              fill="#4B5563"
            />
            <path
              d="M400 400L500 300H600L500 400H400Z"
              fill="#4B5563"
            />
          </svg>
          {variant !== "mobile" && (
            <span className="text-2xl tracking-tight">TowLogix</span>
          )}
        </>
      )}
    </div>
  )
}
