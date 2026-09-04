# Instruções para o Claude neste repositório

## Git

Trabalhar directamente em `main`. Sem branches de funcionalidade, sem PRs,
excepto se o Ruben pedir explicitamente para isolar uma experiência.

- No início da sessão: `git checkout main && git pull --ff-only origin main`
- Depois de cada alteração significativa: `git add`, `git commit`, `git push origin main`
- Conflitos: `git pull --rebase origin main`, resolver, continuar
- Branches criados automaticamente pelo sistema (`claude/...`): ignorar

## Escrita

Todo o texto que uma pessoa possa ler, incluindo copy do site, comentários,
mensagens de erro, emails e páginas legais:

- Português europeu natural. O texto não pode parecer escrito por um modelo.
- **Nunca usar travessões** (o caractere U+2014), travessão curto, ou ponto
  médio em prosa. Separadores são vírgula, dois pontos, parênteses, ou partir a
  frase. Isto é verificado por `npm run test:copy` e pelo `npm test`.
- Variar o ritmo das frases. Evitar tricolons em série e paralelismos perfeitos.
- Negrito com moderação.

## Antes de commitar

```bash
npm run typecheck && npm run lint && npm test
```

Alterações que toquem em páginas ou em cabeçalhos: correr também `npm run e2e`.

## Regras de arquitectura

1. **Nenhum código fala com a plataforma de cacifos directamente.** Tudo passa
   por `lib/lockers/port.ts`. Um adaptador novo tem de passar
   `tests/lockers-contrato.test.ts` antes de ser usado.
2. **Nenhuma escrita falha em silêncio.** Se uma gravação ou um envio falhar,
   chamar `notifyAdmin`.
3. **Nenhum dado pessoal nos logs.** IP como resumo com sal, agente do
   utilizador reduzido a uma classe.
4. **Nenhum URL publicado desaparece sem 301** em `lib/redirects.ts`.
5. **Identidade da empresa só em `lib/company.ts`.** Nunca escrever o NIPC ou a
   firma directamente numa página.
6. **Nenhum segredo no repositório.** Valores públicos em `.env.production`,
   segredos nos secrets do Worker.

## Contexto

A memória do projecto (decisões, pessoas, tarefas, estado da empresa) vive no
repositório `imoboemia`, em `memory/`. O plano deste site está em
`projects/lockers/plano-site.md` desse repositório.
