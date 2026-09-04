# Arquitectura

## Resumo

Next.js 16 (App Router) em TypeScript, publicado em Cloudflare Workers pelo
adaptador OpenNext, com Supabase para os dados. É a mesma pilha do ImoCheck e do
FlytteCheck, por decisão registada: não multiplicar padrões, para que resolver
um problema em produção não exija reaprender a plataforma.

## Camadas

```
proxy.ts            CSP com nonce por pedido
app/                páginas (servidor) e rotas de API
components/         interface. Só dois componentes de cliente:
                    o formulário, e o menu, que nem JavaScript usa
lib/                lógica de servidor, sem React
lib/lockers/        a porta para a plataforma de cacifos
supabase/           esquema, com RLS e retenção
```

## A camada de cacifos

O site não fala com a plataforma de cacifos. Fala com uma interface nossa:

```
port.ts     o contrato: listarUnidades, obterUnidade, obterDisponibilidade
fake.ts     dados de exemplo, determinísticos, usados hoje
microio.ts  por implementar, à espera de acesso à API
index.ts    escolhe o adaptador por LOCKERS_PROVIDER
```

Consequências práticas:

- As páginas de unidade podem ser construídas e testadas **hoje**.
- Quando houver API, escreve-se `microio.ts` e muda-se uma variável de ambiente.
- `tests/lockers-contrato.test.ts` corre a mesma bateria contra cada
  implementação. Se a real não cumprir o contrato, a CI apanha antes de produção.
- Se um dia houver segundo fornecedor de hardware, entra ao lado. Não é
  hipótese remota: já se descartaram quatro fornecedores neste projecto.

### Perguntas por responder à MicroIO

Desbloqueiam a implementação do adaptador e mudam o desenho, portanto convém
enviá-las antes de assinar contrato.

1. Existe API pública? REST ou outra? Há documentação escrita?
2. Como se autentica, e há ambiente de testes separado do de produção?
3. Que operações existem: listar unidades e portas, estado e ocupação, preços,
   criar aluguer, abrir porta, histórico?
4. Há webhooks de eventos? São assinados? Há retentativas?
5. Limites de ritmo e compromisso de disponibilidade?
6. O fluxo do utilizador final pode ser alojado no nosso domínio, ou é
   obrigatoriamente no deles? Se for por iframe, que política de enquadramento
   exigem? Isto colide directamente com a nossa CSP.
7. **Quem é o comerciante de registo no pagamento?** Decide quem emite a
   factura, que software certificado usamos, e o que dizem os termos.
8. Quem é o responsável pelo tratamento dos dados do utilizador final? Há
   contrato de subcontratação? Onde ficam alojados os dados?
9. Dá para exportar dados para o nosso painel e para o modelo financeiro?
10. O fluxo do utilizador final suporta inglês além do português?
11. O que acontece quando a rede do local cai? Há modo autónomo?

## As rotas de QR

`lokit.pt/l/<codigo>` existe desde o primeiro dia, mesmo sem plataforma ligada.

O QR vai impresso no equipamento e não se reimprime. Se apontasse para o domínio
do fornecedor, mudar de plataforma obrigaria a substituir os autocolantes de
todos os cacifos. Apontando para nós, muda-se o destino do lado do servidor.

O destino de cada código vem da tabela `qr_codes`, nunca do URL. Isso impede que
alguém transforme `lokit.pt/l/...` num redireccionamento para outro site, e é a
razão de existir um teste de ponta a ponta só para isso.

## Renderização

Todas as páginas são renderizadas no servidor a cada pedido. Não é o defeito do
Next, é a consequência de ler o nonce da CSP no layout: um nonce por pedido não
é compatível com HTML gerado uma vez em tempo de build.

A troca foi deliberada e está registada em `DECISIONS.md`. Num site deste
tamanho, servido no edge, o custo é baixo, e a alternativa era publicar com
`unsafe-inline` nos scripts, que é o mesmo que não ter CSP nenhuma.

## Formulário de parcerias

Ordem no servidor: validar, travar abuso, **gravar**, e só depois avisar.

Se o email falhar depois da gravação, o pedido está salvo e o alerta avisa-nos.
Se fosse ao contrário, um erro de base de dados fazia desaparecer um contacto
comercial sem deixar rasto. O aviso interno leva o pedido inteiro no corpo,
precisamente para o caso de a gravação ter falhado.

Quatro camadas contra abuso, porque nenhuma chega sozinha: Turnstile verificado
no servidor, campo-armadilha, tempo mínimo de preenchimento, e limite de ritmo.
