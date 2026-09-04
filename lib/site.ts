// Configuracao do site: URL canonico e navegacao.
//
// A navegacao vive aqui e nao dentro dos componentes porque e a mesma no
// cabecalho, no rodape e no sitemap, e porque ha um teste que verifica que
// nenhuma ligacao aponta para uma rota que nao existe.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lokit.pt').replace(/\/$/, '');

export function url(caminho: string): string {
  return `${SITE_URL}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;
}

export type Rota = { href: string; titulo: string; descricao?: string };

// Todas as rotas publicas do site. O sitemap e os testes leem daqui.
export const ROTAS: Rota[] = [
  { href: '/', titulo: 'Início' },
  { href: '/como-funciona', titulo: 'Como funciona' },
  { href: '/parcerias', titulo: 'Para parceiros' },
  { href: '/locais', titulo: 'Onde estamos' },
  { href: '/sobre', titulo: 'Quem somos' },
  { href: '/contactos', titulo: 'Contactos' },
  { href: '/faq', titulo: 'Perguntas frequentes' },
  { href: '/ajuda', titulo: 'Ajuda' },
  { href: '/termos', titulo: 'Termos e condições' },
  { href: '/privacidade', titulo: 'Política de privacidade' },
  { href: '/cookies', titulo: 'Cookies' },
];

// Cabecalho: quatro entradas e uma accao. A regra do plano e cinco no maximo,
// e nesta fase quem decide localizacoes e o visitante que interessa.
export const NAV_PRINCIPAL: Rota[] = [
  { href: '/como-funciona', titulo: 'Como funciona' },
  { href: '/parcerias', titulo: 'Para parceiros' },
  { href: '/sobre', titulo: 'Quem somos' },
  { href: '/contactos', titulo: 'Contactos' },
];

export const NAV_RODAPE: { titulo: string; itens: Rota[] }[] = [
  {
    titulo: 'Serviço',
    itens: [
      { href: '/como-funciona', titulo: 'Como funciona' },
      { href: '/locais', titulo: 'Onde estamos' },
      { href: '/ajuda', titulo: 'Ajuda' },
      { href: '/faq', titulo: 'Perguntas frequentes' },
    ],
  },
  {
    titulo: 'Parcerias',
    itens: [
      { href: '/parcerias', titulo: 'Ter cacifos no meu espaço' },
      { href: '/parcerias#praias', titulo: 'Praias e concessões' },
      { href: '/parcerias#nocturno', titulo: 'Bares e discotecas' },
      { href: '/parcerias#eventos', titulo: 'Eventos e festivais' },
      { href: '/parcerias#comercio', titulo: 'Comércio e serviços' },
    ],
  },
  {
    titulo: 'Empresa',
    itens: [
      { href: '/sobre', titulo: 'Quem somos' },
      { href: '/contactos', titulo: 'Contactos' },
    ],
  },
  {
    titulo: 'Legal',
    itens: [
      { href: '/termos', titulo: 'Termos e condições' },
      { href: '/privacidade', titulo: 'Privacidade' },
      { href: '/cookies', titulo: 'Cookies' },
    ],
  },
];
