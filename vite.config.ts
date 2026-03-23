import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 代理所有 /api 请求到目标服务器
      '/api': {
        target: 'https://superapi.superauthority.top',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 代理所有其他请求
      '/proxy': {
        target: 'https://superapi.superauthority.top',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/proxy/, '')
      }
    }
  }
})
