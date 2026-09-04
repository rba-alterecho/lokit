import { beforeEach, describe, expect, it } from 'vitest';
import { _limparMemoria, limitar } from '@/lib/ratelimit';

// Sem binding de KV nos testes, corre a implementacao de memoria. E de
// proposito: e a que corre em producao enquanto o namespace nao existir, e
// tambem tem de estar certa.
describe('limite de ritmo', () => {
  beforeEach(() => _limparMemoria());

  it('deixa passar até ao máximo e recusa a seguir', async () => {
    for (let i = 0; i < 3; i++) {
      const v = await limitar('teste', 3, 60);
      expect(v.permitido).toBe(true);
    }
    const quarta = await limitar('teste', 3, 60);
    expect(quarta.permitido).toBe(false);
    expect(quarta.restantes).toBe(0);
    expect(quarta.repetirEm).toBeGreaterThan(0);
  });

  it('conta cada chave por si, senão um visitante bloqueava os outros todos', async () => {
    await limitar('ip-a', 1, 60);
    const outro = await limitar('ip-b', 1, 60);
    expect(outro.permitido).toBe(true);
  });

  it('vai descontando o que resta', async () => {
    const primeira = await limitar('contagem', 5, 60);
    expect(primeira.restantes).toBe(4);
  });
});
