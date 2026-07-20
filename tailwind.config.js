/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        "primary-hover": "#6D28D9",

        secondary: "#A78BFA",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        sidebar: "#6D28D9",
        "sidebar-hover": "#7C3AED",

        border: "#E5E7EB",

        text: {
          DEFAULT: "#111827",
          muted: "#6B7280",
        },

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        input: "#F9FAFB",
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "24px",
      },

      boxShadow: {
        card: "0 8px 24px rgba(15,23,42,.08)",
        sidebar: "4px 0 20px rgba(0,0,0,.08)",
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(180deg,#7C3AED 0%,#6D28D9 100%)",

        "page-gradient":
          "linear-gradient(180deg,#FFFFFF 0%,#F5F3FF 100%)",
      },

      transitionDuration: {
        250: "250ms",
      },
    },
  },

  plugins: [
  require("@tailwindcss/forms"),
]
};