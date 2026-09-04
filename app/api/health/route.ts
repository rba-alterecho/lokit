import { NextResponse } from 'next/server';
import { servicos } from '@/lib/env';
import { baseDadosConfigurada, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// Verificacao de saude para o monitor externo.
//
// Responde 503 quando algo essencial esta em baixo, para o monitor poder
// alertar. Nao expoe nada de sensivel: diz o que esta configurado e se a base
// de dados responde, e mais nada. Um endpoint de saude verboso e um mapa
// gratuito da infraestrutura para quem anda a sondar.
export async function GET() {
  const estado: Record<string, string> = {
    baseDados: baseDadosConfigurada() ? 'configurada' : 'ausente',
    email: servicos.email() ? 'configurado' : 'ausente',
    turnstile: servicos.turnstile() ? 'configurado' : 'ausente',
  };

  let saudavel = true;

  if (baseDadosConfigurada()) {
    try {
      const { error } = await supabaseAdmin().from('leads').select('id', { head: true, count: 'exact' }).limit(1);
      if (error) throw new Error(error.message);
      estado.baseDados = 'ok';
    } catch {
      estado.baseDados = 'erro';
      saudavel = false;
    }
  }

  return NextResponse.json(
    { ok: saudavel, estado, ts: new Date().toISOString() },
    { status: saudavel ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
