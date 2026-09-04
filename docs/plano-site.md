# Plano do Site Lokit (IMOLOCKERS, LDA)

> **Estado**: fase 0 executada a 2026-09-04. As fases 1 a 3 continuam por fazer.
> **Ambito**: site institucional e comercial da marca **Lokit**, operada pela **IMOLOCKERS, LDA**.
> **Infra**: repositorio GitHub proprio e conta Cloudflare propria, so da empresa.
> **Premissa**: ainda **nao ha acesso as APIs da MicroIO**. O site tem de nascer util sem elas
> e absorve-las depois sem reescrita.

---

## 0. Resumo executivo

O objectivo imediato nao e vender online, e **existir**: ter um dominio com historico,
paginas reais indexadas, e uma presenca que aguente escrutinio de uma camara municipal,
de uma concessao de praia ou de um grupo de discotecas. Isso e credibilidade, e credibilidade
demora tempo a acumular, portanto comeca hoje.

O plano tem quatro fases:

| Fase | Quando | O que entrega | Esforco |
|---|---|---|---|
| **0. Fundacao** | Semanas 1 a 2 | Infra propria (GitHub, Cloudflare, dominios), 7 paginas, formulario B2B a funcionar, legal, SEO base, CI com testes | 3 a 4 dias |
| **1. Autoridade** | Semanas 3 a 6 | Paginas por vertical, blog, versao EN, mapa "em preparacao", data room privado | 4 a 5 dias |
| **2. Primeira unidade** | Quando houver piloto | Paginas de unidade, rotas de QR code operacionais, Google Business Profile, precos reais | 2 a 3 dias |
| **3. Integracao MicroIO** | Quando houver API | Disponibilidade em tempo real, estado das portas, conta de utilizador, faturacao | 5 a 8 dias |

Tres decisoes estruturantes que se tomam **agora** porque sao caras de mudar depois:

1. **As rotas de QR code sao nossas** (`lokit.pt/l/<codigo>`). O QR vai impresso no hardware.
   Se apontar para um dominio da MicroIO, ficamos presos ao fornecedor e um dia de mudanca
   de plataforma custa reimprimir todos os cacifos.
2. **O acesso a plataforma de cacifos vive atras de uma interface nossa** (porta e adaptadores).
   Hoje ha um adaptador falso com dados de exemplo; amanha entra o adaptador MicroIO; se um dia
   houver segundo fornecedor, entra ao lado. O site nunca fala directamente com a API deles.
3. **CSP com nonce desde o primeiro commit.** Acrescentar Content-Security-Policy a um site
   ja feito parte producao com facilidade, e por isso costuma ficar para depois e nunca sair.
   Num site novo custa uma tarde e fecha a categoria inteira de injeccao de scripts.

---

## 1. Premissas, objectivos e nao objectivos

### Objectivos
- **Idade e historico online.** Dominio a servir conteudo real, indexado, com actualizacoes regulares.
- **Credibilidade B2B.** O visitante-alvo desta fase e quem decide uma localizacao: concessionario
  de praia, camara, dono de bar, produtor de eventos, farmacia. Tem de encontrar quem somos,
  o que instalamos, como se ganha dinheiro com isto, e como falar connosco.
- **Captura de leads.** Um formulario que chega a alguem e nao se perde.
- **Base tecnica que aguenta o produto.** Quando a MicroIO abrir a API, o site passa a mostrar
  unidades, disponibilidade e, eventualmente, a suportar o fluxo de aluguer.

### Nao objectivos (por agora)
- Nao vendemos nada online na fase 0. Sem checkout, sem contas de utilizador, sem dados de cartao.
- Nao publicamos precos B2C ao publico antes de existir uma unidade instalada. Faixas indicativas
  na conversa comercial, sim; tabela publica, nao.
- Nao replicamos o painel de gestao da MicroIO. O nosso admin serve para leads e conteudo.

### Restricoes conhecidas
- Marca operacional **Lokit**, firma legal **IMOLOCKERS, LDA** (NIPC 519519850, sede em Coimbra).
  Rodape e paginas legais usam a firma; a comunicacao usa a marca.
- Dominios ja comprados: `lokitlockers.com` e `lokit.pt`.
- Cap table 45/45/10, com gerente unico designado. Detalhe em `docs/negocio/pacto-social.md`.
- Registo definitivo da sociedade e registo de marca no INPI ainda pendentes. O site pode arrancar
  na mesma, mas ha texto legal que so fica definitivo depois (ver seccao 9).

---

## 2. Infraestrutura e propriedade das contas

Isto vem primeiro porque e o que se estraga mais caro. Numa sociedade a tres, contas em nome
pessoal sao uma divida futura.

### 2.1 GitHub
- **Organizacao nova** `imolockers` (ou `lokit`), e nao a conta pessoal de um socio.
  Repositorio privado no arranque, com hipotese de o tornar publico mais tarde.
- **2FA obrigatoria** ao nivel da organizacao.
- **Proteccao do ramo `main`**: exigir que a CI passe antes do job de deploy; nao permitir
  force-push nem apagar o ramo.
- **Secret scanning e push protection** ligados (impede commitar chaves por acidente).
- **Permissoes das Actions** em leitura por defeito; escrita so onde for preciso.
- **Actions fixadas por SHA**, nao por tag movel. Uma tag `@v5` pode ser reapontada por quem
  a controla; um SHA nao muda.
- `CODEOWNERS` com um responsavel, para que qualquer alteracao gere revisao.

### 2.2 Cloudflare
- **Conta nova da empresa**, criada com um endereco de grupo (`info@lokit.pt`), nao com o email
  pessoal de um socio. Se amanha alguem sair, a conta nao sai com ele.
- **2FA obrigatoria**, membros com papeis minimos (Administrator ou Analytics, conforme a
  necessidade real de cada um).
- **Token de deploy com ambito minimo** (Workers Scripts: Edit sobre esta conta), guardado nos
  secrets do GitHub. Nunca a Global API Key.
- DNS dos dois dominios na Cloudflare, com **DNSSEC**, **registos CAA**, SSL em **Full (strict)**,
  **Always Use HTTPS** e **TLS minimo 1.2**.
- **Email Routing** nos dois dominios (catch-all para o inbox pessoal), como ja esta planeado
  na tarefa de email. Envio outbound por **Mailjet** com SPF, DKIM e DMARC.

