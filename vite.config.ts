
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Если ваш репозиторий называется 'hot-well-boiler', установите base: '/hot-well-boiler/'
  // Для автоматического определения используем относительные пути:
  base: './',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
});
