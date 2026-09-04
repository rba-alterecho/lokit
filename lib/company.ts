// =============================================================================
// IDENTIDADE DA EMPRESA
// =============================================================================
// Fonte unica de verdade. Quando o registo definitivo da sociedade sair e os
// dados finais chegarem (certidao permanente, Livro de Reclamacoes, morada
// definitiva), altera-se APENAS este ficheiro: rodape, paginas legais, emails
// e JSON-LD passam todos a refletir os valores novos.
//
// Firma legal e marca sao coisas distintas:
//   firma  = IMOLOCKERS, LDA   (contratos, faturas, paginas legais)
//   marca  = Lokit             (comunicacao, dominio, interface)
// =============================================================================

export const COMPANY = {
  // Firma completa, como consta no RNPC
  legalName: 'IMOLOCKERS, LDA',

  // Marca comercial
  brand: 'Lokit',

  // NIPC pre-atribuido no Certificado de Admissibilidade 2026038816.
  // Confirmar contra a certidao permanente quando o registo definitivo sair.
  nif: '519519850',

  // Sede social
  address: 'Rua Ponte S. Bento n.º 1, 3020-908 Zouparria do Monte, Coimbra',
  city: 'Coimbra',
  country: 'PT',

  // Contacto geral, tambem usado para pedidos de RGPD
  contactEmail: 'info@lokit.pt',

  // Remetente dos emails transaccionais. Deliberadamente um endereco a que se
  // pode responder, e nao um noreply@: quem pede informacao sobre uma parceria
  // costuma responder ao email de confirmacao, e essa resposta vale dinheiro.
  mailFromEmail: 'info@lokit.pt',
  mailFromName: 'Lokit',

  // Livro de Reclamacoes electronico. Fica vazio ate a empresa estar registada
  // e o livro atribuido; o rodape so mostra a ligacao quando isto tiver valor.
  complaintsBookUrl: '',

  copyrightYear: 2026,
} as const;

// Dados de constituicao ainda pendentes. Usado pelas paginas legais para
// dizerem a verdade sobre o que ainda nao esta fechado, em vez de inventarem.
export const COMPANY_PENDENTE = {
  registoDefinitivo: true,
  livroReclamacoes: true,
  marcaINPI: true,
} as const;