### 2.3 Restantes servicos
| Servico | Uso | Nota |
|---|---|---|
| Supabase | Base de dados dos leads e, mais tarde, conteudo dinamico | Projecto em **regiao UE** (Frankfurt). Conta da empresa |
| Mailjet | Envio de emails transaccionais (aviso de lead, resposta automatica) | Plano gratuito chega (200/dia) |
| Cloudflare Turnstile | Anti-bot nos formularios | Gratuito, sem cookies de consentimento |
| Cloudflare Web Analytics | Metricas de visitas | Sem cookies, logo sem banner e sem capitulo de RGPD extra |
| Cloudflare Access (Zero Trust) | Proteccao do `/admin` e do data room | Gratuito ate 50 utilizadores |
| Monitor externo (Better Stack ou UptimeRobot) | Verifica `/api/health` de 5 em 5 minutos | Gratuito |

**Custo mensal estimado: 0 a 30 euros.** Dominios ja pagos. O escalao pago do Cloudflare Workers
(5 dolares) so faz falta acima de 100 mil pedidos por dia; o Supabase Pro (25 dolares) so quando
houver dados reais que justifiquem backups com recuperacao ponto-a-ponto.

### 2.4 Gestao de acessos
- Inventario escrito de quem tem acesso a que (GitHub, Cloudflare, Supabase, Mailjet, registrar,
  Revolut), guardado no gestor de passwords partilhado.
- Procedimento de saida de socio ou colaborador: revogar em todos os servicos da lista, rodar
  os segredos que a pessoa possa ter visto.
- Chave de emergencia: pelo menos dois socios conseguem entrar na conta Cloudflare e no GitHub.

---

## 3. Dominios, canonico e redireccionamentos

**Recomendacao: `lokit.pt` e o dominio canonico.** O site vive la, o negocio e em Portugal,
o `.pt` da sinal de proximidade a quem decide localizacoes (camaras, concessoes, comercio local).
O `lokitlockers.com` faz **301 permanente** para o `.pt`, protege a marca e apanha trafego
internacional. E o padrao habitual: dominio nacional canonico, `.com` a redirigir.

Regras:
- Apex `lokit.pt` como canonico; `www.lokit.pt` redirige para o apex (escolher um e nunca servir os dois).
- Todo o trafego forcado para HTTPS.
- Tabela de redireccionamentos versionada em `lib/redirects.ts`. **Nenhum URL publicado e apagado
  sem um 301 no lugar dele.** Um 404 num link que ja circulou custa posicionamento e confianca.
- Etiqueta `<link rel="canonical">` em todas as paginas, sempre para o `.pt`.

---

## 4. Stack tecnica

### Escolha
**Next.js 16 (App Router) + TypeScript + Tailwind v4, publicado em Cloudflare Workers via
`@opennextjs/cloudflare`, com Supabase (Postgres) para dados.**

E a mesma stack de outros projectos da equipa. Nao e falta de imaginacao, e uma regra assumida:
nao multiplicar padroes. Ganhamos os modulos ja pensados (`company.ts`, `env.ts`, `alert.ts`,
`email.ts`, `seo.ts`, `i18n.ts`), um formato de CI que ja funciona, e a capacidade de resolver
um problema em producao sem reaprender a plataforma.

**Alternativa considerada**: Astro estatico em Cloudflare Pages. Seria mais leve e mais rapido
para paginas puramente informativas. Rejeitada porque o site vai precisar de backend real
(leads hoje, unidades e disponibilidade amanha, fluxo de aluguer depois) e a migracao a meio
custaria mais do que a diferenca de peso. Mitiga-se o peso do Next renderizando as paginas de
marketing como estaticas e mantendo o JavaScript do cliente ao minimo.

### Regras de renderizacao
- Paginas de marketing: **estaticas** (`force-static`), revalidadas por reconstrucao.
- Paginas de unidade (fase 2): estaticas com revalidacao periodica; a disponibilidade em tempo
  real, quando existir, chega por chamada do cliente a nossa API, nunca directamente a MicroIO.
- Componentes de cliente so onde ha interaccao real (menu movel, formulario, mapa). Tudo o resto
  e servidor.
- **Orcamento de desempenho**: LCP abaixo de 2,0 s em 4G, JavaScript inicial abaixo de 120 KB,
  zero fontes externas bloqueantes (fontes proprias, `font-display: swap`).

### Estrutura do repositorio
```
lokit-site/
  .github/
    workflows/ci.yml, security-audit.yml, links.yml, lighthouse.yml
    audit-allowlist.json
    scripts/audit-check.mjs
  app/
    (site)/                 paginas publicas PT
    en/                     espelho EN
    l/[codigo]/             destino dos QR codes
    api/                    route handlers
    admin/                  atras de Cloudflare Access
    sitemap.ts, robots.ts, not-found.tsx
  components/
  content/                  copy e artigos (MDX ou TS tipado)
  lib/
    company.ts env.ts alert.ts email.ts turnstile.ts ratelimit.ts
    seo.ts i18n.ts redirects.ts log.ts leads.ts
    lockers/                port.ts types.ts fake.ts microio.ts index.ts
  messages/pt.json en.json
  public/
  supabase/database.sql migrations/
  tests/                    unitarios e integracao (Vitest)
  e2e/                      Playwright
  docs/ARCHITECTURE.md RUNBOOK.md SECURITY.md SETUP.md DECISIONS.md
  next.config.ts open-next.config.ts wrangler.jsonc vitest.config.ts playwright.config.ts
```

`docs/DECISIONS.md` guarda as decisoes tecnicas do site com data e racional, no mesmo espirito
do proprio repositorio: quem chegar daqui a seis meses precisa de saber porque e que as coisas
estao como estao, e nao so que estao.

---

## 5. Navegacao e arquitectura de informacao

### 5.1 Principio
Quem chega ao site esta numa de tres situacoes: **tem um cacifo a frente e precisa de ajuda**,
**esta a pensar por cacifos no espaco dele**, ou **quer perceber quem somos**. A navegacao existe
para separar estes tres caminhos em menos de tres segundos, nao para exibir tudo o que temos.

Regra: **cinco entradas no cabecalho, no maximo**, uma unica accao principal, e o rodape a servir
de mapa completo do site.

### 5.2 Mapa do site

**Fase 0 e 1 (sem unidades instaladas)**

