import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Acessibilidade nas páginas que mais gente vai ver.
//
// Além de ser o correcto, é um dos pontos que câmaras e entidades públicas
// verificam quando avaliam um fornecedor, e este site existe em boa parte para
// ser avaliado por elas.
const PAGINAS = ['/', '/como-funciona', '/parcerias', '/faq', '/contactos'];

for (const caminho of PAGINAS) {
  test(`${caminho} não tem falhas de acessibilidade sérias`, async ({ page }) => {
    await page.goto(caminho);
    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serias = resultado.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''));
    const resumo = serias.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`).join('\n');
    expect(resumo, `falhas em ${caminho}:\n${resumo}`).toBe('');
  });
}

test('a navegação por teclado chega ao conteúdo pelo atalho', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar para o conteúdo' })).toBeFocused();
});
