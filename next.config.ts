import type { NextConfig } from 'next';

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname;
  } catch {
    return undefined;
  }
})();

// Cabecalhos de seguranca em todas as respostas.
//
// A Content-Security-Policy NAO esta aqui: precisa de um nonce diferente a
// cada pedido, portanto vive no middleware.ts. Estes sao os que nao dependem
// do pedido e podem ser estaticos.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HTTPS obrigatorio durante um ano, subdominios incluidos.
          // O "preload" so deve ser submetido a lista quando TODOS os
          // subdominios estiverem em HTTPS. Ver docs/SECURITY.md.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // O navegador nao adivinha tipos de conteudo.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Ninguem nos embebe num iframe (a CSP repete isto com frame-ancestors).
          { key: 'X-Frame-Options', value: 'DENY' },
          // O URL completo so viaja dentro do proprio site.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // A geolocalizacao fica disponivel para o "unidade mais proxima";
          // camara, microfone e pagamento ficam desligados.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(), browsing-topics=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

// Cloudflare (OpenNext): expoe o contexto e as bindings no `next dev`.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
