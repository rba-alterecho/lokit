// Limite de ritmo por IP.
//
// Duas implementacoes, escolhidas em tempo de execucao:
//   - KV da Cloudflare, quando o binding RATE_LIMIT existir. E o correcto:
//     o contador e partilhado por todas as instancias do Worker.
//   - memoria da instancia, como recurso. Mais fraco (cada instancia conta
//     por si), mas nao parte o site enquanto o KV nao estiver criado.
//
// Isto nao substitui a regra de rate limiting do WAF, que trava o abuso antes
// de chegar ao Worker. E a segunda linha, para o caso de a primeira falhar ou
// de alguem apagar a regra sem dar por isso.
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Forma minima do KV, declarada aqui de proposito.
//
// Podiamos usar os tipos gerados pelo `wrangler types`, mas esse ficheiro nao
// e commitado e a verificacao de tipos na CI passaria a depender de correr o
// wrangler primeiro. E menos uma coisa a poder falhar as sete da manha.
type ArmazenamentoKV = {
  get(chave: string): Promise<string | null>;
  put(chave: string, valor: string, opcoes?: { expirationTtl?: number }): Promise<void>;
};

type Contador = { total: number; expira: number };
const memoria = new Map<string, Contador>();

export type Veredicto = { permitido: boolean; restantes: number; repetirEm: number };

function kv(): ArmazenamentoKV | null {
  try {
    const ctx = getCloudflareContext();
    const binding = (ctx?.env as Record<string, unknown> | undefined)?.RATE_LIMIT;
    return (binding as ArmazenamentoKV) ?? null;
  } catch {
    // Fora do runtime da Cloudflare (testes, `next build`) nao ha contexto.
    return null;
  }
}

export async function limitar(
  chave: string,
  maximo: number,
  janelaSegundos: number
): Promise<Veredicto> {
  const agora = Date.now();
  const expira = agora + janelaSegundos * 1000;
  const store = kv();

  if (store) {
    const bruto = await store.get(chave);
    const actual: Contador = bruto ? (JSON.parse(bruto) as Contador) : { total: 0, expira };
    const valido = actual.expira > agora ? actual : { total: 0, expira };
    valido.total += 1;
    // O expirationTtl do KV limpa sozinho a chave, portanto nao ha lixo a crescer.
    await store.put(chave, JSON.stringify(valido), { expirationTtl: janelaSegundos });
    return {
      permitido: valido.total <= maximo,
      restantes: Math.max(0, maximo - valido.total),
      repetirEm: Math.ceil((valido.expira - agora) / 1000),
    };
  }

  const actual = memoria.get(chave);
  const valido = actual && actual.expira > agora ? actual : { total: 0, expira };
  valido.total += 1;
  memoria.set(chave, valido);
  // Limpeza barata: sem isto o Map cresce enquanto a instancia viver.
  if (memoria.size > 5000) {
    for (const [k, v] of memoria) if (v.expira <= agora) memoria.delete(k);
  }
  return {
    permitido: valido.total <= maximo,
    restantes: Math.max(0, maximo - valido.total),
    repetirEm: Math.ceil((valido.expira - agora) / 1000),
  };
}

// Exportado so para os testes poderem partir de um estado limpo.
export function _limparMemoria(): void {
  memoria.clear();
}
