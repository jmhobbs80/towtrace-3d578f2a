
import React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  align?: "left" | "center"
}

export function SectionHeader({ 
  title, 
  description, 
  align = "left",
  className,
  ...props 
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-display font-bold tracking-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
