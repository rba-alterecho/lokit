import type { Disponibilidade, Unidade } from './types';

// A porta: o unico contrato que o site conhece.
//
// Nenhuma pagina, nenhuma rota e nenhum componente fala com a plataforma de
// cacifos directamente. Falam com isto. Hoje por tras esta um adaptador falso
// com dados de exemplo; amanha estara a MicroIO; se um dia houver segundo
// fornecedor, entra ao lado sem tocar em mais nada.
//
// A mesma bateria de testes (tests/lockers-contrato.test.ts) corre contra
// todas as implementacoes. E o que garante que a real cumpre o contrato antes
// de chegar a producao.
export interface LockersPort {
  readonly nome: string;
  listarUnidades(): Promise<Unidade[]>;
  obterUnidade(slug: string): Promise<Unidade | null>;
  // Devolve null quando a plataforma nao consegue responder. O site mostra a
  // unidade na mesma, sem o numero de cacifos livres, em vez de mostrar zero,
  // que seria mentira.
  obterDisponibilidade(unidadeId: string): Promise<Disponibilidade | null>;
}

export class PlataformaNaoConfigurada extends Error {
  constructor(detalhe: string) {
    super(`Plataforma de cacifos não configurada: ${detalhe}`);
    this.name = 'PlataformaNaoConfigurada';
  }
}
