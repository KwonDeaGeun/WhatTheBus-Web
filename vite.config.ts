import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// biome-ignore lint/style/useNodejsImportProtocol: path module is required for Vite alias configuration
import path from "path"; // 추가!
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // 이 부분 추가!
        },
    },
});
