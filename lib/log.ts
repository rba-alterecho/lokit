// Registo estruturado, sem dados pessoais.
//
// A regra e simples: nada que identifique uma pessoa entra nos logs. O email,
// o telefone e a mensagem vivem na base de dados, com politica de retencao;
// nos logs fica apenas o que serve para diagnosticar.
//
// O IP e guardado como resumo com sal, o que permite contar tentativas do
// mesmo sitio sem guardar de quem sao. Sem sal, um resumo de IP e reversivel
// por forca bruta em segundos, portanto o sal nao e detalhe.
import { env } from './env';

export function ipDoPedido(req: Request): string | undefined {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined
  );
}

export async function resumoComSal(valor: string | undefined): Promise<string | null> {
  if (!valor) return null;
  const sal = env('IP_HASH_SALT') || 'lokit-sem-sal-configurado';
  const dados = new TextEncoder().encode(`${sal}:${valor}`);
  const digest = await crypto.subtle.digest('SHA-256', dados);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// O agente do utilizador reduzido a uma classe. Chega para saber se o
// formulario e preenchido no telemovel ou no computador, e nao serve para
// identificar ninguem.
export function classeDeDispositivo(ua: string | null): 'movel' | 'computador' | 'desconhecido' {
  if (!ua) return 'desconhecido';
  return /Mobi|Android|iPhone|iPad/i.test(ua) ? 'movel' : 'computador';
}

export function registar(evento: string, dados: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ evento, ...dados, ts: new Date().toISOString() }));
}
