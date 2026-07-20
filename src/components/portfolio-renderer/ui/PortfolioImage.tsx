import React from "react";

export interface PortfolioImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export function PortfolioImage({ src, alt = "Portfolio Image", fallbackText, className = "", ...props }: PortfolioImageProps) {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    const initials = fallbackText ? fallbackText.substring(0, 2).toUpperCase() : "IMG";
    return (
      <div className={`flex items-center justify-center bg-primary/10 text-primary font-bold text-sm border border-primary/20 ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`object-cover transition-opacity duration-300 ${className}`}
      {...props}
    />
  );
}
