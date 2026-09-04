// Validacao e normalizacao dos pedidos de parceria.
//
// A validacao e por lista de permitidos: cada campo tem tipo, tamanho maximo e
// forma esperada, e o que nao encaixar e recusado. Uma lista de proibidos
// esquece-se sempre de alguma coisa.
import { z } from 'zod';

export const VERTICAIS = ['praia', 'nocturno', 'eventos', 'comercio', 'outro'] as const;
export type Vertical = (typeof VERTICAIS)[number];

export const ROTULO_VERTICAL: Record<Vertical, string> = {
  praia: 'Praia ou concessão',
  nocturno: 'Bar ou discoteca',
  eventos: 'Eventos e festivais',
  comercio: 'Comércio e serviços',
  outro: 'Outro',
};

// O tempo minimo de preenchimento e uma barreira barata: um robot submete em
// menos de um segundo, uma pessoa nunca. Nao chega sozinho, por isso e a
// terceira das quatro camadas (Turnstile, campo-armadilha, tempo, ritmo).
export const TEMPO_MINIMO_MS = 2000;

export const esquemaLead = z.object({
  nome: z.string().trim().min(2, 'Diga-nos como se chama').max(120),
  email: z.string().trim().toLowerCase().email('Verifique o endereço de email').max(180),
  telefone: z.string().trim().max(40).optional().or(z.literal('')),
  empresa: z.string().trim().max(160).optional().or(z.literal('')),
  vertical: z.enum(VERTICAIS),
  localizacao: z.string().trim().max(160).optional().or(z.literal('')),
  mensagem: z.string().trim().max(4000).optional().or(z.literal('')),
  // Campo-armadilha: invisivel no formulario, portanto so um robot o preenche.
  website: z.string().max(0, 'Pedido recusado').optional().or(z.literal('')),
  // Instante em que a pagina foi carregada, para medir o tempo de preenchimento.
  carregadoEm: z.coerce.number().int().nonnegative().optional(),
  turnstileToken: z.string().max(4000).optional(),
});

export type EntradaLead = z.infer<typeof esquemaLead>;

export type LeadNormalizado = {
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  vertical: Vertical;
  localizacao: string | null;
  mensagem: string | null;
};

function ouNulo(v: string | undefined): string | null {
  const s = (v || '').trim();
  return s.length ? s : null;
}

export function normalizar(entrada: EntradaLead): LeadNormalizado {
  return {
    nome: entrada.nome.trim().replace(/\s+/g, ' '),
    email: entrada.email.trim().toLowerCase(),
    telefone: ouNulo(entrada.telefone),
    empresa: ouNulo(entrada.empresa),
    vertical: entrada.vertical,
    localizacao: ouNulo(entrada.localizacao),
    mensagem: ouNulo(entrada.mensagem),
  };
}

// Chave de deduplicacao: o mesmo email a pedir a mesma coisa no mesmo dia e a
// mesma pessoa a carregar duas vezes no botao, nao dois negocios.
export function chaveDeDuplicado(lead: LeadNormalizado, quando = new Date()): string {
  return `${lead.email}|${lead.vertical}|${quando.toISOString().slice(0, 10)}`;
}

export function preenchidoDepressaDemais(carregadoEm: number | undefined, agora = Date.now()): boolean {
  if (!carregadoEm) return false; // sem relogio do cliente, nao inventamos
  const decorrido = agora - carregadoEm;
  // Um relogio adiantado do lado do cliente daria um valor negativo. Nesse
  // caso nao acusamos: o Turnstile e o limite de ritmo continuam de pe.
  if (decorrido < 0) return false;
  return decorrido < TEMPO_MINIMO_MS;
}

// Texto do email de aviso interno. Fica aqui, e nao na rota, para poder ser
// testado sem levantar meio Next.
export function textoAvisoInterno(lead: LeadNormalizado): string {
  return [
    'Pedido de parceria novo no site.',
    '',
    `Nome: ${lead.nome}`,
    `Email: ${lead.email}`,
    `Telefone: ${lead.telefone || 'não indicado'}`,
    `Empresa: ${lead.empresa || 'não indicada'}`,
    `Tipo de espaço: ${ROTULO_VERTICAL[lead.vertical]}`,
    `Localização: ${lead.localizacao || 'não indicada'}`,
    '',
    'Mensagem:',
    lead.mensagem || '(sem mensagem)',
  ].join('\n');
}

export function textoRespostaAutomatica(lead: LeadNormalizado): string {
  return [
    `Olá ${lead.nome.split(' ')[0]},`,
    '',
    'Recebemos o seu pedido sobre cacifos automáticos e respondemos em dois dias úteis.',
    '',
    'Se entretanto quiser adiantar alguma coisa, responda a este email com o número',
    'aproximado de pessoas que passam pelo espaço num dia cheio e com a época do ano',
    'em que tem mais movimento. São os dois números que mais pesam na proposta.',
    '',
    'Com os melhores cumprimentos,',
    'Lokit',
  ].join('\n');
}
