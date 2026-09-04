import { expect, test } from '@playwright/test';

test.describe('formulário de parcerias', () => {
  test('tem os campos com etiqueta e o campo-armadilha escondido', async ({ page }) => {
    await page.goto('/parcerias#pedido');

    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Tipo de espaço')).toBeVisible();

    // A armadilha tem de estar no HTML e invisível para pessoas.
    const armadilha = page.locator('input[name="website"]');
    await expect(armadilha).toHaveCount(1);
    await expect(armadilha).toBeHidden();
  });

  test('mostra o erro no campo quando falta informação obrigatória', async ({ page }) => {
    await page.goto('/parcerias#pedido');
    await page.getByRole('button', { name: 'Enviar pedido' }).click();
    // A validação é feita no servidor, para as mensagens saírem em português e
    // não na língua do navegador de cada pessoa.
    await expect(page.getByText('Diga-nos como se chama')).toBeVisible();
    await expect(page.getByLabel('Nome')).toHaveAttribute('aria-invalid', 'true');
  });

  test('a API recusa um pedido mal formado', async ({ request }) => {
    const resposta = await request.post('/api/leads', {
      data: { nome: 'x', email: 'não é email', vertical: 'praia' },
    });
    expect(resposta.status()).toBe(400);
    const corpo = (await resposta.json()) as { campos?: Record<string, string> };
    expect(corpo.campos).toBeTruthy();
  });

  test('a API recusa métodos que não usa', async ({ request }) => {
    const resposta = await request.get('/api/leads');
    expect(resposta.status()).toBe(405);
  });
});
