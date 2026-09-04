import Link from 'next/link';
import type { ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Seccao({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Sobrescrito({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-ink-3">
      {children}
    </span>
  );
}

export function Titulo({ children, nivel = 2 }: { children: ReactNode; nivel?: 1 | 2 }) {
  const classe = nivel === 1 ? 'text-3xl sm:text-5xl font-bold leading-[1.08]' : 'text-2xl sm:text-3xl font-semibold';
  return nivel === 1 ? <h1 className={classe}>{children}</h1> : <h2 className={classe}>{children}</h2>;
}

export function Botao({
  href,
  children,
  variante = 'principal',
}: {
  href: string;
  children: ReactNode;
  variante?: 'principal' | 'secundario';
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors';
  const estilo =
    variante === 'principal'
      ? 'bg-sea text-on-sea hover:bg-sea-strong'
      : 'border border-rule text-ink hover:bg-surface-2';
  return (
    <Link href={href} className={`${base} ${estilo}`}>
      {children}
    </Link>
  );
}

export function Cartao({
  titulo,
  children,
  destaque = false,
}: {
  titulo: string;
  children: ReactNode;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-surface p-6 ${
        destaque ? 'border-sea/40 border-l-[3px] border-l-sea' : 'border-rule'
      }`}
    >
      <h3 className="mb-2 text-base font-semibold">{titulo}</h3>
      <div className="text-[15px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

export function Aviso({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-rule bg-surface-2 px-5 py-4 text-[15px] leading-relaxed text-ink-2">
      {children}
    </div>
  );
}

// Migalhas de pao. Aparecem em tudo o que esta abaixo do primeiro nivel, e a
// marcacao BreadcrumbList correspondente vai no JSON-LD da propria pagina.
export function Migalhas({ itens }: { itens: { titulo: string; caminho: string }[] }) {
  return (
    <nav aria-label="Percurso" className="mb-6 text-[13px] text-ink-3">
      {itens.map((item, i) => (
        <span key={item.caminho}>
          {i > 0 && <span className="mx-2 text-rule">/</span>}
          {i === itens.length - 1 ? (
            <span className="text-ink-2">{item.titulo}</span>
          ) : (
            <Link href={item.caminho} className="hover:text-ink">
              {item.titulo}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
