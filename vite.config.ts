import { rmSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],
    server: (() => {
      const serverConfig: any = {};
      // Existing VSCODE_DEBUG condition
      if (process.env.VSCODE_DEBUG) {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        serverConfig.host = url.hostname;
        serverConfig.port = +url.port;
      }
      // Add proxy configuration
      serverConfig.proxy = {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          secure: false,
          timeout: 0,
          ws: true,
        },
        '/socket.io': {
          target: 'http://localhost:3003/socket.io/',
          changeOrigin: false,
          secure: false,
          ws: true,
        }
      };
    
      return serverConfig;
    })(),    
    clearScreen: false,
  }
})