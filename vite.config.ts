import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const ReactCompilerConfig = {};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    } as Parameters<typeof react>[0]),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
