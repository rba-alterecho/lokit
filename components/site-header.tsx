import Link from 'next/link';
import { NAV_PRINCIPAL } from '@/lib/site';
import { Container } from './ui';

// O menu de telemovel e um <details>, nao um componente com estado.
//
// Nao e preguica: sem JavaScript, o menu abre mesmo quando o pacote ainda nao
// carregou, funciona com teclado e leitores de ecra sem trabalho extra, e nao
// precisa de nonce nenhum na CSP.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-ground/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Lokit, página inicial">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-sea text-[13px] font-bold text-on-sea">
              L
            </span>
            <span className="text-lg font-bold tracking-tight">Lokit</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {NAV_PRINCIPAL.map((r) => (
              <Link key={r.href} href={r.href} className="text-sm text-ink-2 hover:text-ink">
                {r.titulo}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/parcerias#pedido"
              className="inline-flex items-center rounded-lg bg-sea px-4 py-2 text-sm font-semibold text-on-sea hover:bg-sea-strong"
            >
              Quero cacifos no meu espaço
            </Link>
          </div>

          <details className="relative md:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-md border border-rule px-3 py-2 text-sm font-medium">
              Menu
            </summary>
            <div className="absolute right-0 top-12 w-64 rounded-xl border border-rule bg-surface p-2 shadow-lg">
              {NAV_PRINCIPAL.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="block rounded-md px-3 py-2.5 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
                >
                  {r.titulo}
                </Link>
              ))}
              <Link
                href="/parcerias#pedido"
                className="mt-1 block rounded-md bg-sea px-3 py-2.5 text-center text-sm font-semibold text-on-sea"
              >
                Quero cacifos no meu espaço
              </Link>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
