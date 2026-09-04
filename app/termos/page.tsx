import { Container, Migalhas, Seccao, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';
import { REVISTO_EM } from '@/lib/legal';

export const metadata = metadados({
  titulo: 'Termos e condições de utilização do site',
  descricao: 'Termos e condições de utilização do site lokit.pt.',
  caminho: '/termos',
});

export default function Termos() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Termos e condições', caminho: '/termos' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Termos e condições de utilização do site</Titulo>
        <p className="mt-3 text-sm text-ink-3">Última revisão: {REVISTO_EM}</p>

        <div className="prosa mt-8">
          <h2>1. Quem somos</h2>
          <p>
            Este site é propriedade de {COMPANY.legalName}, pessoa colectiva número {COMPANY.nif},
            com sede em {COMPANY.address}. Lokit é a marca comercial sob a qual a sociedade opera.
            Contacto: <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>.
          </p>
          <p>
            O registo definitivo da sociedade está em curso. Assim que estiver concluído,
            actualizamos esta página com os elementos que dele resultarem, incluindo a ligação ao
            Livro de Reclamações electrónico.
          </p>

          <h2>2. O que estes termos cobrem</h2>
          <p>
            Estes termos aplicam-se apenas à utilização deste site: às páginas informativas e aos
            formulários de contacto. A utilização de um cacifo é um contrato distinto, com termos
            próprios, apresentados no momento do aluguer e aceites antes do pagamento.
          </p>

          <h2>3. Informação publicada</h2>
          <p>
            Fazemos o possível para manter a informação correcta e actualizada. Descrições de
            equipamento, modelos de parceria, localizações e valores são indicativos e não
            constituem proposta contratual. Uma proposta vinculativa é sempre feita por escrito e
            identificada como tal.
          </p>

          <h2>4. Utilização aceitável</h2>
          <p>Ao usar este site, compromete-se a não:</p>
          <ul>
            <li>submeter dados falsos ou de terceiros sem autorização nos formulários;</li>
            <li>tentar aceder a áreas ou funcionalidades que não estejam abertas ao público;</li>
            <li>
              usar meios automatizados para submeter formulários, extrair conteúdo em massa ou
              sobrecarregar o serviço.
            </li>
          </ul>
          <p>
            Usamos mecanismos de proteção contra utilização automatizada, incluindo limites de
            frequência de pedidos. Um pedido legítimo recusado por engano resolve-se por email.
          </p>

          <h2>5. Propriedade intelectual</h2>
          <p>
            Os textos, imagens, marca e código deste site pertencem à sociedade, salvo indicação em
            contrário. Pode citar excertos com indicação da origem. Não pode reproduzir o site, no
            todo ou em parte substancial, para uso comercial.
          </p>
          <p>
            A marca Lokit está em processo de registo no Instituto Nacional da Propriedade
            Industrial.
          </p>

          <h2>6. Ligações para outros sites</h2>
          <p>
            Quando ligamos para sites de terceiros, fazemo-lo por serem úteis. Não controlamos o
            conteúdo desses sites nem respondemos por ele.
          </p>

          <h2>7. Responsabilidade</h2>
          <p>
            Este site é disponibilizado tal como está. Não garantimos funcionamento ininterrupto nem
            ausência total de erros. Na medida permitida por lei, não respondemos por danos
            indirectos resultantes da utilização ou da indisponibilidade do site. Nada nestes termos
            limita direitos que a lei confira a consumidores.
          </p>

          <h2>8. Alterações</h2>
          <p>
            Podemos alterar estes termos. A versão em vigor é sempre a publicada nesta página, com a
            data de revisão no topo.
          </p>

          <h2>9. Lei aplicável e resolução de litígios</h2>
          <p>
            Aplica-se a lei portuguesa. Em caso de litígio de consumo, o consumidor pode recorrer a
            uma entidade de resolução alternativa de litígios. A entidade competente será indicada
            nesta página assim que o serviço estiver aberto ao público e a adesão formalizada.
          </p>
        </div>
      </Seccao>
    </>
  );
}
