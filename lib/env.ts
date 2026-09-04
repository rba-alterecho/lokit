// Leitura tolerante das variaveis de ambiente do servidor.
//
// Porque existe: o painel da Cloudflare aceita nomes de secrets com espacos no
// inicio ou no fim. Um " TURNSTILE_SECRET_KEY" colado com um espaco invisivel
// parece perfeito na lista e o codigo nunca o encontra. Ja aconteceu antes,
// noutro projecto, e custou um pagamento real.
//
// Preferimos sempre o nome exacto. So se nao existir e que procuramos uma
// chave que, aparada, seja igual, e avisamos no log para o nome acabar por
// ser corrigido em vez de ficar assim para sempre.
const avisados = new Set<string>();

export function env(nome: string): string | undefined {
  const exacto = process.env[nome];
  if (exacto !== undefined && exacto !== '') return exacto;

  for (const chave of Object.keys(process.env)) {
    if (chave !== nome && chave.trim() === nome) {
      const valor = process.env[chave];
      if (valor === undefined || valor === '') continue;
      if (!avisados.has(nome)) {
        avisados.add(nome);
        console.warn(
          `[env] "${nome}" foi encontrado com espacos no nome (${JSON.stringify(chave)}). ` +
            'Esta a ser usado na mesma, mas convem corrigir o nome no dashboard do Worker.'
        );
      }
      return valor;
    }
  }
  return exacto;
}

export function emProducao(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Que servicos estao configurados. As rotas usam isto para decidir se podem
// funcionar, em vez de descobrirem a meio de um pedido que falta uma chave.
export const servicos = {
  baseDados: () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && env('SUPABASE_SERVICE_ROLE_KEY')),
  email: () => !!(env('MAILJET_API_KEY') && env('MAILJET_SECRET_KEY')),
  turnstile: () =>
    !!(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env('TURNSTILE_SECRET_KEY')),
};
