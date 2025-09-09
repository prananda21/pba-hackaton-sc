import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(185 15% 87%)",
        input: "hsl(185 15% 87%)",
        ring: "hsl(200 98% 39%)",
        background: "hsl(210 17% 98%)",
        foreground: "hsl(215 25% 27%)",
        primary: {
          DEFAULT: "hsl(200 98% 39%)",
          foreground: "hsl( 0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(185 10% 95%))",
          foreground: "hsl(215 25% 27%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(185 10% 95%)",
          foreground: "hsl(215 13% 52%)",
        },
        accent: {
          DEFAULT: "hsl(180 100% 97%)",
          foreground: "hsl(200 98% 39%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(215 25% 27%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(215 25% 27%)",
        },
        medical: {
          success: "hsl(142 76% 36%)",
          warning: "hsl(38 92% 50%)",
          info: "hsl(200 98% 39%)",
          critical: "hsl(0 84% 60%)",
        },
        sidebar: {
          DEFAULT: "hsl( 0 0% 98%)",
          foreground: "hsl(240 5.3% 26.1%)",
          primary: "hsl(240 5.9% 10%)",
          "primary-foreground": "hsl(0 0% 98%)",
          accent: "hsl(240 4.8% 95.9%)",
          "accent-foreground": "hsl(240 5.9% 10%)",
          border: "hsl(220 13% 91%)",
          ring: "hsl(217.2 91.2% 59.8%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
