# Site Lokit

Site institucional e comercial da marca **Lokit**, cacifos automáticos operados
pela **IMOLOCKERS, LDA** (NIPC 519519850).

Fase 0 do plano do site: existir, ser credível e capturar contactos de
parceiros, sem depender das APIs da plataforma de cacifos, que ainda não estão
disponíveis.

## Arrancar

```bash
npm ci
cp .env.local.example .env.local   # preencher o que houver
npm run dev                        # http://localhost:3000
```

Sem nenhuma variável preenchida o site funciona à mesma: as páginas todas
carregam, e o formulário responde com a mensagem honesta de que não conseguiu
registar o pedido. Ver `docs/SETUP.md` para ligar os serviços.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes unitários e de integração (Vitest) |
| `npm run e2e` | Testes de ponta a ponta (Playwright) |
| `npm run typecheck` | Verificação de tipos |
| `npm run lint` | ESLint |
| `npm run test:copy` | Verifica travessões e separadores no texto |
| `npm run build` | Build do Next |
| `npm run cf-build` | Build para Cloudflare Workers |
| `npm run preview` | Corre a build da Cloudflare localmente |
| `npm run deploy` | Publica (normalmente é a CI que o faz) |

## Estrutura

```
app/          páginas e rotas de API
components/   componentes de interface
content/      texto que não é código (perguntas frequentes)
lib/          lógica de servidor
lib/lockers/  camada que isola a plataforma de cacifos
supabase/     esquema da base de dados
tests/        Vitest
e2e/          Playwright
docs/         arquitectura, segurança, operação, decisões
```

## Documentação

- `docs/plano-site.md` o plano do site, em quatro fases
- `docs/SETUP.md` passos de painel, um a um
- `docs/ARCHITECTURE.md` como está montado e porquê
- `docs/SECURITY.md` o que está protegido e como
- `docs/RUNBOOK.md` sintoma e acção quando algo corre mal
- `docs/DECISIONS.md` decisões técnicas com data e razão
- `docs/negocio/` modelo comercial, verticais, fornecedores, legal
