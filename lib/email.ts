// Envio de email pela API do Mailjet. Sem SDK: um fetch chega e nao acrescenta
// uma dependencia que corre no Worker.
import { COMPANY } from './company';
import { env } from './env';

type SendArgs = {
  to: { email: string; name?: string };
  subject: string;
  text: string;
  html?: string;
  replyTo?: { email: string; name?: string };
};

export function emailConfigured(): boolean {
  return !!(env('MAILJET_API_KEY') && env('MAILJET_SECRET_KEY'));
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// O v3.1 do Mailjet pode responder 200 com a mensagem individual em erro, por
// isso nao basta olhar para o estado HTTP. Sem esta leitura, um envio recusado
// era contado como entregue e ninguem dava por nada.
export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const key = env('MAILJET_API_KEY');
  const secret = env('MAILJET_SECRET_KEY');
  if (!key || !secret) return { ok: false, error: 'Email não configurado' };

  const fromEmail = env('MAIL_FROM') || COMPANY.mailFromEmail;
  const fromName = env('MAIL_FROM_NAME') || COMPANY.mailFromName;
  const auth = btoa(`${key}:${secret}`);

  const body = {
    Messages: [
      {
        From: { Email: fromEmail, Name: fromName },
        ReplyTo: args.replyTo
          ? { Email: args.replyTo.email, Name: args.replyTo.name || args.replyTo.email }
          : { Email: COMPANY.contactEmail, Name: fromName },
        To: [{ Email: args.to.email, Name: args.to.name || args.to.email }],
        Subject: args.subject,
        TextPart: args.text,
        HTMLPart: args.html || `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(args.text)}</pre>`,
      },
    ],
  };

  try {
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    const raw = await res.text();

    let erroDaMensagem: string | null = null;
    try {
      const data = JSON.parse(raw) as {
        Messages?: { Status?: string; Errors?: { ErrorMessage?: string; ErrorCode?: string }[] }[];
      };
      const m = data.Messages?.[0];
      if (m?.Status && m.Status !== 'success') {
        erroDaMensagem =
          (m.Errors || [])
            .map((e) => `${e.ErrorCode ?? ''} ${e.ErrorMessage ?? ''}`.trim())
            .join('; ') || `status ${m.Status}`;
      }
    } catch {
      // corpo nao-JSON: fica-se pelo estado HTTP
    }

    if (res.ok && !erroDaMensagem) return { ok: true };
    return { ok: false, error: `Mailjet ${res.status}: ${erroDaMensagem || raw.slice(0, 200)}` };
  } catch {
    return { ok: false, error: 'Falha ao contactar o serviço de email' };
  }
}
