
import type { Config } from "tailwindcss";

export default {
  darkMode: "media", // Automatic dark mode detection (use "class" if manual toggle is preferred)
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
        "3xl": "1600px", // Added ultra-wide screen support
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"], // Added Roboto as a fallback
        display: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
        mono: ["Courier New", "monospace"], // Added mono font for code blocks
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background, 0 0% 98%))", // Light mode background
        foreground: "hsl(var(--foreground, 0 0% 20%))", // Dark mode foreground
        primary: {
          DEFAULT: "hsl(var(--primary, 0 84% 40%))", // TowTrace Red
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 0 0% 20%))", // Dark Gray
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 40%))", // Using brand red for destructive actions
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 0 0% 40%))",
          foreground: "hsl(var(--muted-foreground, 0 0% 98%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 0 84% 40%))",
          hover: "hsl(var(--accent-hover, 0 84% 30%))",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 98%))",
          foreground: "hsl(var(--foreground, 0 0% 20%))",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#333333",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeOut: "fadeOut 0.3s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        scaleUp: "scaleUp 0.2s ease-out",
      },
      screens: {
        xs: "320px", // Adjusted for better small device support
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1600px", // Added ultra-wide screen support
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"), // Improved form styling
    require("@tailwindcss/aspect-ratio"), // Responsive images
  ],
} satisfies Config;
