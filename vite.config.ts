import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/js-ts-practice-site/",
  plugins: [react()],
  worker: {
    format: "es",
  },
});
