import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdOrganizacao } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { COMPANY } from '@/lib/company';

// A fonte e descarregada em tempo de build e servida do nosso dominio, e nao
// do Google. Menos um pedido a terceiros, menos uma entrada na CSP, e menos um
// paragrafo na politica de privacidade.
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lokit, cacifos automáticos para praias, bares e eventos',
    template: `%s | ${COMPANY.brand}`,
  },
  description:
    'Cacifos automáticos sem cadeado e sem chave, para praias, bares, discotecas, eventos e comércio em Portugal. Abrem-se pelo telemóvel.',
  applicationName: COMPANY.brand,
  formatDetection: { telephone: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // O nonce vem do middleware. Ler o cabecalho torna as paginas dinamicas, que
  // e o preco de ter uma CSP com nonce em vez de 'unsafe-inline'. Num site
  // deste tamanho, servido no edge, o preco e baixo e a troca compensa.
  // Ver docs/DECISIONS.md, entrada de 2026-09-01.
  const nonce = (await headers()).get('x-nonce') || undefined;
  const analytics = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  return (
    <html lang="pt-PT" className={archivo.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sea focus:px-4 focus:py-2 focus:text-on-sea"
        >
          Saltar para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        <DadosEstruturados dados={jsonLdOrganizacao()} />

        {/* Cloudflare Web Analytics: sem cookies, logo sem banner de
            consentimento e sem envio de dados de visitantes a terceiros
            fora da Cloudflare, que ja serve o site. */}
        {analytics && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            nonce={nonce}
            data-cf-beacon={`{"token": "${analytics}"}`}
          />
        )}
      </body>
    </html>
  );
}
