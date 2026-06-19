import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Navy blue palette — replaces Chakra's bright royal blue
        blue: {
          50:  { value: "#f0f4fc" },
          100: { value: "#dce6f5" },
          200: { value: "#b3cced" },
          300: { value: "#7aa7de" },
          400: { value: "#4a83cb" },
          500: { value: "#2963b5" },
          600: { value: "#1b4c96" },
          700: { value: "#133878" },
          800: { value: "#0c255a" },
          900: { value: "#07143a" },
          950: { value: "#030a1f" },
        },
        // Matte gray — navy-tinted instead of neutral gray
        gray: {
          50:  { value: "#f4f6fb" },
          100: { value: "#e7edf6" },
          200: { value: "#cfd9ea" },
          300: { value: "#aabace" },
          400: { value: "#8197b3" },
          500: { value: "#5c7799" },
          600: { value: "#455c7d" },
          700: { value: "#324461" },
          800: { value: "#202d45" },
          900: { value: "#131a2d" },
          950: { value: "#080e1a" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
