import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' keeps asset paths relative, so the build works on GitHub Pages
// whatever the repo is called (username.github.io/aen-os/ or a custom domain).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
