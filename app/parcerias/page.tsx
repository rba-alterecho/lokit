import { Cartao, Container, Migalhas, Seccao, Sobrescrito, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { LeadForm } from '@/components/lead-form';
import { jsonLdMigalhas, metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Para parceiros',
  descricao:
    'Cacifos automáticos em praias, bares, discotecas, festivais e comércio. Três modelos de parceria: renda paga ao espaço, partilha de receita, ou serviço com valor mensal fixo.',
  caminho: '/parcerias',
});

const MODELOS = [
  {
    titulo: 'Renda paga ao espaço',
    texto:
      'Nós instalamos, operamos e assumimos o risco. O espaço recebe um valor pela cedência do lugar e não trata de nada. É o modelo mais simples quando o movimento é previsível.',
  },
  {
    titulo: 'Partilha de receita',
    texto:
      'A facturação da unidade é dividida entre nós e o espaço. Quando corre bem, ganham os dois; quando corre menos bem, ninguém fica preso a um valor fixo que já não faz sentido.',
  },
  {
    titulo: 'Serviço com valor fixo',
    texto:
      'Para quem quer o serviço a funcionar sem se preocupar com receita nenhuma, como farmácias, ginásios ou espaços de trabalho. Paga-se um valor mensal e nós tratamos do resto.',
  },
];

const VERTICAIS_INFO = [
  {
    id: 'praias',
    titulo: 'Praias e concessões',
    texto:
      'Quem vai à água não tem onde deixar o telemóvel, a carteira e as chaves. Hoje ou fica alguém na toalha, ou vai tudo enterrado na areia dentro de um saco. Uma unidade de praia resolve isto durante a época, e recolhe-se fora dela.',
    nota: 'Estrutura preparada para sal, areia e humidade. Operação sazonal, tipicamente de junho a setembro.',
  },
  {
    id: 'nocturno',
    titulo: 'Bares e discotecas',
    texto:
      'O bengaleiro é um custo com pessoal, uma fila às três da manhã e uma discussão sempre que falta um casaco. Com cacifos, cada pessoa guarda o que é seu e a responsabilidade fica onde deve estar.',
    nota: 'Período natural: a noite inteira, com abertura ilimitada enquanto durar.',
  },
  {
    id: 'eventos',
    titulo: 'Eventos e festivais',
    texto:
      'Unidades temporárias, montadas para os dias do evento e retiradas depois. A escala é diferente: fala-se em centenas de portas, e o número certo calcula-se pelos visitantes esperados por dia.',
    nota: 'Instalação e recolha incluídas no acordo, com equipa no local durante o evento.',
  },
  {
    id: 'comercio',
    titulo: 'Comércio e serviços',
    texto:
      'Farmácias, ginásios, lojas e espaços de trabalho onde o cacifo é um serviço ao cliente e não um negócio à parte. Aqui o modelo costuma ser o de valor mensal fixo, sem contas a fazer sobre receita.',
    nota: 'Configurações mais pequenas, para interior, com menos portas e menos manutenção.',
  },
];

export default function Parcerias() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Para parceiros', caminho: '/parcerias' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Cacifos no seu espaço, sem lhe dar trabalho</Titulo>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          Instalamos, operamos e mantemos. O espaço cede o lugar e a ligação à corrente. Não há
          chaves para entregar, não há inventário para gerir, e ninguém do seu pessoal passa a ser
          responsável por guardar coisas de estranhos.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {MODELOS.map((m) => (
            <Cartao key={m.titulo} titulo={m.titulo} destaque>
              {m.texto}
            </Cartao>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-2">
          Qual dos três faz sentido depende do movimento, da sazonalidade e de quem assume o
          investimento. Dizemos isso na primeira conversa, com números, e não no fim de um processo
          longo.
        </p>
      </Seccao>

      <section className="border-y border-rule bg-surface">
        <Container className="py-14 sm:py-20">
          <Sobrescrito>Por tipo de espaço</Sobrescrito>
          <Titulo>Cada sítio tem um problema diferente</Titulo>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {VERTICAIS_INFO.map((v) => (
              <div key={v.id} id={v.id} className="scroll-mt-24">
                <h3 className="mb-2 text-lg font-semibold">{v.titulo}</h3>
                <p className="mb-3 text-[15px] leading-relaxed text-ink-2">{v.texto}</p>
                <p className="text-[13px] text-ink-3">{v.nota}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Seccao id="pedido">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Sobrescrito>Falar connosco</Sobrescrito>
            <Titulo>Conte-nos como é o seu espaço</Titulo>
            <p className="mt-4 text-ink-2">
              Não é preciso ter nada decidido. Com o tipo de espaço e uma ideia do movimento já
              conseguimos dizer se faz sentido, que configuração serve, e qual dos modelos encaixa
              melhor.
            </p>
            <div className="mt-6 space-y-3 text-[15px] text-ink-2">
              <p>Respondemos em dois dias úteis.</p>
              <p>Se preferir, escreva directamente para info@lokit.pt.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-surface p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </Seccao>

      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Para parceiros', caminho: '/parcerias' },
        ])}
      />
    </>
  );
}
