import next from 'eslint-config-next';

// Configuracao plana (o formato do ESLint 9). O eslint-config-next 16 ja
// exporta neste formato, portanto nao ha necessidade de camadas de
// compatibilidade, que alias rebentavam com uma estrutura circular.
const config = [
  ...next,
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
];

export default config;
