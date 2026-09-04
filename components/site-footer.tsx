import Link from 'next/link';
import { COMPANY, COMPANY_PENDENTE } from '@/lib/company';
import { NAV_RODAPE } from '@/lib/site';
import { Container } from './ui';

// O rodape e o mapa completo do site. Tudo o que nao cabe no cabecalho,
// que tem cinco entradas no maximo, vive aqui.
export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-surface">
      <Container>
        <div className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {NAV_RODAPE.map((coluna) => (
            <div key={coluna.titulo}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-3">
                {coluna.titulo}
              </h2>
              <ul className="space-y-2">
                {coluna.itens.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-ink-2 hover:text-ink">
                      {item.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-rule py-8 text-[13px] leading-relaxed text-ink-3">
          <p className="mb-1">
            <strong className="font-medium text-ink-2">Lokit</strong> é a marca comercial de{' '}
            {COMPANY.legalName}, NIPC {COMPANY.nif}, com sede em {COMPANY.address}.
          </p>
          <p className="mb-1">
            Contacto:{' '}
            <a href={`mailto:${COMPANY.contactEmail}`} className="hover:text-ink-2">
              {COMPANY.contactEmail}
            </a>
          </p>
          {COMPANY.complaintsBookUrl ? (
            <p className="mb-1">
              <a href={COMPANY.complaintsBookUrl} className="hover:text-ink-2">
                Livro de Reclamações electrónico
              </a>
            </p>
          ) : (
            COMPANY_PENDENTE.livroReclamacoes && (
              <p className="mb-1">
                Livro de Reclamações electrónico disponível assim que o registo da sociedade estiver
                concluído.
              </p>
            )
          )}
          <p className="mt-3">
            © {COMPANY.copyrightYear} {COMPANY.legalName}
          </p>
        </div>
      </Container>
    </footer>
  );
}