| URL | Pagina | Publico | Objectivo da pagina |
|---|---|---|---|
| `/` | Inicio | Todos | Dizer o que e em cinco segundos e encaminhar para parceiros ou para "como funciona" |
| `/como-funciona` | Como funciona | B2C e B2B | Explicar o fluxo (QR, pagamento, abertura) e a tecnologia sem cadeado |
| `/parcerias` | Para parceiros | B2B | Os tres modelos comerciais, o que o parceiro poe e o que recebe, formulario |
| `/parcerias/praias-e-concessoes` | Vertical praia | Concessoes, camaras | Argumento especifico, sazonalidade, obrigacoes, licenciamento |
| `/parcerias/bares-e-discotecas` | Vertical nocturna | Bares, discotecas | Bengaleiro sem fila, sem pessoal, receita partilhada |
| `/parcerias/eventos-e-festivais` | Vertical eventos | Produtoras | Unidades temporarias, logistica, escala por contentor |
| `/parcerias/comercio-e-servicos` | Vertical comercio | Farmacias, ginasios, lojas | Prestacao de servico com valor mensal fixo |
| `/sobre` | Quem somos | Todos | Empresa, socios, fornecedor, seriedade. Muito importante para credibilidade B2B |
| `/contactos` | Contactos | Todos | Formulario, email, telefone, morada da sede, horario |
| `/faq` | Perguntas frequentes | B2C e B2B | Objeccoes reais, com marcacao FAQPage para os motores de busca |
| `/blog` e `/blog/[artigo]` | Blog | SEO | Artigos que geram historico e captam pesquisa organica |
| `/locais` | Onde estamos | B2C | Fase 0 e 1: pagina honesta de "primeiras unidades em preparacao" com formulario de aviso |
| `/termos`, `/privacidade`, `/cookies` | Legal | Todos | Obrigatorio, e sinal de seriedade |
| `/l/[codigo]` | Destino de QR | B2C no local | Fase 0 e 1: instrucoes e contacto de apoio. Fase 3: fluxo de aluguer |
| `/ajuda` | Apoio | B2C no local | Pagina curta, carregada em segundos, para quem esta com um problema a frente do cacifo |

**Fase 2 e 3 (com unidades)**

| URL | Pagina | Nota |
|---|---|---|
| `/locais` | Mapa e lista de unidades | Passa a ser um dos itens principais do cabecalho |
| `/locais/[cidade]` | Unidades por cidade | Boa para pesquisa local ("cacifos praia da tocha") |
| `/locais/[cidade]/[unidade]` | Ficha de unidade | Morada, fotos, tamanhos, precos, horario, disponibilidade, marcacao LocalBusiness |
| `/precos` | Precos | So quando forem reais e estaveis |
| `/conta` | Area do utilizador | Historico de alugueres e recibos. Depende da API MicroIO |
| `/estado` | Estado do servico | Pagina de incidentes, util quando ha unidades a serio |

### 5.3 Cabecalho

- **Fase 0 e 1**: `Como funciona` | `Para parceiros` | `Sobre` | `Contactos` + botao **"Quero cacifos no meu espaco"**.
- **Fase 2 em diante**: `Locais` | `Como funciona` | `Precos` | `Para parceiros` + botao **"Falar connosco"**.
- Seletor PT/EN a direita, discreto, que **mantem a rota** (de `/parcerias` vai para `/en/partners`, nao para a raiz).
- Em movel: menu de gaveta com os mesmos itens, um nivel apenas, sem submenus dentro de submenus.
- O logotipo volta sempre a raiz. O botao principal repete-se no fim de cada pagina.

### 5.4 Rodape (mapa completo)
Quatro colunas: **Servico** (como funciona, locais, precos, ajuda), **Parcerias** (geral e as quatro
verticais), **Empresa** (sobre, blog, contactos, trabalha connosco quando fizer sentido),
**Legal** (termos, privacidade, cookies, livro de reclamacoes, resolucao de litigios).
Por baixo: firma completa, NIPC, sede, e um aviso de que Lokit e a marca comercial da IMOLOCKERS, LDA.

### 5.5 Regras transversais de navegacao
- **Migalhas de pao** (breadcrumbs) em tudo o que esteja abaixo do primeiro nivel, com marcacao
  `BreadcrumbList`.
- **404 util**: pesquisa, ligacoes para as quatro paginas mais visitadas, e contacto. Nunca um beco.
- **Uma unica accao principal por pagina.** Duas accoes com o mesmo peso visual e o mesmo que nenhuma.
- **Sem carrossel automatico** na pagina inicial. Come desempenho, esconde conteudo dos motores de
  busca e ninguem espera pelo terceiro slide.
- **Sem menus suspensos no cabecalho** enquanto houver menos de dez paginas. As verticais chegam-se
  pela pagina `/parcerias`.
- Ligacoes internas em texto corrido entre paginas relacionadas: e o que distribui autoridade de
  pesquisa e o que faz o visitante ficar.

### 5.6 As rotas de QR code
Decisao estruturante, ja referida no resumo. Detalhe:

- Formato: `https://lokit.pt/l/<codigo>` onde `<codigo>` identifica **a unidade** (e mais tarde
  a porta, se precisarmos).
- Hoje, essa rota serve uma pagina de instrucoes com o contacto de apoio e o estado da unidade.
- Amanha, redirige ou aloja o fluxo de aluguer da plataforma.
- O destino de cada codigo vive **numa tabela na base de dados**, nunca no URL. Isto evita
  redireccionamento aberto (um atacante nao consegue transformar `lokit.pt/l/...` num link
  para o site dele) e permite mudar de plataforma sem tocar no hardware.
- Cada leitura regista um evento anonimo (codigo, data, pais, tipo de dispositivo) para sabermos
  quantas pessoas leem o QR e nao alugam, que e a metrica mais reveladora do negocio.
- Um segundo autocolante com `lokit.pt/ajuda` para problemas, separado do fluxo de compra.

---

## 6. URLs, idiomas e presenca em motores de busca

### 6.1 URLs
- Minusculas, sem acentos, com hifens, curtas e estaveis. `/parcerias/praias-e-concessoes`, nao
  `/parcerias?vertical=3`.
- Sem barra final, de forma consistente, com redireccionamento de quem escreve a variante errada.
- Sem datas nos URLs de blog (um artigo actualizado nao deve parecer velho).

