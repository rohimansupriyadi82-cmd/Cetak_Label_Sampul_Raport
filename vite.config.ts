import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Tambahan baris base di bawah ini agar file aset Anda terbaca dengan benar di GitHub Pages
  base: "/Cetak_Label_Sampul_Raport/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
