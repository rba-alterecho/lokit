// Tipos da camada de cacifos.
//
// Sao os NOSSOS tipos, nao os da MicroIO. E de proposito: se um dia a forma
// dos dados deles mudar, ou se entrar outro fornecedor, a mudanca fica presa
// dentro do adaptador e o site nao da por nada.

export type TamanhoCacifo = 'P' | 'M' | 'G';

export type Compartimento = {
  id: string;
  tamanho: TamanhoCacifo;
  // Dimensoes uteis em centimetros, para poder responder a pergunta que toda
  // a gente faz: "cabe a minha mochila?"
  largura: number;
  altura: number;
  profundidade: number;
};

export type Preco = {
  tamanho: TamanhoCacifo;
  // Em centimos, para nao haver aritmetica de virgula flutuante em dinheiro.
  centimos: number;
  periodo: 'dia' | 'noite' | 'hora';
};

export type EstadoUnidade = 'activa' | 'em-preparacao' | 'sazonal-fechada' | 'manutencao';

export type Unidade = {
  id: string;
  slug: string;
  nome: string;
  // Localidade e distrito chegam para a pagina publica. A morada completa so
  // aparece quando a unidade estiver mesmo instalada.
  localidade: string;
  distrito: string;
  morada?: string;
  lat?: number;
  lng?: number;
  estado: EstadoUnidade;
  compartimentos: Compartimento[];
  precos: Preco[];
  horario?: string;
};

export type Disponibilidade = {
  unidadeId: string;
  // Livres por tamanho. Ausente quando a plataforma nao souber responder,
  // que e diferente de zero.
  livres: Partial<Record<TamanhoCacifo, number>>;
  total: Partial<Record<TamanhoCacifo, number>>;
  actualizadoEm: string;
};
