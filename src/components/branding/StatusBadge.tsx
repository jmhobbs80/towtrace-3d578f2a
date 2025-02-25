
import React from "react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "active" | "pending" | "completed" | "error"
}

export function StatusBadge({ 
  status, 
  className,
  ...props 
}: StatusBadgeProps) {
  const statusClasses = {
    active: "bg-accent text-accent-foreground",
    pending: "bg-warning text-warning-foreground",
    completed: "bg-primary text-primary-foreground",
    error: "bg-destructive text-destructive-foreground"
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        statusClasses[status],
        className
      )}
      {...props}
    />
  )
}
