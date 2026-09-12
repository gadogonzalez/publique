import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      // Full breakpoint scale, capped at 1280px from "xl" up (was only
      // overriding "2xl", so .container had NO max-width at all between
      // 0 and 1536px -- it spanned nearly the full viewport on every
      // common desktop width, which is why centered content inside it
      // looked arbitrarily off-center depending on exact window width.
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        whatsapp: "#25D366",
        card: "hsl(var(--card))",
        brand: {
          pink: "hsl(var(--brand-pink))",
          "pink-foreground": "hsl(var(--brand-pink-foreground))",
        },
        "accent-soft": "hsl(var(--accent-pink-soft))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Key kept as "serif" to avoid renaming font-serif across every
        // component -- it now loads a display grotesque, not a serif.
        serif: ["var(--font-serif)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
