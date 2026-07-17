import type { ConfigEnv, PluginOption } from 'vite'

import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import { vitePluginFakeServer } from 'vite-plugin-fake-server'
import Inspect from 'vite-plugin-inspect'
import Progress from 'vite-plugin-progress'

import Build from './vite.config.build'
import Components from './vite.config.components'
import Css from './vite.config.css'
import Macros from './vite.config.macros'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode, command }: ConfigEnv) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    console.log(`当前编译环境: ${process.env.VITE_APP_ENV} | ${command}`)

    const isPreRelease = process.env.VITE_APP_ENV === 'pre-release'
    const fakeDir = path.join(process.cwd(), 'fake')
    const enableFakeServer = existsSync(fakeDir)

    const plugins: PluginOption[] = [...Macros(), ...Components(), UnoCSS()]

    /**
     * 本地和生产模拟服务（仅在 fake/ 目录存在时启用）
     * @see https://github.com/condorheroblog/vite-plugin-fake-server
     */
    if (enableFakeServer) {
        plugins.push(
            await vitePluginFakeServer({
                enableProd: isPreRelease,
                logger: true,
                headers: { '---------': '----------' },
            }),
        )
    }

    plugins.push(
        /**
         * 打包时展示进度条的插件
         * @see https://github.com/jeddygong/vite-plugin-progress/blob/main/README.zh-CN.md
         */
        Progress(),
        /**
         * 检查Vite插件的中间状态
         * @see https://github.com/antfu/vite-plugin-inspect#readme
         */
        Inspect(),
    )

    return {
        base: './',
        server: Build.server,
        build: {
            ...Build.build,
            // Vite 8 Rolldown 会摇掉 enableProd 注入的 html-proxy 副作用模块
            ...(isPreRelease ? { rolldownOptions: { treeshake: false } } : {}),
        },
        css: Css,
        plugins,
        resolve: {
            alias: {
                '~': path.join(__dirname, './src'),
                '@': path.join(__dirname, './src'),
            },
        },
    }
})
