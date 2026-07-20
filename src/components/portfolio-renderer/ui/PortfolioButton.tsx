import React from "react";

export interface PortfolioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function PortfolioButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: PortfolioButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-7 py-3 text-base rounded-xl"
  }[size];

  const variantClasses = {
    primary: "bg-primary text-white hover:opacity-90 shadow-md shadow-primary/20",
    secondary: "bg-secondary text-white hover:opacity-90",
    outline: "border border-border bg-card/50 text-foreground hover:bg-card",
    ghost: "text-foreground hover:bg-primary/10"
  }[variant];

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
