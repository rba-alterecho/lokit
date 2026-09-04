import { defineConfig, devices } from '@playwright/test';

// Corre contra um servidor local por defeito. Em CI, apontar para a
// pre-visualizacao com BASE_URL=https://... (ver .github/workflows/e2e.yml).
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';

// Alguns ambientes ja trazem o Chromium instalado noutro sitio (containers de
// desenvolvimento, runners partilhados). Quando PLAYWRIGHT_CHROMIUM_PATH
// estiver definida, usa-se esse binario em vez de descarregar outro; na CI a
// variavel nao existe e o Playwright usa o que ele proprio instalou.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } },
    { name: 'movel', use: { ...devices['Pixel 7'], launchOptions: { executablePath } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
