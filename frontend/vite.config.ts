import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/caremodelhub/",
  preview: {
    allowedHosts: ["cmh-frontend.onrender.com","pccork.github.io",],
  },
});