import { defineConfig } from 'vitest/config';
import path from 'path';

// Testa a logica de servidor: libs em /lib e as rotas da API. O render do
// Next nao entra aqui, e coberto pelos testes de ponta a ponta em /e2e.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: false,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
});
