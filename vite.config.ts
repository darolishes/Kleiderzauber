import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@features/*": path.resolve(__dirname, "./src/components/*"),
      "@utils/*": path.resolve(__dirname, "./src/utils/*"),
      "@hooks/*": path.resolve(__dirname, "./src/hooks/*"),
      "@store/*": path.resolve(__dirname, "./src/store/*"),
      "@types/*": path.resolve(__dirname, "./src/types/*"),
      "@pages/*": path.resolve(__dirname, "./src/pages/*"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
