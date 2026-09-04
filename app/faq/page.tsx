import { Botao, Container, Migalhas, Seccao, Sobrescrito, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdMigalhas, jsonLdPerguntas, metadados } from '@/lib/seo';
import { PERGUNTAS } from '@/content/faq';

export const metadata = metadados({
  titulo: 'Perguntas frequentes',
  descricao:
    'Respostas às perguntas mais comuns sobre os cacifos automáticos Lokit, para quem os usa e para quem quer instalar uma unidade no seu espaço.',
  caminho: '/faq',
});

function Lista({ grupo }: { grupo: 'utilizador' | 'parceiro' }) {
  return (
    <dl className="mt-6 divide-y divide-rule border-y border-rule">
      {PERGUNTAS.filter((p) => p.grupo === grupo).map((p) => (
        <div key={p.pergunta} className="py-5">
          <dt className="mb-1.5 font-semibold">{p.pergunta}</dt>
          <dd className="max-w-2xl text-[15px] leading-relaxed text-ink-2">{p.resposta}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Faq() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Perguntas frequentes', caminho: '/faq' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Perguntas frequentes</Titulo>

        <div className="mt-10">
          <Sobrescrito>Para quem usa um cacifo</Sobrescrito>
          <Lista grupo="utilizador" />
        </div>

        <div className="mt-12">
          <Sobrescrito>Para quem tem um espaço</Sobrescrito>
          <Lista grupo="parceiro" />
        </div>

        <div className="mt-10">
          <Botao href="/parcerias#pedido">Fazer uma pergunta que não está aqui</Botao>
        </div>
      </Seccao>

      <DadosEstruturados dados={jsonLdPerguntas(PERGUNTAS)} />
      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Perguntas frequentes', caminho: '/faq' },
        ])}
      />
    </>
  );
}
