# Tecnologia — Loki.T

> **Status**: 🆕 Stub criado 2026-05-21 — a preencher.

## Propósito
Stack tecnológico: plataforma MicroIO, integrações de pagamento, faturação, analytics, white-label, segurança.

## A definir

### Plataforma MicroIO
- Configuração white-label (logo, cores, domínio próprio)
- Funcionalidades incluídas vs opcionais
- Limites técnicos (volume de transacções, número de unidades)
- Acesso API (extracção de dados, integrações)

### Pagamentos
- Gateway: Stripe? MB Way? Multibanco? Cartão directo?
- Fees de cada gateway (impacto na margem)
- Reconciliação automática vs manual
- Suporte a SCA (Strong Customer Authentication, PSD2)
- Política de chargebacks

### Faturação
- Moloni (opcional MicroIO €350 setup + €25/mês)
- Faturas automáticas ao cliente final (B2C) — obrigatório PT acima de €10
- Faturas B2B (parceiros, clientes prestação de serviço)
- Comunicação à AT (e-fatura)

### Conectividade
- WiFi (quando disponível no local) vs 4G/SIM (modem MicroIO €196 + €30/mês)
- Política de fallback se rede cai (modo offline?)
- Monitorização de uptime

### Analytics / dashboards
- Métricas em tempo real
- Acesso dos 3 sócios
- Ferramentas: dashboard MicroIO, Looker Studio, Notion, Google Sheets?
- Reports automáticos (semanal? mensal?)

### Segurança
- Acesso ao painel admin (2FA?)
- Auditoria de aberturas (timestamp, utilizador, motivo)
- Recuperação em caso de roubo do equipamento (GPS? tracking?)
- Backup de dados (incluído MicroIO ou separado?)
- GDPR: retenção de dados, direito ao esquecimento

### Domínio e identidade web
- Domínio: `lokit.pt` (canónico) e `lokitlockers.com` (redirecciona), comprados
- Email corporativo (Google Workspace proprio?)
- Website (institucional + mapa de unidades)

## Referências
- `supplier-tracking.md` — detalhe técnico MicroIO
- `processos-operacionais.md`
- `kpis.md`
- `marketing.md` — branding e identidade
