// Verificacao do Cloudflare Turnstile, no servidor.
//
// Uma verificacao feita so no cliente nao vale nada: quem submete por script
// nunca carrega o nosso JavaScript. O token que o widget produz tem de ser
// validado contra a API da Cloudflare a cada submissao, e cada token so pode
// ser usado uma vez.
import { env } from './env';

export type ResultadoTurnstile = { ok: boolean; motivo?: string };

export async function verificarTurnstile(
  token: string | undefined,
  ip: string | undefined
): Promise<ResultadoTurnstile> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return { ok: false, motivo: 'nao-configurado' };
  if (!token) return { ok: false, motivo: 'sem-token' };

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success) return { ok: true };
    return { ok: false, motivo: (data['error-codes'] || []).join(',') || 'recusado' };
  } catch {
    // Rede em baixo do nosso lado. Recusamos, porque deixar passar seria
    // transformar uma falha de infraestrutura numa porta aberta.
    return { ok: false, motivo: 'erro-de-rede' };
  }
}
