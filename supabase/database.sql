-- =============================================================================
-- Base de dados do site Lokit
-- =============================================================================
-- Correr no editor SQL do projecto Supabase. Idempotente: pode voltar a correr.
--
-- Principio: o navegador NUNCA escreve nem le directamente. Todas as
-- operacoes passam pelo servidor com a chave de servico. Por isso o RLS fica
-- activo com negacao por defeito e nao ha politicas para o papel anonimo.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- -----------------------------------------------------------------------------
-- Pedidos de parceria
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  nome text not null,
  email citext not null,
  telefone text,
  empresa text,
  vertical text not null check (vertical in ('praia','nocturno','eventos','comercio','outro')),
  localizacao text,
  mensagem text,

  origem text,
  utm jsonb,
  idioma text not null default 'pt',

  -- Resumo com sal, nunca o IP em bruto. Ver lib/log.ts.
  ip_hash text,
  dispositivo text check (dispositivo in ('movel','computador','desconhecido')),

  -- email + vertical + dia. Transforma o duplo clique num conflito de chave
  -- unica em vez de dois registos.
  chave_duplicado text unique,

  estado text not null default 'novo'
    check (estado in ('novo','contactado','qualificado','perdido','ganho')),
  notas text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_estado_idx on public.leads (estado);

-- -----------------------------------------------------------------------------
-- Historico por lead (mudancas de estado, contactos feitos)
-- -----------------------------------------------------------------------------
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  tipo text not null,
  dados jsonb
);

create index if not exists lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Codigos QR impressos no equipamento
-- -----------------------------------------------------------------------------
-- O destino vive AQUI e nunca no URL. E o que impede que /l/<codigo> possa ser
-- usado como redireccionamento para um site qualquer, e o que permite mudar de
-- plataforma sem reimprimir autocolantes.
create table if not exists public.qr_codes (
  codigo text primary key,
  unidade_id text,
  destino text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.scan_events (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  created_at timestamptz not null default now(),
  pais text,
  dispositivo text
);

create index if not exists scan_events_codigo_idx on public.scan_events (codigo, created_at desc);

-- -----------------------------------------------------------------------------
-- Seguranca
-- -----------------------------------------------------------------------------
alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.qr_codes enable row level security;
alter table public.scan_events enable row level security;

-- Sem politicas = ninguem passa. A chave de servico ignora o RLS e e a unica
-- forma de escrever, o que e exactamente o que queremos.

-- Defesa em profundidade: mesmo que um dia alguem crie uma politica por
-- engano, os papeis publicos nao tem privilegios nestas tabelas.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Retencao
-- -----------------------------------------------------------------------------
-- A politica de privacidade promete 24 meses para pedidos sem relacao
-- comercial e 90 dias para registos tecnicos. Isto e a promessa em codigo:
-- sem uma funcao que apague, a promessa fica por cumprir.
create or replace function public.limpar_dados_antigos()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Pedidos que nao deram em nada, passados 24 meses.
  delete from public.leads
   where created_at < now() - interval '24 months'
     and estado in ('novo','contactado','perdido');

  -- Registos tecnicos, passados 90 dias.
  delete from public.scan_events
   where created_at < now() - interval '90 days';
end;
$$;

-- Agendar com pg_cron (Database > Extensions > pg_cron no painel do Supabase):
--   select cron.schedule('limpeza-lokit', '0 4 * * 0', 'select public.limpar_dados_antigos()');
