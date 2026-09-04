import { Botao, Cartao, Container, Seccao, Sobrescrito, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import Link from 'next/link';

export const metadata = metadados({
  titulo: 'Lokit, cacifos automáticos para praias, bares e eventos',
  descricao:
    'Cacifos automáticos sem cadeado e sem chave, para praias, bares, discotecas, eventos e comércio em Portugal. O visitante abre pelo telemóvel e o espaço não tem de guardar nada a ninguém.',
  caminho: '/',
});

const PASSOS = [
  {
    titulo: 'Lê o código no cacifo',
    texto:
      'Não é preciso instalar nada. A câmara do telemóvel abre a página, e a página mostra os cacifos livres naquele momento.',
  },
  {
    titulo: 'Paga pelo tempo que quiser',
    texto:
      'Meio dia na praia, uma noite inteira, ou as horas de um festival. O preço aparece antes de pagar, sem surpresas no fim.',
  },
  {
    titulo: 'Abre quando precisar',
    texto:
      'A fechadura é eletrónica, portanto não há chave para perder nem cadeado para arrombar. Abre-se as vezes que forem precisas até ao fim do período pago.',
  },
];

export default function Inicio() {
  return (
    <>
      <section className="border-b border-rule bg-surface">
        <Container className="py-16 sm:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sea-soft px-3 py-1 text-xs font-medium text-sea-strong">
            Primeiras unidades em instalação
          </p>
          <Titulo nivel={1}>Cacifos automáticos para quem não pode levar tudo consigo</Titulo>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            Sem cadeado, sem chave e sem ninguém atrás de um balcão. O visitante lê o código com o
            telemóvel, paga o tempo que quer e abre o cacifo quando precisa. Para praias, bares,
            discotecas, festivais e comércio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Botao href="/parcerias#pedido">Quero cacifos no meu espaço</Botao>
            <Botao href="/como-funciona" variante="secundario">
              Ver como funciona
            </Botao>
          </div>
        </Container>
      </section>

      <Seccao>
        <Sobrescrito>Para quem tem o espaço</Sobrescrito>
        <Titulo>Um serviço que os seus clientes procuram e que não lhe dá trabalho</Titulo>
        <p className="mt-4 max-w-2xl text-ink-2">
          Guardar mochilas atrás do balcão é um favor que ninguém quer fazer e que ninguém quer
          pedir. Custa espaço, custa tempo ao pessoal, e quando desaparece alguma coisa a
          responsabilidade acaba por ser de quem guardou.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Cartao titulo="Sem pessoal dedicado">
            A unidade funciona sozinha. Não há entrega de chaves, não há senhas, não há fila ao fim
            da noite.
          </Cartao>
          <Cartao titulo="Sem investimento obrigatório">
            Há três modelos: renda paga ao espaço, partilha de receita, ou serviço com valor mensal
            fixo. Escolhe-se o que faz sentido para cada caso.
          </Cartao>
          <Cartao titulo="Preparado para exterior">
            Estrutura em fenólico, pensada para areia, sal e humidade, e não um armário de interior
            posto na praia.
          </Cartao>
        </div>
        <div className="mt-8">
          <Botao href="/parcerias" variante="secundario">
            Ver os modelos de parceria
          </Botao>
        </div>
      </Seccao>

      <section className="border-y border-rule bg-surface">
        <Container className="py-14 sm:py-20">
          <Sobrescrito>Para quem usa</Sobrescrito>
          <Titulo>Três passos, e nenhum deles é instalar uma aplicação</Titulo>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {PASSOS.map((p, i) => (
              <li key={p.titulo}>
                <span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-sea-soft text-sm font-semibold text-sea-strong">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-semibold">{p.titulo}</h3>
                <p className="text-[15px] leading-relaxed text-ink-2">{p.texto}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Seccao>
        <div className="rounded-2xl border border-rule bg-surface p-8 sm:p-10">
          <Sobrescrito>Onde estamos</Sobrescrito>
          <h2 className="text-2xl font-semibold">Ainda não há unidades abertas ao público</h2>
          <p className="mt-3 max-w-2xl text-ink-2">
            Estamos a fechar a primeira localização e a preparar a instalação. Preferimos dizer isto
            do que encher o site de mapas vazios. Se quiser saber quando abrir uma unidade perto de
            si, ou se tem um espaço onde isto faz sentido, diga-nos.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Botao href="/parcerias#pedido">Falar sobre o meu espaço</Botao>
            <Link
              href="/locais"
              className="inline-flex items-center px-1 py-3 text-sm font-medium text-sea-strong underline underline-offset-4"
            >
              Ver o estado das localizações
            </Link>
          </div>
        </div>
      </Seccao>
    </>
  );
}
