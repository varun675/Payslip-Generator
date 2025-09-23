import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'import react from '@vitejs/plugin-react'

import path from 'path'import path from 'path'



export default defineConfig({// https://vitejs.dev/config/

  plugins: [react()],export default defineConfig({

  base: '/Payslip-Generator/',  plugins: [react()],

  resolve: {  base: '/Payslip-Generator/', // Required for GitHub Pages

    alias: {  resolve: {

      '@': path.resolve(__dirname, './src'),    alias: {

    },      '@': path.resolve(__dirname, './src'),

  },    },

  build: {  },

    outDir: 'dist',  build: {

    sourcemap: true,    outDir: 'dist',

  }    sourcemap: true,

})    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})