### 6.2 Idiomas
- **PT na raiz, EN em `/en/...`.** Turista em praia portuguesa e publico real, portanto o EN nao
  e enfeite; mas a fase 0 pode sair so em PT e o EN entrar na fase 1 sem quebrar URLs.
- Etiquetas `hreflang` `pt-PT`, `en` e `x-default` a apontar para a versao PT.
- Traducoes em `messages/pt.json` e `messages/en.json`, com um teste que falha se uma chave
  existir num idioma e faltar no outro.
- **Sem traducao automatica visivel.** Um EN mal escrito faz mais mal a credibilidade que a
  ausencia de EN.

### 6.3 Dados estruturados (JSON-LD)
- `Organization` em todo o site (nome, logotipo, sede, contactos, perfis sociais).
- `LocalBusiness` por unidade a partir da fase 2, com morada, coordenadas e horario. E o que
  faz aparecer no mapa e nas pesquisas do genero "cacifos perto de mim".
- `FAQPage` na pagina de perguntas frequentes.
- `BreadcrumbList` nas paginas internas.
- `Article` nos artigos do blog.

### 6.4 Indexacao
- `sitemap.xml` gerado a partir das rotas reais (nunca escrito a mao) e `robots.txt` a apontar para ele.
- **IndexNow** a avisar Bing e afins a cada publicacao.
- Registo em **Google Search Console** e **Bing Webmaster Tools** no primeiro dia.
- **Google Business Profile** por unidade a partir da fase 2, com nome, morada e telefone
  exactamente iguais aos do site (a inconsistencia neste ponto e o erro mais comum e o mais penalizado).
- Perfil de empresa no LinkedIn a apontar para o site.

### 6.5 Conteudo que gera historico
Quatro a seis artigos na fase 1, escritos para quem procura, nao para o algoritmo:
- Quanto custa perder o telemovel ou as chaves na praia, e o que fazem os espacos hoje
- Bengaleiro versus cacifo automatico numa discoteca: filas, pessoal e responsabilidade
- O que diz a lei portuguesa sobre guarda de bens em estabelecimentos
- Cacifos em festivais: quantas portas por milhar de visitantes
- Como funciona um cacifo sem cadeado (fechadura electromagnetica explicada sem jargao)

Cadencia sugerida: um artigo por mes. Regularidade vale mais que volume para o efeito de historico
que queremos.

**Regra de escrita, obrigatoria**: portugues europeu natural, sem travessoes, sem frases picadas,
sem tiques de texto gerado. Esta regra passa a ser verificada por um teste automatico (seccao 11).

---

## 7. Arquitectura do backend

### 7.1 Principio
O site tem pouca superficie de escrita, e isso e uma virtude. Cada rota que aceita dados do exterior
e um risco, portanto sao poucas, todas validadas, todas limitadas em ritmo, e nenhuma falha em silencio.

### 7.2 Rotas de API

| Rota | Metodo | O que faz | Proteccoes |
|---|---|---|---|
| `/api/leads` | POST | Recebe pedido de parceria B2B, grava e notifica | Turnstile, validacao zod, limite de ritmo, campo-armadilha, tempo minimo de preenchimento |
| `/api/contacto` | POST | Mensagem generica de contacto | Iguais |
| `/api/aviso-unidade` | POST | "Avisem-me quando abrir perto de mim" | Iguais, mais consentimento explicito |
| `/api/health` | GET | Verifica variaveis de ambiente e liga a base de dados. 200 ou 503 | Sem dados sensiveis na resposta |
| `/api/units` | GET | Lista publica de unidades, vinda do adaptador activo | Cache no edge, so leitura |
| `/api/l/[codigo]` | GET | Resolve o destino de um QR e regista a leitura | Destinos so de tabela, nunca do pedido |
| `/api/webhooks/mailjet` | POST | Devolucoes e queixas de email | Verificacao de assinatura |
| `/api/admin/*` | varios | Gestao de leads e conteudo | Atras de Cloudflare Access, mais verificacao no servidor |

Regras para todas: resposta de erro generica ao utilizador, detalhe no registo interno; nunca um
rasto de excepcao visivel; **nenhuma escrita falha sem alerta** (o padrao `notifyAdmin`, que ja
provou valer a pena noutros projectos).

### 7.3 Modulos de biblioteca

| Modulo | Responsabilidade |
|---|---|
| `lib/company.ts` | Fonte unica da identidade: firma, NIPC, sede, emails, telefone, marca. Quando o registo definitivo sair, muda-se **um ficheiro** e todo o site acompanha |
| `lib/env.ts` | Validacao das variaveis de ambiente com zod no arranque. Falta uma chave, falha logo, nao a meio de um pedido |
| `lib/alert.ts` | Alerta para email e, opcionalmente, para um canal de mensagens, quando algo falha |
| `lib/email.ts` | Envio por Mailjet, com modelos PT e EN |
| `lib/turnstile.ts` | Verificacao do desafio no servidor |
| `lib/ratelimit.ts` | Limite de ritmo por IP e por rota, em Cloudflare KV ou Durable Object |
| `lib/leads.ts` | Regras de negocio dos leads (normalizacao, deteccao de duplicados, classificacao por vertical) |
| `lib/seo.ts`, `lib/i18n.ts` | Metadados, JSON-LD, traducoes |
| `lib/redirects.ts` | Tabela versionada de redireccionamentos |
| `lib/log.ts` | Registo estruturado sem dados pessoais (IP com resumo criptografico e sal, agente do utilizador truncado) |
| `lib/lockers/*` | A camada que isola a plataforma de cacifos. Ver a seguir |

### 7.4 A camada de cacifos (porta e adaptadores)

Este e o desenho que permite construir hoje sem a API da MicroIO.

```
lib/lockers/
  types.ts    Unidade, Compartimento, Tamanho, Disponibilidade, Preco, Sessao
  port.ts     interface LockersPort { listUnits, getUnit, getAvailability, ... }
  fake.ts     FakeLockersAdapter: dados de exemplo, deterministicos, usados em dev e em testes
  microio.ts  MicroIOAdapter: por implementar. Lanca "nao configurado" ate existirem credenciais
  index.ts    escolhe o adaptador por variavel de ambiente LOCKERS_PROVIDER=fake|microio
```

