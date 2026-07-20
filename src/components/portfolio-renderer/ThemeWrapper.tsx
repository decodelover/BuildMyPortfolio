import React from "react";
import { ThemeCSSVariables } from "@/lib/rendering-engine/types";
import { ThemeRenderer } from "@/lib/rendering-engine/renderers/theme-renderer";

export interface ThemeWrapperProps {
  cssVariables: ThemeCSSVariables;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export function ThemeWrapper({ cssVariables, isDarkMode = false, children }: ThemeWrapperProps) {
  const styleObj = ThemeRenderer.toStyleObject(cssVariables);

  return (
    <div
      style={styleObj as React.CSSProperties}
      className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {children}
    </div>
  );
}
