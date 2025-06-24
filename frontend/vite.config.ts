import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@avatars": path.resolve(__dirname, "src/assets/avatars"),
      "@models": path.resolve(__dirname, "src/models"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@mocks": path.resolve(__dirname, "src/mocks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@services": path.resolve(__dirname, "src/services"),
    },
  },
});