Consequencias praticas:
- O site inteiro (paginas de unidade, mapa, disponibilidade) pode ser construido e testado **hoje**
  contra o adaptador falso.
- Quando a MicroIO der acesso, escreve-se `microio.ts` e muda-se uma variavel de ambiente. As paginas
  nao mudam.
- Os **testes de contrato** correm contra os dois adaptadores. Se a implementacao real nao respeitar
  o contrato, a CI apanha antes de ir para producao.
- Se um dia houver segundo fornecedor de hardware, entra como terceiro adaptador. Isto nao e teoria:
  ja se descartaram quatro fornecedores neste projecto, portanto a probabilidade de mudar nao e nula.

E o mesmo racional de isolar um fornecedor de faturacao atras de uma interface: trocar passa a
custar um ficheiro, e nao uma reescrita.

### 7.5 Perguntas a fazer a MicroIO (desbloqueiam a fase 3)
Vale a pena enviar esta lista assim que houver contrato assinado, porque as respostas mudam o desenho:

1. Existe API publica? REST ou outra? Ha documentacao escrita?
2. Como se autentica (chave, OAuth)? Ha ambiente de testes separado do de producao?
3. Que operacoes estao disponiveis: listar unidades, listar portas, estado e ocupacao, precos,
   criar aluguer, abrir porta, historico?
4. Ha webhooks de eventos (porta aberta, aluguer iniciado, avaria)? Sao assinados? Ha retentativas?
5. Limites de ritmo e compromisso de disponibilidade?
6. O fluxo B2C pode ser alojado no **nosso** dominio, ou e obrigatoriamente no deles? Se for por
   iframe, que politica de enquadramento exigem (isto colide directamente com as nossas regras de seguranca)?
7. **Quem e o comerciante de registo no pagamento**: a MicroIO ou a IMOLOCKERS? Esta resposta decide
   quem emite a fatura, que software certificado usamos, e o que dizem os termos ao consumidor.
8. Quem e o responsavel pelo tratamento dos dados do utilizador final? Ha contrato de subcontratacao
   disponivel? Onde ficam alojados os dados?
9. Da para exportar dados (CSV ou API) para o nosso painel e para o modelo financeiro?
10. O fluxo do utilizador final suporta ingles alem do portugues?
11. O que acontece quando a rede do local cai? Ha modo autonomo?

### 7.6 Ambientes
- **Producao**: `lokit.pt`, ramo `main`, so depois de testes verdes.
- **Pre-visualizacao**: URL de pre-visualizacao do Worker por cada alteracao, **protegido por
  Cloudflare Access** (um ambiente de testes indexado pelo Google e um problema de SEO e de fuga
  de informacao comercial).
- **Local**: `npm run dev` com adaptador falso e Supabase local ou de desenvolvimento.
- Segredos de producao **so** nos secrets do Worker, postos a mao no painel, com `keep_vars` no
  `wrangler.jsonc` para que nenhum deploy os apague. O `.env.production` no repositorio contem
  apenas valores publicos.

---

## 8. Modelo de dados

Postgres no Supabase, com o esquema em `supabase/database.sql` e migracoes numeradas.

```sql
-- Leads B2B e contactos
leads(
  id uuid pk, created_at timestamptz,
  nome text, email citext, telefone text, empresa text,
  vertical text check (vertical in ('praia','nocturno','eventos','comercio','outro')),
  localizacao text, mensagem text,
  origem text, utm jsonb, idioma text,
  ip_hash text, ua_hash text,          -- resumo com sal, nunca o valor em bruto
  estado text default 'novo',          -- novo, contactado, qualificado, perdido, ganho
  notas text
)

lead_events(id uuid pk, lead_id uuid fk, tipo text, created_at timestamptz, dados jsonb)

-- Fase 2 em diante
units(id uuid pk, slug text unique, nome text, morada text, lat, lng,
      estado text, horario jsonb, tamanhos jsonb, precos jsonb,
      id_externo text, publicada boolean default false)

qr_codes(codigo text pk, unit_id uuid fk, destino text, activo boolean)

scan_events(id uuid pk, codigo text, created_at timestamptz, pais text, tipo_dispositivo text)
```

**Regras de dados:**
- `row level security` activa em **todas** as tabelas, com politica de negacao por defeito.
  As escritas passam sempre pelo servidor com a chave de servico; o navegador nunca escreve.
- Privilegios explicitos (`revoke all ... from anon`), como defesa em profundidade caso alguem
  crie uma politica por engano.
- **Retencao**: leads apagados ou anonimizados 24 meses apos o ultimo contacto; `scan_events`
  agregados aos 90 dias. Uma tarefa agendada trata disto, e a politica de privacidade diz o mesmo
  numero que o codigo faz.
- **Minimizacao**: o formulario nao pede nada que nao se va usar. Sem morada, sem NIF, sem dados
  que nao sirvam para responder.
- **Backups**: exportacao semanal para R2 alem do backup do Supabase, com um teste de restauro
  por trimestre. Um backup que nunca foi restaurado nao e um backup, e uma esperanca.

---

## 9. Seguranca

### 9.1 O que estamos a proteger
Na fase 0 e 1 o site guarda **dados de contacto de parceiros comerciais** e pouco mais. O risco
real nao e roubo de dados, e: alguem desfigurar o site (e destruir a credibilidade que estamos a
construir), o formulario ser usado para envio de correio nao solicitado, e chaves de acesso
escaparem para o repositorio. A partir da fase 3, com pagamentos e utilizadores finais, a
superficie muda de escala. O desenho de hoje ja tem de suportar isso.

### 9.2 Camada de rede (Cloudflare)
- Proxy activo em todos os registos publicos (o IP de origem nunca aparece).
- **DNSSEC** ligado, **registos CAA** a limitar quem pode emitir certificados.
- SSL em **Full (strict)**, TLS minimo 1.2, HTTPS forcado.
- **Regras de limite de ritmo** no WAF sobre `/api/*`: por exemplo 10 pedidos por minuto e por IP,
  e 30 por hora nos formularios.
- **Conjunto de regras geridas do WAF** activo, mais Bot Fight Mode.
- Desafio a trafego automatizado fora da Europa se aparecer abuso (regra que fica preparada, ligada
  so se for preciso).
- `/admin` e as pre-visualizacoes atras de **Cloudflare Access**, com autenticacao por email da
  empresa, nao por password partilhada.

