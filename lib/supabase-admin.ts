import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Cliente com service role, so para uso no servidor. Ignora RLS, portanto
// nunca pode ser importado em codigo que corra no navegador.
//
// Construido no primeiro uso e nao no import: o `next build` importa as rotas
// para recolher metadata e nao tem a chave de servico, que e um segredo.
let _admin: SupabaseClient | null = null;

export function baseDadosConfigurada(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && env('SUPABASE_SERVICE_ROLE_KEY'));
}

export function supabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      env('SUPABASE_SERVICE_ROLE_KEY') as string,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return _admin;
}
