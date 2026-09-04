import { describe, expect, it } from 'vitest';
import {
  chaveDeDuplicado,
  esquemaLead,
  normalizar,
  preenchidoDepressaDemais,
  textoAvisoInterno,
  textoRespostaAutomatica,
  TEMPO_MINIMO_MS,
} from '@/lib/leads';

const valido = {
  nome: 'Maria Silva',
  email: 'MARIA@Exemplo.PT',
  vertical: 'praia' as const,
};

describe('validação do pedido de parceria', () => {
  it('aceita o mínimo indispensável', () => {
    const r = esquemaLead.parse(valido);
    expect(r.email).toBe('maria@exemplo.pt');
  });

  it('recusa email mal formado', () => {
    expect(() => esquemaLead.parse({ ...valido, email: 'maria arroba exemplo' })).toThrow();
  });

  it('recusa nome demasiado curto', () => {
    expect(() => esquemaLead.parse({ ...valido, nome: 'M' })).toThrow();
  });

  it('recusa uma vertical que não existe', () => {
    expect(() => esquemaLead.parse({ ...valido, vertical: 'aeroporto' })).toThrow();
  });

  it('recusa mensagens acima do limite', () => {
    expect(() => esquemaLead.parse({ ...valido, mensagem: 'a'.repeat(4001) })).toThrow();
  });

  it('recusa o campo-armadilha preenchido', () => {
    expect(() => esquemaLead.parse({ ...valido, website: 'http://spam.example' })).toThrow();
  });
});

describe('normalização', () => {
  it('limpa espaços a mais e põe o email em minúsculas', () => {
    const lead = normalizar(esquemaLead.parse({ ...valido, nome: '  Maria   Silva  ' }));
    expect(lead.nome).toBe('Maria Silva');
    expect(lead.email).toBe('maria@exemplo.pt');
  });

  it('transforma campos opcionais vazios em nulo, e não em string vazia', () => {
    const lead = normalizar(esquemaLead.parse({ ...valido, telefone: '   ', empresa: '' }));
    expect(lead.telefone).toBeNull();
    expect(lead.empresa).toBeNull();
  });
});

describe('duplicados', () => {
  it('a mesma pessoa, no mesmo dia, para a mesma vertical, dá a mesma chave', () => {
    const lead = normalizar(esquemaLead.parse(valido));
    const dia = new Date('2026-09-01T10:00:00Z');
    const outraHora = new Date('2026-09-01T23:30:00Z');
    expect(chaveDeDuplicado(lead, dia)).toBe(chaveDeDuplicado(lead, outraHora));
  });

  it('no dia seguinte já é um pedido novo', () => {
    const lead = normalizar(esquemaLead.parse(valido));
    expect(chaveDeDuplicado(lead, new Date('2026-09-01T10:00:00Z'))).not.toBe(
      chaveDeDuplicado(lead, new Date('2026-09-02T10:00:00Z'))
    );
  });
});

describe('tempo de preenchimento', () => {
  const agora = 1_000_000;

  it('acusa quem submete instantaneamente', () => {
    expect(preenchidoDepressaDemais(agora - 200, agora)).toBe(true);
  });

  it('deixa passar quem demorou o tempo de uma pessoa', () => {
    expect(preenchidoDepressaDemais(agora - TEMPO_MINIMO_MS - 1, agora)).toBe(false);
  });

  it('não acusa quando o cliente não enviou relógio nenhum', () => {
    expect(preenchidoDepressaDemais(undefined, agora)).toBe(false);
  });

  it('não acusa com relógio do cliente adiantado', () => {
    expect(preenchidoDepressaDemais(agora + 60_000, agora)).toBe(false);
  });
});

describe('textos dos emails', () => {
  it('o aviso interno leva o lead completo, para o contacto não se perder se a base de dados falhar', () => {
    const lead = normalizar(esquemaLead.parse({ ...valido, telefone: '910000000', mensagem: 'Olá' }));
    const texto = textoAvisoInterno(lead);
    expect(texto).toContain('maria@exemplo.pt');
    expect(texto).toContain('910000000');
    expect(texto).toContain('Olá');
  });

  it('a resposta automática trata a pessoa pelo primeiro nome', () => {
    const lead = normalizar(esquemaLead.parse(valido));
    expect(textoRespostaAutomatica(lead)).toContain('Olá Maria,');
  });
});