### 9.3 Cabecalhos de resposta
Aplicados a todas as respostas, no `next.config.ts`:

| Cabecalho | Valor | Porque |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Obriga HTTPS. Submeter a lista de pre-carregamento so quando todos os subdominios estiverem em HTTPS |
| `Content-Security-Policy` | com **nonce** por pedido | Fecha injeccao de scripts. Ver 9.4 |
| `X-Content-Type-Options` | `nosniff` | O navegador nao adivinha tipos |
| `X-Frame-Options` | `DENY` mais `frame-ancestors 'none'` na CSP | Impede que nos embebam num iframe para enganar visitantes |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Nao entregamos URLs internos a terceiros |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self), payment=()` | Geolocalizacao permitida so a nos, para o "unidade mais proxima" |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolamento de janelas |

### 9.4 Content-Security-Policy desde o inicio
Fazer isto agora, e nao mais tarde, e a decisao de seguranca com melhor relacao custo-beneficio
do plano. Politica alvo:

```
default-src 'self';
script-src 'self' 'nonce-<gerado por pedido>' https://challenges.cloudflare.com https://static.cloudflareinsights.com;
style-src 'self' 'nonce-<...>';
img-src 'self' data: https://<bucket de imagens>;
connect-src 'self' https://<projecto>.supabase.co https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com;
frame-ancestors 'none'; base-uri 'none'; object-src 'none'; form-action 'self';
upgrade-insecure-requests;
report-uri <endpoint de relatorios>
```

Processo: publicar primeiro em modo **`Content-Security-Policy-Report-Only`** durante uma semana,
ler os relatorios, so depois passar a modo de imposicao. Assim nao se parte producao a aprender.
Nota: se a MicroIO exigir um iframe deles no nosso dominio, isto tem de ser renegociado com cuidado,
que e mais uma razao para a pergunta 6 da seccao 7.5.

### 9.5 Formularios e abuso
Quatro camadas, porque nenhuma sozinha chega:
1. **Cloudflare Turnstile**, verificado **no servidor** (uma verificacao so no cliente nao vale nada).
2. **Campo-armadilha** invisivel que humanos nunca preenchem.
3. **Tempo minimo** entre carregar a pagina e submeter (dois segundos elimina a maioria dos robots simples).
4. **Limite de ritmo** por IP na aplicacao, alem da regra do WAF.

Mais: validacao com zod por lista de permitidos (nao por lista de proibidos), tamanho maximo de
cada campo, e **nenhum conteudo do utilizador reproduzido em HTML sem escape**. Os emails de aviso
enviam o conteudo em texto simples, nunca em HTML interpretado.

### 9.6 Segredos
- Nada de chaves no repositorio. `.env.production` so com valores publicos, e um teste que falha
  se algum valor la parecer uma chave secreta.
- Segredos de producao nos secrets do Worker, com `keep_vars` activo.
- Segredos de CI nos secrets do GitHub, com ambito minimo.
- **Deteccao de segredos na CI** (gitleaks) alem do secret scanning do GitHub.
- Politica de rotacao: anual por rotina, imediata em caso de exposicao ou de saida de alguem.
  Uma chave de pagamento exposta obriga a rodar tudo o que ela tocava, e a limpeza arrasta-se
  durante meses. Vale a pena nao chegar la.

### 9.7 Dependencias e cadeia de fornecimento
- Menos dependencias e mais seguranca. Sem bibliotecas de componentes pesadas, sem pacotes de
  utilidades que fazem o que dez linhas fazem.
- `package-lock.json` sempre commitado; instalacoes com `npm ci`.
- **Workflow `security-audit`** semanal, no molde do que ja existe: falha em avisos novos de
  dependencias de producao, informativo nas de desenvolvimento, com excepcoes datadas em
  `audit-allowlist.json`.
- **Dependabot** para actualizacoes semanais.
- **CodeQL** ligado no repositorio.
- Actions fixadas por SHA.

### 9.8 Registo e privacidade nos logs
- Nunca registar email, telefone ou mensagem em texto simples nos logs de aplicacao.
- IP com resumo criptografico e sal; agente do utilizador truncado a uma classe (movel, computador).
- Retencao curta dos logs. O que precisa de durar vive na base de dados, com politica de retencao.

### 9.9 Resposta a incidentes
- `/.well-known/security.txt` com contacto e politica de divulgacao. Barato, e sinaliza seriedade
  a quem encontrar uma falha.
- `docs/RUNBOOK.md` com sintoma e accao: site em baixo, formulario a falhar, chave exposta,
  pico de trafego suspeito, base de dados inacessivel.
- Procedimento de violacao de dados pessoais: conter, avaliar, e notificar a CNPD em 72 horas se
  houver risco para os titulares. Escrito antes de fazer falta, nao durante.
- Alerta automatico quando uma escrita falha (`notifyAdmin`) e quando `/api/health` responde 503.

---

## 10. Conformidade legal em Portugal

O site e a montra de uma sociedade que ainda esta em registo definitivo, portanto ha texto que so
fica final quando a certidao permanente sair. O que tem de estar la:

- **Identificacao completa** (Decreto-Lei 7/2004): firma IMOLOCKERS, LDA, NIPC, sede, contactos,
  no rodape e na pagina de contactos.
- **Livro de Reclamacoes electronico**: ligacao obrigatoria e visivel, assim que a empresa estiver
  registada e o livro atribuido.
- **Resolucao alternativa de litigios**: indicar a entidade de arbitragem competente para consumo.
  Obrigatorio para quem vende a consumidores.
- **Termos e condicoes B2C**: a MicroIO fornece com a plataforma. Fornecer nao e assumir
  responsabilidade: **temos de os ler, adaptar a IMOLOCKERS e assumir**. Pontos criticos a verificar:
  limite de valor por cacifo (ha referencia a 200 euros no material do projecto), objectos proibidos,
  esquecimento e abandono de bens, prazo de recolha, direito de livre resolucao e as suas excepcoes.
- **Politica de privacidade e de cookies**: nossas, escritas para o site. Com Cloudflare Web Analytics
  e sem cookies de marketing, **nao ha banner de consentimento**, o que e uma vantagem de conversao
  e de confianca. Declarar na mesma o cookie tecnico `__cf_bm` do Turnstile.
- **Subcontratantes**: Cloudflare, Supabase, Mailjet. Contratos de subcontratacao assinados, regiao
  de alojamento indicada, transferencias para os EUA justificadas.
- **Registo da marca no INPI**: pendente. Ate estar concedido, nao usar o simbolo de marca registada.
- **Precos** sempre com IVA incluido quando dirigidos ao consumidor.
- **Seguros**: quando houver unidades, a apolice de responsabilidade civil e a cobertura de bens
  a guarda tem de ser coerentes com o que os termos prometem. O site nao pode prometer mais do que
  a apolice cobre.

---

## 11. Estrategia de testes

O objectivo nao e uma percentagem bonita de cobertura, e **poder mexer no site as onze da noite
sem medo**. Testes onde a falha e cara ou silenciosa, e em mais lado nenhum.

### 11.1 Piramide

**Unitarios (Vitest, correm em segundos)**
- `lib/` inteiro: validacao de formularios, normalizacao de leads, geracao de metadados e JSON-LD,
  formatacao de precos, resolucao de idioma, tabela de redireccionamentos, limite de ritmo.
- `company.ts`: um teste que garante que NIPC, firma e sede aparecem coerentes em todo o lado.
- Alvo: **80% de cobertura em `lib/`**. Sem alvo em componentes visuais, que se testam melhor a olho
  e com Playwright.

**Testes de contrato da camada de cacifos**
- A **mesma bateria** corre contra `FakeLockersAdapter` e, quando existir, contra `MicroIOAdapter`
  em modo de testes. Garante que a implementacao real cumpre o contrato antes de chegar a producao.
- Respostas reais da MicroIO gravadas como ficheiros de referencia, para poder testar sem rede.
- O teste real fica ignorado enquanto nao houver credenciais, e tem uma guarda que recusa correr
  contra producao. E o padrao habitual para testar contra a API real de um fornecedor.

**Integracao dos route handlers**
Para cada rota de API, os caminhos que interessam nao sao os felizes:
- payload invalido devolve 400 com mensagem util;
- Turnstile falhado devolve 403 e nao grava nada;
- limite de ritmo excedido devolve 429;
- base de dados em baixo dispara alerta e devolve erro amigavel, **sem perder o lead em silencio**;
- envio de email falhado nao impede a gravacao do lead (a ordem importa: gravar primeiro, avisar depois);
- submissao duplicada nao cria dois registos.

**Ponta a ponta (Playwright)**
- Percurso principal: inicio, parcerias, preencher formulario, ver confirmacao.
- Formulario com erros: mensagens claras, foco no primeiro campo invalido.
- Troca PT e EN mantem a rota equivalente.
- 404 devolve a pagina util e o codigo 404 correcto.
- `/l/CODIGO` responde e nao aceita destino vindo do URL.
- **Cabecalhos de seguranca presentes** na resposta de producao (teste que apanha uma regressao
  de configuracao, que e o tipo de erro que ninguem ve a olho).
- `robots.txt` e `sitemap.xml` acessiveis e coerentes.
- Zero erros de consola em cada pagina visitada.

**Acessibilidade**
- axe nas cinco paginas principais, em PT e EN.
- Navegacao completa por teclado, contraste minimo AA, textos alternativos em todas as imagens.
  Alem de ser o correcto, e um sinal de qualidade que camaras e entidades publicas notam.

**Desempenho**
- Lighthouse CI com limites que **fazem falhar** a CI: LCP acima de 2,0 s, JavaScript acima de
  120 KB, ou pontuacao de acessibilidade abaixo de 95.

**Conteudo (os testes menos convencionais e talvez os mais uteis aqui)**
- Falha se aparecer um travessao longo (o caracter U+2014) em qualquer ficheiro de copy. A regra de escrita deixa de
  depender de alguem se lembrar.
- Falha se uma chave de traducao existir em PT e faltar em EN, ou o contrario.
- Falha se uma pagina nao tiver titulo ou descricao.
- Falha se houver ligacao interna para um URL que nao existe na tabela de rotas.

**Verificacao semanal de ligacoes**
- `lychee` em workflow agendado, sobre o site publicado, a apanhar ligacoes externas mortas.

### 11.2 Disciplina
- **Cada erro corrigido ganha um teste** que reproduz o erro. E a unica regra que impede o mesmo
  erro voltar.
- Testes rapidos: a bateria completa de unitarios abaixo de 10 segundos, senao deixa de se correr.
- Nada de testes que so verificam que o codigo faz o que o codigo faz.

---

## 12. CI/CD

Workflow `ci.yml`:

```
push  ->  instalar (npm ci)
      ->  verificacao de tipos e lint
      ->  testes unitarios e de integracao
      ->  testes de conteudo (travessoes, i18n, metadados)
      ->  build
      ->  [so no main] deploy para Cloudflare Workers
