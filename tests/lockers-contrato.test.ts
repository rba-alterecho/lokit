import { describe, expect, it } from 'vitest';
import { AdaptadorExemplo } from '@/lib/lockers/fake';
import type { LockersPort } from '@/lib/lockers/port';
import { TAMANHOS_VALIDOS } from './helpers/lockers';

// Testes de CONTRATO.
//
// Esta bateria corre contra cada implementacao da porta. Hoje so o adaptador
// de exemplo esta na lista. Quando o AdaptadorMicroIO estiver escrito,
// acrescenta-se aqui e, se passar, o site funciona com ele sem mais nenhuma
// alteracao. E o que garante que a implementacao real cumpre o que as paginas
// assumem, em vez de se descobrir isso em producao.
const ADAPTADORES: LockersPort[] = [
  new AdaptadorExemplo(),
  // new AdaptadorMicroIO(),  <- activar quando houver credenciais de teste
];

for (const adaptador of ADAPTADORES) {
  describe(`porta de cacifos: ${adaptador.nome}`, () => {
    it('lista unidades com os campos que as páginas usam', async () => {
      const unidades = await adaptador.listarUnidades();
      expect(Array.isArray(unidades)).toBe(true);
      for (const u of unidades) {
        expect(u.id).toBeTruthy();
        expect(u.slug).toMatch(/^[a-z0-9-]+$/);
        expect(u.nome).toBeTruthy();
        expect(u.localidade).toBeTruthy();
        expect(['activa', 'em-preparacao', 'sazonal-fechada', 'manutencao']).toContain(u.estado);
      }
    });

    it('os slugs são únicos, senão duas unidades partilhavam a mesma página', async () => {
      const unidades = await adaptador.listarUnidades();
      const slugs = unidades.map((u) => u.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });

    it('cada compartimento tem tamanho conhecido e dimensões positivas', async () => {
      const unidades = await adaptador.listarUnidades();
      for (const u of unidades) {
        for (const c of u.compartimentos) {
          expect(TAMANHOS_VALIDOS).toContain(c.tamanho);
          expect(c.largura).toBeGreaterThan(0);
          expect(c.altura).toBeGreaterThan(0);
          expect(c.profundidade).toBeGreaterThan(0);
        }
      }
    });

    it('os preços são inteiros em cêntimos, para não haver aritmética de vírgula flutuante em dinheiro', async () => {
      const unidades = await adaptador.listarUnidades();
      for (const u of unidades) {
        for (const p of u.precos) {
          expect(Number.isInteger(p.centimos)).toBe(true);
          expect(p.centimos).toBeGreaterThan(0);
          expect(['dia', 'noite', 'hora']).toContain(p.periodo);
        }
      }
    });

    it('devolve a unidade pedida pelo slug', async () => {
      const [primeira] = await adaptador.listarUnidades();
      if (!primeira) return;
      const unidade = await adaptador.obterUnidade(primeira.slug);
      expect(unidade?.id).toBe(primeira.id);
    });

    it('devolve null, e não um erro, para um slug que não existe', async () => {
      expect(await adaptador.obterUnidade('nao-existe-de-certeza')).toBeNull();
    });

    it('a disponibilidade nunca reporta mais livres do que o total', async () => {
      const unidades = await adaptador.listarUnidades();
      for (const u of unidades) {
        const d = await adaptador.obterDisponibilidade(u.id);
        if (!d) continue;
        for (const tamanho of TAMANHOS_VALIDOS) {
          const livres = d.livres[tamanho] ?? 0;
          const total = d.total[tamanho] ?? 0;
          expect(livres).toBeLessThanOrEqual(total);
          expect(livres).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('devolve null para uma unidade desconhecida, em vez de zeros que seriam mentira', async () => {
      expect(await adaptador.obterDisponibilidade('unidade-que-nao-existe')).toBeNull();
    });
  });
}
