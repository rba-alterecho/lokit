import { Container, Migalhas, Seccao, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdMigalhas, metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';

export const metadata = metadados({
  titulo: 'Quem somos',
  descricao:
    'A Lokit é a marca de cacifos automáticos da IMOLOCKERS, LDA, empresa portuguesa com sede em Coimbra, com hardware fabricado em Portugal.',
  caminho: '/sobre',
});

export default function Sobre() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Quem somos', caminho: '/sobre' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Quem somos</Titulo>
        <div className="prosa mt-8">
          <p>
            A Lokit é a marca comercial da {COMPANY.legalName}, uma sociedade portuguesa com sede em{' '}
            {COMPANY.city}. Fazemos uma coisa só: instalar e operar cacifos automáticos em espaços
            onde as pessoas precisam de deixar as suas coisas em segurança durante algumas horas.
          </p>

          <h2>Porque é que existimos</h2>
          <p>
            A ideia veio de um problema banal. Numa praia, numa discoteca ou num festival, ou se
            arranja alguém que fique a tomar conta das coisas, ou se pede um favor a quem está atrás
            de um balcão. Nenhuma das duas soluções é boa: uma prende uma pessoa, a outra transfere
            uma responsabilidade para quem não a quer nem está preparado para ela.
          </p>
          <p>
            Em Portugal, este serviço quase não existe fora de alguns aeroportos e estações. Foi essa
            a razão para avançar.
          </p>

          <h2>Como trabalhamos</h2>
          <p>
            O equipamento é fabricado em Portugal, o que faz diferença quando é preciso substituir
            uma fechadura em agosto e não esperar três semanas por uma encomenda vinda de fora. A
            estrutura é em fenólico, material escolhido por aguentar sal, areia e humidade, porque as
            primeiras unidades vão para o litoral.
          </p>
          <p>
            Cada unidade é nossa e é operada por nós. Quem cede o espaço não passa a ter mais um
            equipamento para gerir.
          </p>

          <h2>Em que ponto estamos</h2>
          <p>
            A sociedade está constituída e o registo definitivo em curso. O fornecedor de hardware
            está escolhido e a primeira localização está a ser fechada. Ainda não há unidades abertas
            ao público, e preferimos dizê-lo aqui em vez de dar a entender o contrário.
          </p>

          <h2>Identificação</h2>
          <ul>
            <li>Firma: {COMPANY.legalName}</li>
            <li>NIPC: {COMPANY.nif}</li>
            <li>Sede: {COMPANY.address}</li>
            <li>Contacto: {COMPANY.contactEmail}</li>
          </ul>
        </div>
      </Seccao>

      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Quem somos', caminho: '/sobre' },
        ])}
      />
    </>
  );
}
