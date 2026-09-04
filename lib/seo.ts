// Metadados e dados estruturados.
//
// Tudo o que os motores de busca leem passa por aqui, para nao haver duas
// versoes da mesma verdade espalhadas pelas paginas.
import type { Metadata } from 'next';
import { COMPANY } from './company';
import { SITE_URL, url } from './site';

const DESCRICAO_BASE =
  'Cacifos automáticos para praias, bares, discotecas, eventos e comércio em Portugal. ' +
  'Sem cadeado e sem chave: abre-se pelo telemóvel, com fechadura eletrónica.';

export function metadados(args: {
  titulo: string;
  descricao?: string;
  caminho: string;
  indexavel?: boolean;
}): Metadata {
  const descricao = args.descricao || DESCRICAO_BASE;
  const canonical = url(args.caminho);
  return {
    title: args.titulo,
    description: descricao,
    alternates: { canonical },
    robots: args.indexavel === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title: args.titulo,
      description: descricao,
      url: canonical,
      siteName: COMPANY.brand,
      locale: 'pt_PT',
      type: 'website',
    },
  };
}

// Organizacao. Vai em todas as paginas pelo layout, porque e a marcacao que
// liga o site a empresa e aos perfis dela.
export function jsonLdOrganizacao() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    email: COMPANY.contactEmail,
    vatID: `PT${COMPANY.nif}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      addressCountry: COMPANY.country,
    },
    areaServed: 'PT',
  };
}

export function jsonLdPerguntas(perguntas: { pergunta: string; resposta: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: perguntas.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  };
}

export function jsonLdMigalhas(itens: { titulo: string; caminho: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.titulo,
      item: url(item.caminho),
    })),
  };
}
