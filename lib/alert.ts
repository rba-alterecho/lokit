// Alertas operacionais. Usado nos caminhos onde uma falha silenciosa custa
// dinheiro ou um cliente: gravacao de um lead, envio de um email.
//
// Best-effort e nunca lanca: um alerta que falha nao pode partir o pedido.
// Tres canais, todos opcionais menos o primeiro:
//   - console.error, sempre (visivel nos logs do Worker)
//   - email para ALERT_EMAIL
//   - POST para ALERT_WEBHOOK_URL (Discord ou Slack), que nao depende do
//     proprio Mailjet estar de pe
import { sendEmail } from './email';
import { COMPANY } from './company';
import { env } from './env';

export async function notifyAdmin(assunto: string, detalhe: string): Promise<void> {
  const stamp = new Date().toISOString();
  const titulo = `[Lokit ALERTA] ${assunto}`;
  const corpo = `${assunto}\n\n${detalhe}\n\n${stamp}`;

  console.error(titulo, detalhe);

  const tarefas: Promise<unknown>[] = [];

  const webhook = env('ALERT_WEBHOOK_URL');
  if (webhook) {
    // {content} e lido pelo Discord, {text} pelo Slack; cada um ignora o outro.
    // O Discord corta acima de 2000 caracteres, portanto truncamos antes.
    const max = 1800;
    const cabeca = `**${titulo}**\n`;
    const espaco = max - cabeca.length - 20;
    const texto = corpo.length > espaco ? `${corpo.slice(0, espaco)}\n[truncado]` : corpo;
    tarefas.push(
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: cabeca + texto, text: `${titulo}\n${texto}` }),
        signal: AbortSignal.timeout(5000),
      }).catch(() => {})
    );
  }

  const para = env('ALERT_EMAIL') || COMPANY.contactEmail;
  if (para) {
    tarefas.push(
      sendEmail({ to: { email: para, name: 'Lokit Ops' }, subject: titulo, text: corpo }).catch(
        () => ({ ok: false as const })
      )
    );
  }

  await Promise.allSettled(tarefas);
}
