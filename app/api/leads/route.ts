import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  chaveDeDuplicado,
  esquemaLead,
  normalizar,
  preenchidoDepressaDemais,
  textoAvisoInterno,
  textoRespostaAutomatica,
  ROTULO_VERTICAL,
} from '@/lib/leads';
import { verificarTurnstile } from '@/lib/turnstile';
import { limitar } from '@/lib/ratelimit';
import { classeDeDispositivo, ipDoPedido, registar, resumoComSal } from '@/lib/log';
import { baseDadosConfigurada, supabaseAdmin } from '@/lib/supabase-admin';
import { emailConfigured, sendEmail } from '@/lib/email';
import { notifyAdmin } from '@/lib/alert';
import { env, emProducao, servicos } from '@/lib/env';
import { COMPANY } from '@/lib/company';

// Recebe os pedidos de parceria.
//
// Ordem deliberada: validar, travar abuso, GRAVAR, e so depois avisar.
// Se o email falhar depois da gravacao, o lead esta salvo e nos ficamos a
// saber pelo alerta. Se fosse ao contrario, um erro de base de dados fazia
// desaparecer um contacto comercial sem deixar rasto.
export async function POST(req: Request) {
  const ip = ipDoPedido(req);
  const dispositivo = classeDeDispositivo(req.headers.get('user-agent'));

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: 'Pedido inválido.' }, { status: 400 });
  }

  // 1. Validacao por lista de permitidos.
  let entrada;
  try {
    entrada = esquemaLead.parse(corpo);
  } catch (e) {
    const campos: Record<string, string> = {};
    if (e instanceof ZodError) {
      for (const problema of e.errors) {
        const campo = String(problema.path[0] ?? '');
        if (campo && !campos[campo]) campos[campo] = problema.message;
      }
    }
    return NextResponse.json(
      { ok: false, erro: 'Verifique os campos assinalados.', campos },
      { status: 400 }
    );
  }

  // 2. Campo-armadilha e tempo de preenchimento.
  //
  // Respondemos 200 a quem cai na armadilha, de proposito: um robot que recebe
  // um erro tenta outra forma, um robot que recebe sucesso vai-se embora.
  if (entrada.website && entrada.website.length > 0) {
    registar('lead.armadilha', { dispositivo });
    return NextResponse.json({ ok: true });
  }
  if (preenchidoDepressaDemais(entrada.carregadoEm)) {
    registar('lead.demasiado-rapido', { dispositivo });
    return NextResponse.json({ ok: true });
  }

  // 3. Limite de ritmo. Segunda linha, depois da regra do WAF.
  const chaveIp = (await resumoComSal(ip)) || 'sem-ip';
  const veredicto = await limitar(`leads:${chaveIp}`, 5, 3600);
  if (!veredicto.permitido) {
    registar('lead.limite-de-ritmo', { dispositivo });
    return NextResponse.json(
      { ok: false, erro: 'Recebemos vários pedidos deste sítio. Tente daqui a uma hora ou escreva para ' + COMPANY.contactEmail + '.' },
      { status: 429, headers: { 'Retry-After': String(veredicto.repetirEm) } }
    );
  }

  // 4. Turnstile.
  //
  // Em producao, sem Turnstile configurado o formulario nao aceita nada. E
  // deliberado: um formulario aberto sem verificacao transforma-se em fonte de
  // correio nao solicitado em poucos dias, e o dominio paga a factura.
  if (servicos.turnstile()) {
    const resultado = await verificarTurnstile(entrada.turnstileToken, ip);
    if (!resultado.ok) {
      registar('lead.turnstile-recusado', { motivo: resultado.motivo, dispositivo });
      return NextResponse.json(
        { ok: false, erro: 'Não conseguimos confirmar que não é um robot. Recarregue a página e tente de novo.' },
        { status: 403 }
      );
    }
  } else if (emProducao()) {
    await notifyAdmin(
      'Formulário sem Turnstile configurado',
      'Um pedido foi recusado porque TURNSTILE_SECRET_KEY ou NEXT_PUBLIC_TURNSTILE_SITE_KEY não estão definidos em produção.'
    );
    return NextResponse.json(
      { ok: false, erro: 'O formulário está temporariamente indisponível. Escreva para ' + COMPANY.contactEmail + '.' },
      { status: 503 }
    );
  }

  const lead = normalizar(entrada);

  // 5. Gravar.
  let gravado = false;
  let duplicado = false;
  if (baseDadosConfigurada()) {
    try {
      const { error } = await supabaseAdmin()
        .from('leads')
        .insert({
          nome: lead.nome,
          email: lead.email,
          telefone: lead.telefone,
          empresa: lead.empresa,
          vertical: lead.vertical,
          localizacao: lead.localizacao,
          mensagem: lead.mensagem,
          origem: req.headers.get('referer') || null,
          idioma: 'pt',
          ip_hash: chaveIp,
          dispositivo,
          chave_duplicado: chaveDeDuplicado(lead),
        });

      if (error) {
        // 23505 e a violacao de chave unica: o mesmo email, no mesmo dia, para
        // a mesma vertical. Nao e erro nenhum, e alguem a carregar duas vezes.
        if (error.code === '23505') {
          duplicado = true;
          gravado = true;
        } else {
          throw new Error(`${error.code} ${error.message}`);
        }
      } else {
        gravado = true;
      }
    } catch (e) {
      await notifyAdmin(
        'Falha ao gravar lead',
        `${String(e)}\n\nLead: ${lead.email} (${ROTULO_VERTICAL[lead.vertical]})\n\n${textoAvisoInterno(lead)}`
      );
    }
  }

  // 6. Avisar. O aviso interno leva o lead inteiro, portanto mesmo que a
  // gravacao tenha falhado o contacto nao se perde.
  let avisoEnviado = false;
  if (emailConfigured()) {
    const para = env('LEADS_EMAIL') || COMPANY.contactEmail;
    const aviso = await sendEmail({
      to: { email: para, name: 'Lokit' },
      subject: `Pedido de parceria: ${lead.empresa || lead.nome} (${ROTULO_VERTICAL[lead.vertical]})`,
      text: textoAvisoInterno(lead),
      replyTo: { email: lead.email, name: lead.nome },
    });
    avisoEnviado = aviso.ok;
    if (!aviso.ok) {
      await notifyAdmin('Falha ao avisar de lead novo', `${aviso.error}\n\n${textoAvisoInterno(lead)}`);
    }

    if (!duplicado) {
      // A resposta automatica e secundaria: se falhar, o lead esta salvo e o
      // aviso interno seguiu. Nao vale um alerta por si so.
      await sendEmail({
        to: { email: lead.email, name: lead.nome },
        subject: 'Recebemos o seu pedido',
        text: textoRespostaAutomatica(lead),
      });
    }
  }

  if (!gravado && !avisoEnviado) {
    // Nem base de dados nem email. Aqui o pedido perdeu-se mesmo, e dizer que
    // correu bem seria mentir a quem esta do outro lado.
    await notifyAdmin(
      'Lead perdido: sem base de dados e sem email',
      textoAvisoInterno(lead)
    );
    return NextResponse.json(
      { ok: false, erro: 'Não conseguimos registar o seu pedido. Escreva para ' + COMPANY.contactEmail + ' e resolvemos.' },
      { status: 500 }
    );
  }

  registar('lead.recebido', { vertical: lead.vertical, dispositivo, gravado, duplicado });
  return NextResponse.json({ ok: true });
}

// Uma tentativa de GET nesta rota e quase sempre um robot a sondar. Devolve
// 405 sem explicacoes.
export function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
