import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      animation: {
        gradient: "gradient 8s ease-in-out infinite", // Smooth gradient animation
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" }, // Start
          "50%": { backgroundPosition: "100% 50%" }, // End of forward cycle
          "100%": { backgroundPosition: "0% 50%" }, // Reverse back to start
        },
      },
      backgroundSize: {
        gradient: "200% 200%", // Extend background size for smoother effect
      },
      colors: {
        pinkTrans: "#FF6F91", // Brighter, bolder pink
        blueTrans: "#5BCEFA", // Vibrant blue
        whiteTrans: "#FFFFFF", // Pure white
      },
      fontFamily: {
        sans: ["Inter", 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