```

Workflows adicionais:
- `e2e.yml`: Playwright contra a pre-visualizacao, depois do deploy.
- `lighthouse.yml`: orcamentos de desempenho e acessibilidade.
- `security-audit.yml`: semanal, com portao nas dependencias de producao.
- `links.yml`: semanal, ligacoes mortas.

Detalhes que evitam dores conhecidas:
- `timeout-minutes` em todos os jobs (um runner encravado consome seis horas por defeito).
- `workflow_dispatch` em todos, para poder correr a mao quando o GitHub falha a criar corridas
  (aconteceu a 2026-08-06 no outro repositorio).
- Concorrencia com grupo unico no deploy, sem cancelar a meio.
- Deploy **so** com testes verdes e **so** no `main`.

---

## 13. Operacao

- **`/api/health`** verificado de 5 em 5 minutos por monitor externo, com alerta por email.
- **`docs/RUNBOOK.md`**: sintoma e accao, escrito a medida que se constroi, nao no fim.
- **Cloudflare Web Analytics** ligado no primeiro dia (o funil so existe se se medir desde o inicio).
- Painel simples em `/admin` com os leads e a sua fase, atras de Cloudflare Access. Nao e um CRM,
  e uma lista que evita perder um contacto.
- Aviso de lead novo por email para `info@lokit.pt`, com resposta automatica ao parceiro em PT ou EN.
- Revisao mensal de 30 minutos: leads recebidos, paginas mais vistas, erros no registo, dependencias
  a actualizar.

---

## 14. Roteiro por fases

### Fase 0, fundacao (3 a 4 dias de trabalho)
1. Criar organizacao GitHub, repositorio, e conta Cloudflare da empresa; mover DNS dos dois dominios.
2. Esqueleto do projecto (Next, Tailwind, Vitest, Playwright, wrangler, CI) com deploy a funcionar
   e uma pagina.
3. `lib/company.ts`, `env.ts`, cabecalhos de seguranca e CSP em modo de relatorio.
4. Sete paginas: inicio, como funciona, parcerias, sobre, contactos, perguntas frequentes, locais
   (em preparacao).
5. Formulario B2B completo: Turnstile, validacao, Supabase, email, alerta, testes.
6. Legal: termos do site, privacidade, cookies (versao inicial, a rever quando a sociedade estiver
   registada).
7. SEO base: sitemap, robots, JSON-LD de organizacao, Search Console, IndexNow, Web Analytics.
8. Publicar.

**Condicao de concluido**: `lokit.pt` no ar com conteudo real, formulario a entregar leads no email
e na base de dados, CI verde, cabecalhos de seguranca verificados por teste, site indexado no Google.

### Fase 1, autoridade (4 a 5 dias, espalhados)
- Quatro paginas de vertical com argumentos proprios.
- Versao EN completa com hreflang.
- Quatro a seis artigos de blog.
- Data room privado atras de Cloudflare Access, para partilhar com parceiros sem andar a enviar
  ficheiros por email.
- CSP a passar de relatorio para imposicao.
- Fotografias reais assim que houver equipamento (as imagens genericas de banco de imagens sao
  visiveis a distancia e custam credibilidade).

### Fase 2, primeira unidade (2 a 3 dias)
- `/locais` com mapa e ficha por unidade, alimentado pelo adaptador falso ate haver API.
- Rotas de QR operacionais com a tabela de codigos.
- Google Business Profile da unidade.
- Precos publicos, se ja forem estaveis.

### Fase 3, integracao MicroIO (5 a 8 dias, depende das respostas da seccao 7.5)
- `MicroIOAdapter` implementado, com testes de contrato a passar nos dois adaptadores.
- Disponibilidade em tempo real nas fichas de unidade.
- Fluxo de aluguer (no nosso dominio ou por redireccionamento, conforme a resposta a pergunta 6).
- Conta de utilizador e historico, se fizer sentido comercial.
- Faturacao, conforme quem for o comerciante de registo.

---

## 15. Decisoes a tomar antes de comecar

| # | Decisao | Recomendacao |
|---|---|---|
| 1 | Onde vive o repositorio: organizacao GitHub nova ou conta pessoal | Organizacao nova, com os tres socios |
| 2 | Quem cria e administra a conta Cloudflare, e com que email | Conta da empresa com `info@lokit.pt`, 2FA, dois administradores |
| 3 | Dominio canonico | `lokit.pt`, com `lokitlockers.com` a redirigir |
| 4 | EN no primeiro dia ou na fase 1 | Fase 1. PT bem escrito vale mais que dois idiomas medianos |
| 5 | Existe logotipo e identidade visual? | Bloqueia o design. Se nao houver, avanca-se com uma identidade sobria provisoria e trata-se disso em paralelo |
| 6 | Quem escreve a copy | Proposta escrita e revista internamente. Regra de escrita PT-PT aplicada e verificada por teste |
| 7 | Publicar precos B2C na fase 0 | Nao. So faixas na conversa comercial, ate haver unidade instalada |
| 8 | Para onde vao os leads | `info@lokit.pt` mais registo na base de dados. Definir quem responde e em quanto tempo |
| 9 | Data room no site ou em Google Docs | Google Docs por agora; passar para o site na fase 1 se houver muitos parceiros a pedir |
| 10 | O site anuncia a MicroIO como fornecedor? | Nao na fase 0. Comunicar "tecnologia portuguesa" sem entregar o fornecedor a concorrencia |

---

## 16. Riscos

| Risco | Impacto | Mitigacao |
|---|---|---|
| Site publicado antes de a sociedade estar registada, com texto legal incompleto | Medio | Paginas legais em versao inicial, com a firma e o NIPC ja atribuidos; revisao marcada para quando sair a certidao |
| API da MicroIO limitada ou inexistente | Alto na fase 3 | A camada de porta e adaptadores isola o problema; enviar as 11 perguntas cedo, antes de assinar |
| A MicroIO exigir iframe no fluxo de pagamento | Medio | Colide com a CSP. Negociar dominio proprio ou subdominio dedicado com politica separada |
| Site "montra vazia" durante meses (sem unidades) | Medio | A pagina de locais assume que ainda nao ha, e transforma isso em captura de interesse. Honestidade converte melhor que ambiguidade |
| Conteudo escrito a pressa com marcas de texto gerado | Alto para a credibilidade | Regra de escrita transformada em teste automatico |
| Contas em nome pessoal de um socio | Alto a prazo | Seccao 2, resolvida no primeiro dia |
| Marca ainda nao registada no INPI | Medio | Avancar com o site, tratar do registo em paralelo, nao usar simbolo de marca registada |

---

## 17. Tarefas a criar

1. Criar organizacao GitHub e conta Cloudflare da IMOLOCKERS, com DNS dos dois dominios (P2, 2h).
2. Esqueleto do site Lokit com CI e primeiro deploy (P2, 1d).
3. Escrever a copy PT das sete paginas da fase 0 (P2, 4h).
4. Formulario B2B ponta a ponta com Turnstile, Supabase, email e testes (P2, 4h).
5. Paginas legais do site Lokit, versao inicial (P3, 2h).
6. SEO base: Search Console, sitemap, JSON-LD, Web Analytics (P3, 2h).
7. Enviar a MicroIO as 11 perguntas tecnicas sobre a API (P2, 30m). **Faz sentido enviar ja**,
   independentemente do site: as respostas mudam o desenho e provavelmente tambem o contrato.
8. Decidir identidade visual e logotipo do Lokit (P3, bloqueia o design).

---

## 18. Referencias
- `docs/negocio/tecnologia.md`, o esboco que este plano concretiza na parte do site
- `docs/negocio/marketing.md`, canais e mensagens por audiencia
- `docs/negocio/pacto-social.md` e `docs/negocio/enquadramento-legal.md`, a parte societaria e legal
- `docs/ARCHITECTURE.md`, `docs/SECURITY.md` e `docs/DECISIONS.md`, o que ficou construido
