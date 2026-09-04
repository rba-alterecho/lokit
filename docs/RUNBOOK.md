# Runbook

Sintoma, causa provável, acção. Escrito à medida que se constrói, e não quando
já se está com o problema em cima.

## O site não responde

1. Cloudflare > Workers > `lokit` > Logs. Se houver erros de arranque, é quase
   sempre uma variável de ambiente em falta.
2. GitHub > Actions: o último deploy passou?
3. Reverter é publicar de novo o commit anterior: `git revert <sha>` e push.
   Não há botão de rollback no Worker que devolva a build antiga com garantias.

## `/api/health` responde 503

O corpo da resposta diz qual dos serviços está em baixo.

- `baseDados: erro` e o Supabase acessível pelo painel: verificar se a
  `SUPABASE_SERVICE_ROLE_KEY` foi rodada sem actualizar o secret do Worker.
- `baseDados: ausente`: a variável não existe. Ver `SETUP.md` secção 4.

## Chegou um alerta "Falha ao gravar lead"

O contacto **não se perdeu**: o corpo do alerta leva o pedido inteiro, e o aviso
interno para `LEADS_EMAIL` também.

1. Responder à pessoa a partir do email.
2. Gravar o pedido à mão no Supabase, ou aceitar a perda do registo se for um
   caso isolado.
3. Perceber a causa: base de dados em baixo, chave rodada, ou esquema alterado
   sem migração.

## Chegou um alerta "Formulário sem Turnstile configurado"

O formulário está a recusar pedidos em produção. Ver `SETUP.md` secção 5. Até
estar resolvido, quem tentar enviar vê a mensagem a dizer para escrever por
email, portanto ninguém fica sem caminho, mas perdem-se contactos.

## Chegou um alerta "Lead perdido"

Nem base de dados nem email funcionaram. A pessoa viu uma mensagem de erro
honesta com o endereço para escrever. O corpo do alerta tem o pedido: responder
a partir dele.

## Muitos pedidos suspeitos no formulário

1. Cloudflare > Security > Events: ver de onde vêm.
2. Apertar a regra de limite de ritmo do WAF.
3. Se persistir, criar uma regra de desafio para o país ou o intervalo de rede
   em causa.
4. O limite de ritmo da aplicação está em `lib/ratelimit.ts` e é a segunda
   linha, não a primeira.

## A CSP está a bloquear alguma coisa

Enquanto `CSP_MODE` não for `enforce`, nada é bloqueado, só reportado. Depois de
impor:

1. Consola do navegador: a mensagem diz que directiva falhou.
2. Se for um script nosso sem nonce, o problema é ele estar a ser injectado fora
   do Next. Passar o nonce.
3. Voltar a `report-only` é mudar a variável e publicar. Não é derrota, é a
   forma correcta de investigar sem o site partido.

## Uma chave escapou para o repositório

1. Rodar a chave **primeiro**. Apagar o commit não serve de nada: quem
   observava o repositório já a tem.
2. Substituir o secret no Worker ou no GitHub.
3. Só depois limpar o histórico, se valer a pena.
4. Registar em `DECISIONS.md` o que aconteceu e o que mudou para não repetir.

## Suspeita de acesso indevido a dados pessoais

1. Conter: rodar chaves, revogar acessos.
2. Avaliar o que foi exposto e a quantas pessoas diz respeito.
3. Se houver risco para os titulares, notificar a CNPD em **72 horas** a contar
   do momento em que se soube.
4. Registar tudo, com horas.
