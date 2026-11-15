import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        stone2: "#707070",
        muted: "#999999",
        line: "#EAEAE7",
        paper: "#FFFFFF",
        mist: "#F7F7F5",
        coal: "#171717",
        bronze: "#A58A68",
        bronzedark: "#8A7154",
      },
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Fraunces Variable", "Georgia", "serif"],
      },
      maxWidth: { shell: "80rem" },
      boxShadow: {
        card: "0 1px 2px rgba(21,21,21,0.04), 0 8px 24px rgba(21,21,21,0.06)",
        lift: "0 2px 4px rgba(21,21,21,0.05), 0 16px 40px rgba(21,21,21,0.10)",
        pop: "0 24px 64px rgba(21,21,21,0.18)",
      },
      transitionTimingFunction: { ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
