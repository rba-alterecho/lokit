// Tabela de redireccionamentos.
//
// Regra do projecto: nenhum URL que ja tenha sido publicado desaparece sem um
// 301 no lugar dele. Um 404 num link que ja circulou custa posicionamento e
// custa confianca, e ninguem se lembra de o corrigir seis meses depois.
//
// Esta tabela e lida pelo next.config.ts e por um teste que verifica que
// nenhuma entrada aponta para uma rota que tambem ja foi redireccionada.
export type Redireccionamento = { de: string; para: string; permanente: boolean };

export const REDIRECCIONAMENTOS: Redireccionamento[] = [
  // Ainda nao ha nenhum. Quando uma pagina mudar de endereco, entra aqui.
];

export function destinoFinal(caminho: string): string {
  const vistos = new Set<string>();
  let actual = caminho;
  while (!vistos.has(actual)) {
    vistos.add(actual);
    const r = REDIRECCIONAMENTOS.find((x) => x.de === actual);
    if (!r) return actual;
    actual = r.para;
  }
  // Ciclo. Devolve o ponto de partida para o teste falhar de forma visivel.
  return caminho;
}
