/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#9EAD91",
          light: "#B8C5AD",
          dark: "#7A8A6D",
        },
        mutedBlue: {
          DEFAULT: "#8FAEAE",
          light: "#ADC6C6",
          dark: "#6F8E8E",
        },
        olive: {
          DEFAULT: "#777D4B",
          light: "#8F965E",
          dark: "#5A5F35",
        },
        warmCream: {
          DEFAULT: "#F0EBD6",
          light: "#F7F4E7",
          dark: "#DED6BA",
        },
        softWhite: "#F9F8F1",
        textDark: "#333A2C",
        textMuted: "#66705D",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.05)",
        "glass-lg": "0 12px 40px 0 rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
