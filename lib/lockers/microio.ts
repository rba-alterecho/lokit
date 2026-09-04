import { type LockersPort, PlataformaNaoConfigurada } from './port';
import type { Disponibilidade, Unidade } from './types';
import { env } from '../env';

// Adaptador da MicroIO. Por implementar de proposito.
//
// Ainda nao temos acesso a API nem documentacao. As 11 perguntas que
// desbloqueiam esta classe estao em docs/ARCHITECTURE.md, seccao "Plataforma
// de cacifos". Enquanto nao houver respostas, isto lanca um erro explicito em
// vez de devolver dados vazios, que seria pior: uma pagina a dizer "0 cacifos
// livres" e uma mentira, uma pagina em erro e um problema visivel.
//
// Quando a API existir, implementar aqui e correr
// tests/lockers-contrato.test.ts contra esta classe. Se passar, o site
// funciona sem mais nenhuma alteracao.
export class AdaptadorMicroIO implements LockersPort {
  readonly nome = 'microio';

  private base(): string {
    const url = env('MICROIO_API_URL');
    if (!url) throw new PlataformaNaoConfigurada('falta MICROIO_API_URL');
    return url;
  }

  async listarUnidades(): Promise<Unidade[]> {
    this.base();
    throw new PlataformaNaoConfigurada('listarUnidades por implementar');
  }

  async obterUnidade(_slug: string): Promise<Unidade | null> {
    this.base();
    throw new PlataformaNaoConfigurada('obterUnidade por implementar');
  }

  async obterDisponibilidade(_unidadeId: string): Promise<Disponibilidade | null> {
    this.base();
    throw new PlataformaNaoConfigurada('obterDisponibilidade por implementar');
  }
}
