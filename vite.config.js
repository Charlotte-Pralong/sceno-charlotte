// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'
import { resolve } from 'path'


export default {

    server: {
        port: 443,
    },

    build: {
        rollupOptions: {
            input: {
                scene: resolve(__dirname, 'scene/index.html'),
                client: resolve(__dirname, 'index.html'),
            },
        },
    },

    plugins: [
        basicSsl()
    ]
}