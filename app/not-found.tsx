import { Botao, Container } from '@/components/ui';
import Link from 'next/link';
import { NAV_PRINCIPAL } from '@/lib/site';

// Um 404 que nao e um beco: diz o que aconteceu e da tres saidas.
export default function NaoEncontrado() {
  return (
    <Container className="py-24">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-3">Erro 404</p>
      <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Esta página não existe</h1>
      <p className="mb-8 max-w-xl text-ink-2">
        Pode ter sido movida ou o endereço pode ter um erro de escrita. As páginas mais procuradas
        estão aqui em baixo.
      </p>
      <div className="mb-10 flex flex-wrap gap-3">
        <Botao href="/">Ir para o início</Botao>
        <Botao href="/contactos" variante="secundario">
          Falar connosco
        </Botao>
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {NAV_PRINCIPAL.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="text-ink-2 underline underline-offset-4 hover:text-ink">
              {r.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
