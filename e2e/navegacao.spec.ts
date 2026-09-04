import { expect, test } from '@playwright/test';

const PAGINAS = [
  '/',
  '/como-funciona',
  '/parcerias',
  '/locais',
  '/sobre',
  '/contactos',
  '/faq',
  '/ajuda',
  '/termos',
  '/privacidade',
  '/cookies',
];

test.describe('navegação', () => {
  for (const caminho of PAGINAS) {
    test(`${caminho} carrega, tem título e não deixa erros na consola`, async ({ page }) => {
      const erros: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error') erros.push(m.text());
      });
      page.on('pageerror', (e) => erros.push(e.message));

      const resposta = await page.goto(caminho);
      expect(resposta?.status(), `${caminho} devia responder 200`).toBe(200);

      // Um h1 por página, que é o que os leitores de ecrã e os motores de
      // busca usam para perceber onde estão.
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/.{10,}/);

      const descricao = page.locator('meta[name="description"]');
      await expect(descricao).toHaveAttribute('content', /.{40,}/);

      expect(erros, `erros de consola em ${caminho}:\n${erros.join('\n')}`).toEqual([]);
    });
  }

  test('o cabeçalho leva às páginas principais', async ({ page }) => {
    await page.goto('/');

    // Em ecrãs pequenos a navegação vive dentro do menu, que é um <details>
    // e por isso funciona mesmo sem JavaScript.
    const menu = page.getByRole('banner').getByText('Menu', { exact: true });
    if (await menu.isVisible()) await menu.click();

    await page.getByRole('banner').getByRole('link', { name: 'Para parceiros' }).click();
    await expect(page).toHaveURL(/\/parcerias/);
    await expect(page.locator('h1')).toContainText('espaço');
  });

  test('a ação principal do cabeçalho leva ao formulário', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Quero cacifos/ }).first().click();
    await expect(page.locator('#pedido')).toBeVisible();
  });

  test('um endereço inventado devolve 404 e oferece saídas', async ({ page }) => {
    const resposta = await page.goto('/pagina-que-nao-existe');
    expect(resposta?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'Ir para o início' })).toBeVisible();
  });

  test('robots e sitemap estão disponíveis e concordam um com o outro', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    const textoRobots = await robots.text();
    expect(textoRobots).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const caminho of ['/parcerias', '/como-funciona', '/privacidade']) {
      expect(xml, `${caminho} devia estar no sitemap`).toContain(caminho);
    }
  });

  test('o rodapé identifica a empresa, como a lei exige', async ({ page }) => {
    await page.goto('/');
    const rodape = page.locator('footer');
    await expect(rodape).toContainText('IMOLOCKERS, LDA');
    await expect(rodape).toContainText('519519850');
  });
});
