import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


const REACT_VITE_PORT = typeof process !== 'undefined' ? process.env.REACT_VITE_PORT : 5174;

export default defineConfig({
  plugins: [react()],
  server: {
    port: REACT_VITE_PORT as number,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
