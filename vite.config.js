// vite.config.js
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";

export default {
  server: {
    port: 8080,
    https: true,
  },

  build: {
    rollupOptions: {
      input: {
        mobile: resolve(__dirname, "MOBILE/index.html"),
        home: resolve(__dirname, "index.html"),
      },
    },
  },

  plugins: [basicSsl()],
};
