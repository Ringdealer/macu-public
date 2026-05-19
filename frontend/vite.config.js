import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    visualizer({ open: true }), // LAZY-LOAD UPDATE
  ],

  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Manual chunking for vendor splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],                     // LAZY-LOAD UPDATE
          'icons-vendor': ['react-icons/hi', 'react-icons/ai'],       // LAZY-LOAD UPDATE
          'utils-vendor': ['lodash.merge', 'axios'],                  // LAZY-LOAD UPDATE
        },
      },
    },
  },
});