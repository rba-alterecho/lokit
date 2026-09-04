# Segurança

## O que estamos a proteger

Nesta fase o site guarda contactos de parceiros comerciais e pouco mais. O risco
real não é roubo de dados, é: alguém desfigurar o site e destruir a
credibilidade que estamos a construir, o formulário ser usado para correio não
solicitado, e chaves escaparem para o repositório.

Quando houver pagamentos e utilizadores finais, a superfície muda de escala. O
que está montado hoje já tem de aguentar isso.

## Camadas

### Rede (Cloudflare, configuração de painel)

Ver `SETUP.md`. Em resumo: proxy activo, DNSSEC, CAA, SSL Full (strict), TLS
mínimo 1.2, regras de limite de ritmo em `/api/*`, WAF gerido, Bot Fight Mode, e
Cloudflare Access à frente das pré-visualizações.

### Cabeçalhos

Definidos em `next.config.ts` (os estáticos) e em `proxy.ts` (a CSP, que precisa
de um valor diferente a cada pedido). Um teste de ponta a ponta verifica que
estão presentes: configuração perde-se sem ninguém dar por isso, e este é o tipo
de regressão que não se vê a olho.

### Content-Security-Policy

Arranca em **Report-Only**. Passar a imposição é mudar `CSP_MODE` para
`enforce`, sem tocar em código.

Notas de implementação:

- O nonce é gerado por pedido e vai no cabeçalho do pedido, que é de onde o Next
  o lê para o aplicar aos scripts que ele próprio injecta.
- `upgrade-insecure-requests` só entra em modo de imposição. Em Report-Only é
  ignorada e o navegador escreve um erro na consola por cada página.
- Não usamos `strict-dynamic` por agora. Com ele, os navegadores modernos
  ignoram a lista de domínios e todos os scripts externos passariam a precisar
  do nonce, incluindo o do Turnstile. Fica como endurecimento a considerar
  depois de a política estar imposta e estável.
- Se a MicroIO exigir um iframe deles no nosso domínio, isto tem de ser
  renegociado com cuidado. É a pergunta 6 da lista em `ARCHITECTURE.md`.

### Formulários

Quatro camadas: Turnstile verificado no servidor, campo-armadilha, tempo mínimo
de preenchimento, limite de ritmo por IP.

Quem cai na armadilha ou submete depressa demais recebe uma resposta de sucesso.
É deliberado: um robot que recebe erro tenta outra forma, um robot que recebe
sucesso vai-se embora.

Em produção, sem Turnstile configurado, o formulário recusa tudo e alerta. Um
formulário aberto sem verificação transforma-se em fonte de correio não
solicitado em poucos dias, e quem paga a factura é a reputação do domínio, que
depois estraga também os emails transaccionais.

### Segredos

- Nada de chaves no repositório. `.env.production` só tem valores públicos.
- Segredos de produção nos secrets do Worker, com `keep_vars` no
  `wrangler.jsonc` para nenhum deploy os apagar.
- Rotação anual por rotina, imediata em caso de exposição ou de saída de alguém.
  Uma chave de pagamento exposta obriga a rodar tudo o que ela tocava, e a
  limpeza arrasta-se durante meses. Vale a pena não chegar lá.

### Dados

- RLS activo em todas as tabelas, com negação por defeito. O navegador nunca lê
  nem escreve; tudo passa pelo servidor com a chave de serviço.
- Privilégios revogados explicitamente para os papéis públicos, como defesa em
  profundidade caso alguém crie uma política por engano.
- Nada de dados pessoais nos logs: IP como resumo com sal, agente do utilizador
  reduzido a uma classe.
- Retenção em código, não só na política: `limpar_dados_antigos()` no SQL,
  agendada com `pg_cron`.

### Dependências

- Menos dependências, menos superfície. Sem bibliotecas de componentes pesadas.
- `security-audit` semanal com portão nas dependências de produção e excepções
  datadas em `.github/audit-allowlist.json`.
- Actions fixadas por SHA. Uma etiqueta como `@v5` pode ser reapontada por quem
  a controla, e nesse dia a CI passa a correr código diferente sem nada mudar
  aqui.

## Quando alguma coisa correr mal

Ver `RUNBOOK.md`. Em caso de violação de dados pessoais com risco para os
titulares, há 72 horas para notificar a CNPD, e o relógio começa no momento em
que se toma conhecimento.

## Por fazer

- [ ] `/.well-known/security.txt` com contacto e política de divulgação.
- [ ] Submeter o domínio à lista de pré-carregamento de HSTS, só depois de todos
      os subdomínios estarem em HTTPS.
- [ ] Endpoint de recolha de relatórios da CSP (`CSP_REPORT_URI`).
- [ ] Detecção de segredos na CI (gitleaks), além do secret scanning do GitHub.
