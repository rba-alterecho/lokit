import { beforeEach, describe, expect, it, vi } from 'vitest';
import { _limparMemoria } from '@/lib/ratelimit';

// Testes de integracao da rota que recebe os pedidos de parceria.
//
// O que interessa aqui nao e o caminho feliz, e o que acontece quando alguma
// coisa falha: se a base de dados cair, o contacto tem de sobreviver; se o
// Turnstile recusar, nada pode ser gravado; se um robot cair na armadilha,
// nao pode perceber que foi apanhado.

type Erro = { code: string; message: string } | null;

const verificarTurnstile = vi.fn(
  async (_token?: string, _ip?: string): Promise<{ ok: boolean; motivo?: string }> => ({ ok: true })
);
const insert = vi.fn(async (_dados: Record<string, unknown>): Promise<{ error: Erro }> => ({ error: null }));
const sendEmail = vi.fn(async (_args: unknown): Promise<{ ok: boolean; error?: string }> => ({ ok: true }));
const notifyAdmin = vi.fn(async (_assunto: string, _detalhe: string): Promise<void> => {});
const emProducao = vi.fn(() => false);
const turnstileConfigurado = vi.fn(() => true);
const baseDadosConfigurada = vi.fn(() => true);
const emailConfigured = vi.fn(() => true);

vi.mock('@/lib/turnstile', () => ({ verificarTurnstile }));
vi.mock('@/lib/alert', () => ({ notifyAdmin }));
vi.mock('@/lib/email', () => ({
  emailConfigured: () => emailConfigured(),
  sendEmail,
}));
vi.mock('@/lib/supabase-admin', () => ({
  baseDadosConfigurada: () => baseDadosConfigurada(),
  supabaseAdmin: () => ({ from: () => ({ insert }) }),
}));
vi.mock('@/lib/env', async (original) => {
  const real = (await original()) as Record<string, unknown>;
  return {
    ...real,
    emProducao: () => emProducao(),
    servicos: {
      baseDados: () => baseDadosConfigurada(),
      email: () => emailConfigured(),
      turnstile: () => turnstileConfigurado(),
    },
  };
});

const { POST, GET } = await import('@/app/api/leads/route');

const BASE = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.pt',
  vertical: 'praia',
  carregadoEm: 0,
  turnstileToken: 'token-de-teste',
};

function pedido(corpo: unknown, ip = '203.0.113.1') {
  return new Request('https://lokit.pt/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify(corpo),
  });
}

// carregadoEm no passado suficiente para o teste de tempo nao acusar.
function comTempo(extra: Record<string, unknown> = {}) {
  return { ...BASE, carregadoEm: Date.now() - 60_000, ...extra };
}

describe('POST /api/leads', () => {
  beforeEach(() => {
    _limparMemoria();
    vi.clearAllMocks();
    verificarTurnstile.mockResolvedValue({ ok: true });
    insert.mockResolvedValue({ error: null });
    sendEmail.mockResolvedValue({ ok: true });
    emProducao.mockReturnValue(false);
    turnstileConfigurado.mockReturnValue(true);
    baseDadosConfigurada.mockReturnValue(true);
    emailConfigured.mockReturnValue(true);
  });

  it('aceita um pedido válido, grava e avisa', async () => {
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledOnce();
    // Aviso interno e resposta automatica.
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(notifyAdmin).not.toHaveBeenCalled();
  });

  it('nunca guarda o IP em bruto', async () => {
    await POST(pedido(comTempo(), '198.51.100.7'));
    const gravado = insert.mock.calls[0][0];
    expect(JSON.stringify(gravado)).not.toContain('198.51.100.7');
    expect(String(gravado.ip_hash)).toMatch(/^[0-9a-f]{32}$/);
  });

  it('devolve 400 e identifica os campos com erro', async () => {
    const res = await POST(pedido(comTempo({ email: 'isto-nao-e-um-email' })));
    expect(res.status).toBe(400);
    const corpo = (await res.json()) as { campos?: Record<string, string> };
    expect(corpo.campos?.email).toBeTruthy();
    expect(insert).not.toHaveBeenCalled();
  });

  it('engole o robot que cai no campo-armadilha, sem lhe dizer que foi apanhado', async () => {
    const res = await POST(pedido(comTempo({ website: 'http://spam.example' })));
    // 400 pelo esquema, e nada gravado. O importante e nao passar da porta.
    expect(insert).not.toHaveBeenCalled();
    expect([200, 400]).toContain(res.status);
  });

  it('responde sucesso a quem submete em menos de dois segundos, mas não grava nada', async () => {
    const res = await POST(pedido({ ...BASE, carregadoEm: Date.now() - 100 }));
    expect(res.status).toBe(200);
    expect(insert).not.toHaveBeenCalled();
  });

  it('recusa com 403 quando o Turnstile não confirma, e não grava', async () => {
    verificarTurnstile.mockResolvedValue({ ok: false, motivo: 'invalid-input-response' });
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(403);
    expect(insert).not.toHaveBeenCalled();
  });

  it('em produção, sem Turnstile configurado, fecha o formulário e alerta', async () => {
    turnstileConfigurado.mockReturnValue(false);
    emProducao.mockReturnValue(true);
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(503);
    expect(notifyAdmin).toHaveBeenCalledOnce();
    expect(insert).not.toHaveBeenCalled();
  });

  it('trava ao sexto pedido do mesmo sítio na mesma hora', async () => {
    for (let i = 0; i < 5; i++) {
      const ok = await POST(pedido(comTempo({ email: `p${i}@exemplo.pt` }), '203.0.113.9'));
      expect(ok.status).toBe(200);
    }
    const travado = await POST(pedido(comTempo({ email: 'p6@exemplo.pt' }), '203.0.113.9'));
    expect(travado.status).toBe(429);
    expect(travado.headers.get('Retry-After')).toBeTruthy();
  });

  it('se a base de dados falhar, o lead segue por email e o alerta dispara', async () => {
    insert.mockResolvedValue({ error: { code: '08006', message: 'ligação perdida' } });
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(200);
    expect(notifyAdmin).toHaveBeenCalledOnce();
    // O alerta leva o lead inteiro, para o contacto não se perder.
    expect(notifyAdmin.mock.calls[0][1]).toContain('maria@exemplo.pt');
  });

  it('um duplo clique não cria dois registos nem duas respostas automáticas', async () => {
    insert.mockResolvedValue({ error: { code: '23505', message: 'duplicate key' } });
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(200);
    expect(notifyAdmin).not.toHaveBeenCalled();
    // Só o aviso interno; a pessoa não recebe a mesma confirmação duas vezes.
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('sem base de dados e sem email, admite a falha em vez de mentir', async () => {
    baseDadosConfigurada.mockReturnValue(false);
    emailConfigured.mockReturnValue(false);
    const res = await POST(pedido(comTempo()));
    expect(res.status).toBe(500);
    expect(notifyAdmin).toHaveBeenCalledOnce();
  });

  it('recusa corpo que não seja JSON', async () => {
    const res = await POST(
      new Request('https://lokit.pt/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: 'isto não é json',
      })
    );
    expect(res.status).toBe(400);
  });
});

describe('GET /api/leads', () => {
  it('responde 405 sem explicações a quem anda a sondar', () => {
    expect(GET().status).toBe(405);
  });
});
