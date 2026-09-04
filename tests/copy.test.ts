import { describe, expect, it } from 'vitest';
import { verificarCopy } from '../scripts/verificar-copy.mjs';

// O teste de conteudo que impede a regressao mais repetida deste projecto.
// Ver docs/DECISIONS.md, entrada sobre escrita.
describe('texto do site', () => {
  it('não tem travessões nem separadores de texto gerado', () => {
    const problemas = verificarCopy() as { ficheiro: string; linha: number; problema: string }[];
    const resumo = problemas.map((p) => `${p.ficheiro}:${p.linha} ${p.problema}`).join('\n');
    expect(resumo).toBe('');
  });
});
