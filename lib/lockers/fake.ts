import type { LockersPort } from './port';
import type { Disponibilidade, Unidade } from './types';

// Adaptador de exemplo. Deterministico de proposito: os testes e as capturas
// de ecra tem de dar sempre o mesmo resultado.
//
// Os dados espelham a configuracao real orcamentada a MicroIO (34 cacifos,
// 22 pequenos e 12 medios) para que as paginas sejam desenhadas contra numeros
// plausiveis, e nao contra tres cacifos inventados.
const PRECOS_PRAIA = [
  { tamanho: 'P' as const, centimos: 650, periodo: 'dia' as const },
  { tamanho: 'M' as const, centimos: 900, periodo: 'dia' as const },
];

const PRECOS_NOITE = [
  { tamanho: 'P' as const, centimos: 500, periodo: 'noite' as const },
  { tamanho: 'M' as const, centimos: 700, periodo: 'noite' as const },
];

function compartimentos(pequenos: number, medios: number) {
  const lista = [];
  for (let i = 0; i < pequenos; i++) {
    lista.push({ id: `P${i + 1}`, tamanho: 'P' as const, largura: 30, altura: 20, profundidade: 45 });
  }
  for (let i = 0; i < medios; i++) {
    lista.push({ id: `M${i + 1}`, tamanho: 'M' as const, largura: 30, altura: 40, profundidade: 45 });
  }
  return lista;
}

const UNIDADES: Unidade[] = [
  {
    id: 'un-exemplo-praia',
    slug: 'exemplo-praia',
    nome: 'Unidade de praia (exemplo)',
    localidade: 'Praia de exemplo',
    distrito: 'Coimbra',
    estado: 'em-preparacao',
    compartimentos: compartimentos(22, 12),
    precos: PRECOS_PRAIA,
    horario: 'Todos os dias, 08:00 às 21:00, de junho a setembro',
  },
  {
    id: 'un-exemplo-nocturno',
    slug: 'exemplo-nocturno',
    nome: 'Unidade nocturna (exemplo)',
    localidade: 'Aveiro',
    distrito: 'Aveiro',
    estado: 'em-preparacao',
    compartimentos: compartimentos(16, 8),
    precos: PRECOS_NOITE,
    horario: 'Quinta a sábado, 23:00 às 06:00',
  },
];

export class AdaptadorExemplo implements LockersPort {
  readonly nome = 'exemplo';

  async listarUnidades(): Promise<Unidade[]> {
    return UNIDADES.map((u) => ({ ...u }));
  }

  async obterUnidade(slug: string): Promise<Unidade | null> {
    const u = UNIDADES.find((x) => x.slug === slug);
    return u ? { ...u } : null;
  }

  async obterDisponibilidade(unidadeId: string): Promise<Disponibilidade | null> {
    const u = UNIDADES.find((x) => x.id === unidadeId);
    if (!u) return null;
    const total = { P: 0, M: 0, G: 0 };
    for (const c of u.compartimentos) total[c.tamanho] += 1;
    // Enquanto a unidade estiver em preparacao nao ha ocupacao para reportar.
    return {
      unidadeId,
      livres: { P: total.P, M: total.M },
      total: { P: total.P, M: total.M },
      actualizadoEm: '2026-01-01T00:00:00.000Z',
    };
  }
}
