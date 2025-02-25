
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
          viewBox="0 0 512 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M400 64H100L150 32H450L400 64Z"
            fill="#C8102E"
            className="animate-pulse"
          />
          <path
            d="M380 80H80L130 48H430L380 80Z"
            fill="#C8102E"
            opacity="0.9"
            className="animate-pulse"
          />
          <path
            d="M360 96H60L110 64H410L360 96Z"
            fill="#C8102E"
            opacity="0.8"
            className="animate-pulse"
          />
          <path
            d="M340 112H40L90 80H390L340 112Z"
            fill="#C8102E"
            opacity="0.7"
            className="animate-pulse"
          />
          <path
            d="M90 80L130 48H150L110 80H90Z"
            fill="#333333"
          />
          <path
            d="M110 64L150 32H170L130 64H110Z"
            fill="#333333"
          />
          <path
            d="M130 48L170 16H190L150 48H130Z"
            fill="#333333"
          />
          <path 
            d="M150 32L190 0H210L170 32H150Z" 
            fill="#333333"
          />
        </svg>
      ) : (
        <>
          <svg
            className="h-full w-auto"
            viewBox="0 0 512 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M400 64H100L150 32H450L400 64Z"
              fill="#C8102E"
              className="animate-pulse"
            />
            <path
              d="M380 80H80L130 48H430L380 80Z"
              fill="#C8102E"
              opacity="0.9"
              className="animate-pulse"
            />
            <path
              d="M360 96H60L110 64H410L360 96Z"
              fill="#C8102E"
              opacity="0.8"
              className="animate-pulse"
            />
            <path
              d="M340 112H40L90 80H390L340 112Z"
              fill="#C8102E"
              opacity="0.7"
              className="animate-pulse"
            />
            <path
              d="M90 80L130 48H150L110 80H90Z"
              fill="#333333"
            />
            <path
              d="M110 64L150 32H170L130 64H110Z"
              fill="#333333"
            />
            <path
              d="M130 48L170 16H190L150 48H130Z"
              fill="#333333"
            />
            <path 
              d="M150 32L190 0H210L170 32H150Z" 
              fill="#333333"
            />
          </svg>
          {variant !== "mobile" && (
            <span className="text-2xl tracking-tight text-secondary">TowTrace</span>
          )}
        </>
      )}
    </div>
  )
}
