#!/usr/bin/env node
// Le a saida JSON do `npm audit --omit=dev` e falha se houver avisos que nao
// estejam na lista de excepcoes, ou se alguma excepcao tiver passado do prazo.
//
// Porque nao usar so o `npm audit --audit-level`: porque isso ou passa tudo ou
// falha tudo. O que queremos e um portao com memoria, onde cada excepcao tem
// dono, razao e data de revisao.
import { readFileSync } from 'node:fs';

const ficheiroLista = process.argv[2];
const lista = JSON.parse(readFileSync(ficheiroLista, 'utf8'));
const excepcoes = new Map((lista.excepcoes || []).map((e) => [e.id, e]));

let entrada = '';
process.stdin.setEncoding('utf8');
for await (const parte of process.stdin) entrada += parte;

let relatorio;
try {
  relatorio = JSON.parse(entrada || '{}');
} catch {
  console.error('Não foi possível ler a saída do npm audit.');
  process.exit(1);
}

const hoje = new Date();
const problemas = [];
const usadas = new Set();

for (const [nome, aviso] of Object.entries(relatorio.vulnerabilities || {})) {
  if (!['high', 'critical', 'moderate'].includes(aviso.severity)) continue;

  const ids = (aviso.via || [])
    .filter((v) => typeof v === 'object' && v.url)
    .map((v) => String(v.url).split('/').pop());

  const excepcao = ids.map((id) => excepcoes.get(id)).find(Boolean) || excepcoes.get(nome);

  if (!excepcao) {
    problemas.push(`${nome} (${aviso.severity}) ${ids.join(', ')}`);
    continue;
  }

  usadas.add(excepcao.id);
  if (excepcao.rever && new Date(excepcao.rever) < hoje) {
    problemas.push(`${nome}: excepção expirou em ${excepcao.rever} (${excepcao.razao || 'sem razão registada'})`);
  }
}

for (const [id, excepcao] of excepcoes) {
  if (!usadas.has(id)) {
    console.log(`Nota: a excepção ${id} já não corresponde a nenhum aviso e pode ser removida.`);
    void excepcao;
  }
}

if (problemas.length) {
  console.error('Vulnerabilidades em dependências de produção sem excepção registada:\n');
  for (const p of problemas) console.error(`  ${p}`);
  console.error('\nDecidir: actualizar, substituir, ou registar excepção com razão e data em .github/audit-allowlist.json');
  process.exit(1);
}

console.log('Sem vulnerabilidades novas em dependências de produção.');
