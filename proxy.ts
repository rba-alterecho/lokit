import { NextResponse, type NextRequest } from 'next/server';

// Content-Security-Policy com nonce por pedido.
//
// Porque aqui e nao no next.config.ts: o nonce tem de ser diferente
// em cada resposta, senao nao serve para nada. O Next le o cabecalho
// `Content-Security-Policy` do PEDIDO para descobrir o nonce e aplica-o
// automaticamente aos scripts que ele proprio injecta.
//
// Modo: CSP_MODE=enforce impoe; qualquer outro valor (ou nenhum) publica em
// Report-Only. Arrancamos em Report-Only de proposito, para ler uma semana de
// relatorios antes de impor. Passar a enforce e mudar uma variavel, nao mexer
// no codigo. Ver docs/SECURITY.md.
function build(nonce: string, impor: boolean): string {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const report = process.env.CSP_REPORT_URI;

  return [
    "default-src 'self'",
    // Sem 'strict-dynamic' por agora: com ele, os navegadores modernos
    // ignoram a lista de dominios e todos os scripts externos passariam a
    // precisar do nonce, incluindo o do Turnstile. Fica como endurecimento a
    // considerar depois de a CSP estar em modo de imposicao (docs/SECURITY.md).
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
    // O Next injecta estilos em linha para o CSS critico. O nonce cobre-os.
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${supabase} https://challenges.cloudflare.com https://cloudflareinsights.com`.trim(),
    'frame-src https://challenges.cloudflare.com',
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "object-src 'none'",
    "form-action 'self'",
    // Ignorada em Report-Only, e o navegador queixa-se na consola por cada
    // pagina carregada. So entra quando a politica e mesmo imposta.
    impor ? 'upgrade-insecure-requests' : '',
    report ? `report-uri ${report}` : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const impor = process.env.CSP_MODE === 'enforce';
  const csp = build(nonce, impor);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  // Sempre no pedido, e sempre na forma normal: e daqui que o Next tira o
  // nonce, independentemente de estarmos a impor ou so a observar.
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(
    impor ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
    csp
  );
  return response;
}

export const config = {
  // Fora: ficheiros estaticos e imagens, que nao executam scripts.
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
  ],
};
