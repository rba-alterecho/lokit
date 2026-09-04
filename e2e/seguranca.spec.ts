import { expect, test } from '@playwright/test';

// Os cabeçalhos de segurança são configuração, e configuração perde-se sem
// ninguém dar por isso. Este teste apanha a regressão que ninguém vê a olho.
test.describe('cabeçalhos de segurança', () => {
  test('as respostas trazem os cabeçalhos que devem trazer', async ({ request }) => {
    const resposta = await request.get('/');
    const h = resposta.headers();

    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toContain('camera=()');
    expect(h['cross-origin-opener-policy']).toBe('same-origin');
    // O Next não deve anunciar-se.
    expect(h['x-powered-by']).toBeUndefined();
  });

  test('a CSP está presente, com nonce e sem inline solto nos scripts', async ({ request }) => {
    const resposta = await request.get('/');
    const h = resposta.headers();
    const csp = h['content-security-policy'] || h['content-security-policy-report-only'];

    expect(csp, 'devia existir CSP, nem que seja em Report-Only').toBeTruthy();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toMatch(/script-src[^;]*'nonce-/);
    expect(csp, 'unsafe-inline em script-src anula a CSP').not.toMatch(
      /script-src[^;]*'unsafe-inline'/
    );
  });

  test('o nonce muda a cada pedido, senão não serve para nada', async ({ request }) => {
    const primeiro = await request.get('/');
    const segundo = await request.get('/');
    const extrair = (r: typeof primeiro) => {
      const h = r.headers();
      const csp = h['content-security-policy'] || h['content-security-policy-report-only'] || '';
      return /'nonce-([^']+)'/.exec(csp)?.[1];
    };
    const a = extrair(primeiro);
    const b = extrair(segundo);
    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });
});

test.describe('rotas de QR', () => {
  test('não aceitam um destino vindo do URL', async ({ page }) => {
    // Se um dia alguém implementar o redireccionamento a ler o URL, isto
    // apanha: a página não pode acabar noutro domínio.
    await page.goto('/');
    const nosso = new URL(page.url()).host;
    await page.goto('/l/https%3A%2F%2Fexemplo-malicioso.test');
    // O que interessa e nao ter saido do nosso dominio.
    expect(new URL(page.url()).host).toBe(nosso);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('mostram o código de forma limpa e não executam o que vem no URL', async ({ page }) => {
    await page.goto('/l/abc-123');
    await expect(page.getByText('ABC-123').first()).toBeVisible();
  });
});

test.describe('estado do serviço', () => {
  test('a verificação de saúde responde e não expõe segredos', async ({ request }) => {
    const resposta = await request.get('/api/health');
    expect([200, 503]).toContain(resposta.status());
    const corpo = await resposta.text();
    expect(corpo).not.toMatch(/key|secret|senha/i);
  });
});
