'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { ROTULO_VERTICAL, VERTICAIS } from '@/lib/leads';

type Estado = 'pronto' | 'a-enviar' | 'enviado' | 'erro';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function LeadForm() {
  const [estado, setEstado] = useState<Estado>('pronto');
  const [erro, setErro] = useState<string>('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const carregadoEm = useRef<number>(0);

  // Instante em que o formulario ficou visivel. Serve para medir o tempo de
  // preenchimento no servidor: um robot submete em menos de um segundo.
  useEffect(() => {
    carregadoEm.current = Date.now();
  }, []);

  async function submeter(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (estado === 'a-enviar') return;

    const form = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    setEstado('a-enviar');
    setErro('');
    setErros({});

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dados,
          carregadoEm: carregadoEm.current,
          turnstileToken: dados['cf-turnstile-response'] || '',
        }),
      });
      const corpo = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        erro?: string;
        campos?: Record<string, string>;
      };

      if (res.ok && corpo.ok) {
        setEstado('enviado');
        form.reset();
        return;
      }
      setErros(corpo.campos || {});
      setErro(corpo.erro || 'Não foi possível enviar o pedido. Tente novamente daqui a pouco.');
      setEstado('erro');
    } catch {
      setErro('Não conseguimos contactar o servidor. Verifique a ligação e tente de novo.');
      setEstado('erro');
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="rounded-xl border border-sea/40 bg-sea-soft p-6">
        <h3 className="mb-2 text-lg font-semibold">Pedido recebido</h3>
        <p className="text-[15px] leading-relaxed text-ink-2">
          Respondemos em dois dias úteis. Enviámos também uma confirmação para o email que indicou,
          e pode responder a essa mensagem se entretanto se lembrar de mais alguma coisa.
        </p>
      </div>
    );
  }

  return (
    <>
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
      <form onSubmit={submeter} noValidate className="grid gap-4">
        <Campo id="nome" etiqueta="Nome" obrigatorio erro={erros.nome} autoComplete="name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="email" etiqueta="Email" tipo="email" obrigatorio erro={erros.email} autoComplete="email" />
          <Campo id="telefone" etiqueta="Telefone (opcional)" tipo="tel" erro={erros.telefone} autoComplete="tel" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="empresa" etiqueta="Empresa ou espaço (opcional)" erro={erros.empresa} autoComplete="organization" />
          <div>
            <label htmlFor="vertical" className="mb-1.5 block text-sm font-medium">
              Tipo de espaço
            </label>
            <select
              id="vertical"
              name="vertical"
              required
              defaultValue="praia"
              className="w-full rounded-lg border border-rule bg-surface px-3 py-2.5 text-sm"
            >
              {VERTICAIS.map((v) => (
                <option key={v} value={v}>
                  {ROTULO_VERTICAL[v]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Campo
          id="localizacao"
          etiqueta="Localidade (opcional)"
          erro={erros.localizacao}
          ajuda="Ajuda a perceber a sazonalidade e a logística."
        />
        <div>
          <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium">
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={5}
            maxLength={4000}
            className="w-full rounded-lg border border-rule bg-surface px-3 py-2.5 text-sm"
            placeholder="Quantas pessoas passam pelo espaço num dia cheio, e em que altura do ano tem mais movimento?"
          />
        </div>

        {/* Campo-armadilha. Invisivel para pessoas, irresistivel para robots.
            Fica fora da ordem de tabulacao e escondido dos leitores de ecra. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Não preencher</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {SITE_KEY && <div className="cf-turnstile" data-sitekey={SITE_KEY} data-language="pt" />}

        {erro && (
          <p role="alert" className="rounded-lg border border-rule bg-signal-soft px-4 py-3 text-sm text-ink-2">
            {erro}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={estado === 'a-enviar'}
            className="inline-flex items-center rounded-lg bg-sea px-5 py-3 text-sm font-semibold text-on-sea hover:bg-sea-strong disabled:opacity-60"
          >
            {estado === 'a-enviar' ? 'A enviar...' : 'Enviar pedido'}
          </button>
          <p className="text-[13px] text-ink-3">
            Usamos estes dados só para responder ao seu pedido. Ver a{' '}
            <a href="/privacidade" className="underline underline-offset-2">
              política de privacidade
            </a>
            .
          </p>
        </div>
      </form>
    </>
  );
}

function Campo({
  id,
  etiqueta,
  tipo = 'text',
  obrigatorio = false,
  erro,
  ajuda,
  autoComplete,
}: {
  id: string;
  etiqueta: string;
  tipo?: string;
  obrigatorio?: boolean;
  erro?: string;
  ajuda?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        required={obrigatorio}
        autoComplete={autoComplete}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined}
        className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm ${
          erro ? 'border-signal' : 'border-rule'
        }`}
      />
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-[13px] text-signal">
          {erro}
        </p>
      )}
      {!erro && ajuda && (
        <p id={`${id}-ajuda`} className="mt-1 text-[13px] text-ink-3">
          {ajuda}
        </p>
      )}
    </div>
  );
}
