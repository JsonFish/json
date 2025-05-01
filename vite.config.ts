import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 引入svg需要用到插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  let env = loadEnv(mode, process.cwd())
  console.log(command)
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      vueJsx({}), // jsx插件
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // 全局css
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
        },
      },
      // taiwindcss 配置
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    // 代理跨域
    server: {
      port: parseInt(env.VITE_PORT),
      proxy: {
        '/api': {
          target: env.VITE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // 去除请求路径中的 /api 例 请求 /api/getinfo 后端实际收到的地址为 /getinfo
        },
        '/music': {
          target: 'http://mrzym.top:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/music/, ''),
        },
      },
    },
  }
})
