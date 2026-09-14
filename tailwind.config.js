/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sampled directly from public/logo.svg
        navy: {
          DEFAULT: "#031E3B",
          950: "#01090F",
          900: "#02111F",
          800: "#031E3B",
          700: "#062B54",
          600: "#0A3C70",
          500: "#0F4F90"
        },
        green: {
          DEFAULT: "#65AF02",
          light: "#8BD91A",
          dark: "#4A8001",
          glow: "#A6F03A"
        },
        mist: {
          DEFAULT: "#C7D6E4",
          dim: "#8399AF",
          faint: "#4C637C"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Tajawal", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(101,175,2,.35), 0 8px 30px -6px rgba(101,175,2,.45)",
        "glow-lg": "0 0 0 1px rgba(101,175,2,.5), 0 18px 60px -10px rgba(101,175,2,.6)",
        lift: "0 24px 60px -20px rgba(0,0,0,.85)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(101,175,2,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(101,175,2,.07) 1px, transparent 1px)"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        },
        pulseRing: {
          "0%": { transform: "scale(.85)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sweep: "sweep 2.6s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.4s ease-out infinite",
        marquee: "marquee 40s linear infinite"
      }
    }
  },
  plugins: []
};
