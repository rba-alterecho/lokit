import { describe, expect, it } from 'vitest';
import { NAV_PRINCIPAL, NAV_RODAPE, ROTAS, url } from '@/lib/site';
import { REDIRECCIONAMENTOS, destinoFinal } from '@/lib/redirects';

const conhecidas = new Set(ROTAS.map((r) => r.href));

function semAncora(href: string) {
  return href.split('#')[0] || '/';
}

describe('navegação', () => {
  it('todas as ligações do cabeçalho apontam para páginas que existem', () => {
    for (const item of NAV_PRINCIPAL) {
      expect(conhecidas.has(semAncora(item.href)), `${item.href} não está em ROTAS`).toBe(true);
    }
  });

  it('todas as ligações do rodapé apontam para páginas que existem', () => {
    for (const coluna of NAV_RODAPE) {
      for (const item of coluna.itens) {
        expect(conhecidas.has(semAncora(item.href)), `${item.href} não está em ROTAS`).toBe(true);
      }
    }
  });

  it('o cabeçalho tem cinco entradas no máximo', () => {
    // A regra do plano do site. Um cabeçalho com dez entradas nao e um menu,
    // e uma lista de tudo o que ninguem conseguiu decidir cortar.
    expect(NAV_PRINCIPAL.length).toBeLessThanOrEqual(5);
  });

  it('não há rotas duplicadas', () => {
    const hrefs = ROTAS.map((r) => r.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('o URL canónico não fica com barra a dobrar', () => {
    expect(url('/parcerias')).not.toContain('//parcerias');
    expect(url('parcerias')).toContain('/parcerias');
  });
});

describe('redireccionamentos', () => {
  it('nenhum aponta para uma rota que também foi redireccionada, nem faz ciclo', () => {
    for (const r of REDIRECCIONAMENTOS) {
      const final = destinoFinal(r.de);
      expect(final).not.toBe(r.de);
      expect(conhecidas.has(semAncora(final)), `${r.de} acaba em ${final}, que não existe`).toBe(true);
    }
  });
});
