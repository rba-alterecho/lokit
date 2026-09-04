#!/usr/bin/env node
// Verificacao do texto que os humanos leem.
//
// Existe porque a regra "sem travessoes, portugues europeu natural" so e
// respeitada se for verificada. Uma regra que depende de alguem se lembrar
// falha ao terceiro ficheiro escrito a pressa.
//
// Corre pelo `npm test` (tests/copy.test.ts) e tambem sozinho:
//   node scripts/verificar-copy.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ_PADRAO = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const PASTAS = ['app', 'components', 'content', 'lib'];
const EXTENSOES = new Set(['.ts', '.tsx', '.md', '.mdx']);

// Caracteres que denunciam texto gerado ou copiado de um processador de texto.
const PROIBIDOS = [
  { char: '—', nome: 'travessão longo (—)', dica: 'usar vírgula, dois pontos, parênteses, ou partir a frase' },
  { char: '–', nome: 'travessão curto (–)', dica: 'usar vírgula ou "a" em intervalos: de 10 a 12' },
  { char: '·', nome: 'ponto médio (·)', dica: 'usar vírgula: Nome, papel' },
];

function ficheiros(dir) {
  const encontrados = [];
  let entradas;
  try {
    entradas = readdirSync(dir);
  } catch {
    return encontrados;
  }
  for (const entrada of entradas) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) {
      encontrados.push(...ficheiros(caminho));
    } else if (EXTENSOES.has(extname(caminho))) {
      encontrados.push(caminho);
    }
  }
  return encontrados;
}

export function verificarCopy(raiz = RAIZ_PADRAO) {
  const problemas = [];
  for (const pasta of PASTAS) {
    for (const ficheiro of ficheiros(join(raiz, pasta))) {
      const conteudo = readFileSync(ficheiro, 'utf8');
      const linhas = conteudo.split('\n');
      linhas.forEach((linha, i) => {
        for (const proibido of PROIBIDOS) {
          // A propria lista de proibidos contem os caracteres, por razoes
          // obvias. Sem esta excepcao o verificador acusava-se a si proprio.
          if (ficheiro.endsWith('verificar-copy.mjs')) continue;
          if (linha.includes(proibido.char)) {
            problemas.push({
              ficheiro: relative(raiz, ficheiro),
              linha: i + 1,
              problema: proibido.nome,
              dica: proibido.dica,
              excerto: linha.trim().slice(0, 100),
            });
          }
        }
      });
    }
  }
  return problemas;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problemas = verificarCopy();
  if (problemas.length === 0) {
    console.log('Copy verificada: sem travessões nem separadores estranhos.');
    process.exit(0);
  }
  for (const p of problemas) {
    console.error(`${p.ficheiro}:${p.linha}  ${p.problema}\n    ${p.excerto}\n    ${p.dica}`);
  }
  console.error(`\n${problemas.length} ocorrência(s). Ver a regra de escrita no CLAUDE.md.`);
  process.exit(1);
}
