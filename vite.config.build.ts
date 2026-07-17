import type { BuildOptions, ServerOptions } from 'vite'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: { server: ServerOptions, build: BuildOptions } = {
    server: {
        port: 8081,
        host: '0.0.0.0',
        open: true,
        proxy: {
            // 开发环境接口转发到本地后端（保留 /api 前缀）
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
        warmup: {
            clientFiles: ['./src/main.ts', './src/views/**/*.vue'],
        },
        hmr: {
            port: 8081,
        },
    },
    build: {
        target: 'es2018',
        cssTarget: 'chrome79',
        minify: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            external: /static\/.*?\.[cm]*js/,
            output: {
                manualChunks(id: string) {
                    // 处理css分块
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    if (id.includes('__uno.css')) {
                        return 'unocss'
                    }
                },
            },
        },
    },
}

export default config
