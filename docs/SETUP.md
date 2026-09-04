# Setup

Passos que só podem ser feitos por uma pessoa com acesso aos painéis. Por
ordem. Cada bloco diz o que fica a funcionar quando estiver feito.

## 1. GitHub

- [ ] Criar a **organização** `imolockers` (ou `lokit`) e mover este repositório
      para lá. Não deixar na conta pessoal: numa sociedade a três, uma conta
      pessoal é uma dívida futura.
- [ ] Exigir **2FA** a todos os membros da organização.
- [ ] Settings > Code security: ligar **secret scanning** e **push protection**.
- [ ] Settings > Actions > General: permissões do `GITHUB_TOKEN` em **read**.
- [ ] Proteger o ramo `main`: exigir que a CI passe, proibir force-push.

## 2. Cloudflare

- [ ] Criar a conta com `info@lokit.pt`, não com um email pessoal.
- [ ] Ligar 2FA e adicionar os sócios com o papel mínimo necessário.
- [ ] Adicionar as zonas `lokit.pt` e `lokitlockers.com`, e apontar os
      nameservers no registrar.
- [ ] Por zona: **DNSSEC** ligado, **Always Use HTTPS**, **SSL Full (strict)**,
      **TLS mínimo 1.2**, registos **CAA**.
- [ ] Regra de redireccionamento: `lokitlockers.com/*` para `https://lokit.pt/$1`
      com 301 permanente.
- [ ] **Email Routing** nas duas zonas, catch-all para o email pessoal.

Quando estiver feito: os domínios respondem e o email chega.

## 3. Worker

- [ ] Criar o Worker `lokit` (o primeiro deploy da CI cria-o).
- [ ] Domínios personalizados: `lokit.pt` e `www.lokit.pt`.
- [ ] Criar um **token de API** com âmbito mínimo (Workers Scripts: Edit) e
      guardá-lo nos secrets do GitHub como `CLOUDFLARE_API_TOKEN`. Guardar
      também `CLOUDFLARE_ACCOUNT_ID`. Nunca usar a Global API Key.
- [ ] KV para o limite de ritmo:
      `npx wrangler kv namespace create RATE_LIMIT`, depois descomentar o bloco
      `kv_namespaces` no `wrangler.jsonc` com o id devolvido.

## 4. Supabase

- [ ] Criar o projecto na **região da União Europeia** (Frankfurt).
- [ ] Correr `supabase/database.sql` no editor SQL.
- [ ] Guardar como **secrets do Worker**: `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Guardar em `.env.production`: `NEXT_PUBLIC_SUPABASE_URL`.
- [ ] Ligar `pg_cron` e agendar a limpeza (o comando está no fim do SQL). Sem
      isto, a promessa de retenção da política de privacidade fica por cumprir.

## 5. Turnstile

- [ ] Cloudflare > Turnstile > Add site, domínio `lokit.pt`.
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` em `.env.production` (é público).
- [ ] `TURNSTILE_SECRET_KEY` nos secrets do Worker.

**Enquanto isto não estiver feito, o formulário recusa pedidos em produção.** É
deliberado: um formulário sem verificação transforma-se em fonte de correio não
solicitado em poucos dias, e o domínio paga a factura.

## 6. Mailjet

- [ ] Conta da empresa, domínio `lokit.pt` verificado com SPF e DKIM.
- [ ] Publicar DMARC no DNS, a começar em `p=none`, e subir para `quarantine`
      depois de duas semanas de relatórios limpos.
- [ ] Secrets do Worker: `MAILJET_API_KEY`, `MAILJET_SECRET_KEY`.
- [ ] Variáveis: `MAIL_FROM=info@lokit.pt`, `LEADS_EMAIL`, `ALERT_EMAIL`.

## 7. Segredos que faltam

- [ ] `IP_HASH_SALT`: uma cadeia aleatória longa, gerada uma vez e nunca
      mudada sem motivo. Sem sal, um resumo de IP é reversível por força bruta
      em segundos.
- [ ] `ALERT_WEBHOOK_URL` (opcional): webhook de Discord ou Slack, como segundo
      canal de alerta que não depende do Mailjet estar de pé.

## 8. Depois de estar no ar

- [ ] **Google Search Console** e **Bing Webmaster Tools**: verificar a
      propriedade e submeter `https://lokit.pt/sitemap.xml`.
- [ ] **Cloudflare Web Analytics**: criar o site, copiar o token para
      `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` em `.env.production`.
      Atenção: a conta pode ter mais do que um site. Trocar os tokens manda as
      visitas de um para o balde do outro, e já aconteceu neste grupo.
- [ ] **Monitor externo** a verificar `https://lokit.pt/api/health` de 5 em 5
      minutos, com alerta por email.
- [ ] **WAF**: regra de limite de ritmo em `/api/*`, 10 pedidos por minuto e por
      IP, e Bot Fight Mode ligado.
- [ ] **Cloudflare Access** à frente das pré-visualizações, para não ficarem
      indexadas nem visíveis a quem não deve.
- [ ] Uma semana depois, ler os relatórios da CSP e mudar `CSP_MODE` para
      `enforce`.

## 9. Quando a sociedade estiver registada

- [ ] Confirmar o NIPC contra a certidão permanente e actualizar
      `lib/company.ts` se for preciso.
- [ ] Registar o **Livro de Reclamações electrónico** e pôr o URL em
      `lib/company.ts`. O rodapé mostra a ligação automaticamente.
- [ ] Indicar a entidade de **resolução alternativa de litígios** na página de
      termos.
- [ ] Rever as três páginas legais e actualizar a data em `lib/legal.ts`.
