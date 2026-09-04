# Decisões

Decisões técnicas deste repositório, com data e razão. Quem chegar daqui a seis
meses, ou de fora, precisa de saber porque é que as coisas estão como estão, e
não só que estão.

## 2026-09-04 (1) A pilha é a que já se conhece

**Decisão**: Next.js 16 com App Router, TypeScript, Tailwind v4, Cloudflare
Workers via OpenNext, Supabase para dados.

**Razão**: é a mesma pilha de outros projectos da equipa, com conhecimento
acumulado, um formato de CI que funciona e módulos já pensados (`company.ts`,
`env.ts`, `alert.ts`, `email.ts`). Não multiplicar padrões é uma regra
assumida: resolver um problema em produção não deve exigir reaprender a
plataforma.

**Alternativa considerada**: Astro estático em Cloudflare Pages, mais leve para
páginas informativas. Rejeitada porque o site vai precisar de backend real
(contactos hoje, unidades e disponibilidade amanhã, fluxo de aluguer depois), e
migrar a meio custaria mais do que a diferença de peso.

## 2026-09-04 (2) Porta e adaptadores para a plataforma de cacifos

**Decisão**: nenhum código fala com a plataforma directamente. Tudo passa por
`lib/lockers/port.ts`, com um adaptador de exemplo hoje e o da MicroIO quando
houver API.

**Razão**: permite construir e testar o site inteiro sem acesso à API, que é a
situação real. E se um dia entrar outro fornecedor, entra ao lado: no processo
de escolha foram descartados quatro, portanto a probabilidade não é baixa.

**Consequência**: `tests/lockers-contrato.test.ts` corre a mesma bateria contra
cada implementação. Um adaptador só é usado depois de passar.

## 2026-09-04 (3) As rotas de QR são nossas, desde o primeiro dia

**Decisão**: `lokit.pt/l/<codigo>`, com o destino em base de dados e nunca no
URL.

**Razão**: o QR vai impresso no equipamento. Se apontasse para o domínio do
fornecedor, mudar de plataforma obrigaria a substituir os autocolantes de todos
os cacifos. Guardar o destino em tabela impede também que o endereço seja usado
como redireccionamento aberto.

## 2026-09-04 (4) CSP com nonce, e páginas dinâmicas como consequência

**Decisão**: Content-Security-Policy com nonce por pedido, gerada no `proxy.ts`,
a arrancar em Report-Only.

**Consequência aceite**: ler o nonce no layout torna todas as páginas dinâmicas.
Não há forma de ter um nonce por pedido em HTML gerado uma vez em tempo de
build.

**Razão**: a alternativa era `unsafe-inline` nos scripts, que é o mesmo que não
ter CSP. Num site deste tamanho, servido no edge, o custo da renderização por
pedido é baixo. Acrescentar uma CSP a um site já feito é caro e parte produção
com facilidade; num site novo custa uma tarde.

**A rever se**: o tráfego crescer ao ponto de a renderização por pedido pesar.
Nesse caso, avaliar CSP por hashes nas páginas estáticas.

## 2026-09-04 (5) `proxy.ts` em vez de `middleware.ts`

**Decisão**: usar a convenção nova do Next 16.

**Risco conhecido**: o OpenNext avisa que o suporte a middleware em Node é
experimental na Cloudflare. O nosso é pequeno (gera um nonce e escreve dois
cabeçalhos), portanto a exposição é baixa.

**Plano B**: se der problemas em produção, mover a CSP para `next.config.ts` com
uma política estática sem nonce, e aceitar `unsafe-inline` nos estilos mas não
nos scripts, ou voltar a `middleware.ts`.

## 2026-09-04 (6) A regra de escrita virou teste

**Decisão**: `scripts/verificar-copy.mjs`, chamado pelo `npm test`, falha se
aparecer um travessão longo, um travessão curto ou um ponto médio em texto.

**Razão**: uma regra de escrita que depende de alguém se lembrar falha ao
terceiro ficheiro escrito à pressa. Já foi quebrada antes, em escala, e a
correcção à mão no fim é sempre pior do que não escrever assim de início.

## 2026-09-04 (7) Paleta corrigida por contraste, não por gosto

**Decisão**: os tons de texto secundário foram escurecidos e o texto sobre o
verde passou a ser um token (`--lk-on-sea`), branco em claro e escuro em modo
escuro.

**Razão**: o teste de acessibilidade apanhou onze falhas de contraste na
primeira versão, e em modo escuro o branco sobre o verde claro dava 2,2 de
contraste, que reprova em qualquer critério. Também se descobriu que a regra de
link do texto corrido tinha mais especificidade do que as classes utilitárias, e
pintava de verde o texto de um botão verde.

## 2026-09-04 (8) `legacy-peer-deps` no `.npmrc`

**Facto**: `npm install` rebenta com
`Cannot read properties of null (reading 'edgesOut')` ao resolver a árvore de
pares opcionais do Vitest 4. É um erro do npm 10.9, não um conflito real do
projecto: com `--legacy-peer-deps` instala sem se queixar.

**Decisão**: a definição vive no `.npmrc` e não numa linha de comando. Assim o
`npm install` e o `npm ci` usam a mesma estratégia, e o ficheiro de bloqueio
fica coerente com os dois.

**Porque não ficou só no comando**: ficou, na primeira tentativa, e o `npm ci`
da CI recusou o lock por não estar sincronizado (dezenas de conflitos de versão
do esbuild). Um lock que só um dos dois comandos aceita é pior do que a
definição explícita.

**A rever**: quando o npm corrigir o erro, tirar o `.npmrc`, regerar o lock, e
confirmar que `npm ci` continua a passar.
