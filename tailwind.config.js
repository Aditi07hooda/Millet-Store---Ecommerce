/** @type {import('tailwindcss').Config} */
import { mtConfig } from "@material-tailwind/react";
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#8B4513', // Saddle Brown
        secondary: '#F5DEB3', // Wheat
        accent: '#228B22', // Forest Green
      },
    },
  },
  plugins: [mtConfig()],
};
