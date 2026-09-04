import { Container, Migalhas, Seccao, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';
import { REVISTO_EM } from '@/lib/legal';

export const metadata = metadados({
  titulo: 'Política de privacidade',
  descricao:
    'Que dados pessoais a Lokit recolhe neste site, para que servem, quanto tempo ficam guardados e como exercer os seus direitos.',
  caminho: '/privacidade',
});

export default function Privacidade() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Privacidade', caminho: '/privacidade' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Política de privacidade</Titulo>
        <p className="mt-3 text-sm text-ink-3">Última revisão: {REVISTO_EM}</p>

        <div className="prosa mt-8">
          <h2>Resumo</h2>
          <p>
            Neste site só recolhemos dados quando alguém preenche um formulário. Não usamos cookies
            de publicidade nem de análise comportamental, e por isso não verá um banner de
            consentimento. As estatísticas de visitas que recolhemos são agregadas e não permitem
            identificar ninguém.
          </p>

          <h2>Responsável pelo tratamento</h2>
          <p>
            {COMPANY.legalName}, NIPC {COMPANY.nif}, com sede em {COMPANY.address}. Para qualquer
            questão sobre dados pessoais:{' '}
            <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>.
          </p>

          <h2>Que dados recolhemos</h2>
          <h3>Quando preenche um formulário</h3>
          <ul>
            <li>nome e endereço de email, que são obrigatórios para conseguirmos responder;</li>
            <li>telefone, empresa, localidade e mensagem, quando os quiser indicar;</li>
            <li>o tipo de espaço que selecionou.</li>
          </ul>
          <p>
            Guardamos ainda, associados à submissão, um resumo criptográfico do endereço IP e uma
            classe de dispositivo (telemóvel ou computador). O resumo é gerado com uma chave secreta
            e não permite recuperar o endereço original. Serve apenas para travar abuso automatizado
            e perceber onde o formulário falha.
          </p>

          <h3>Quando visita o site</h3>
          <p>
            Usamos o Cloudflare Web Analytics, que mede visitas sem cookies e sem identificadores
            persistentes. Os dados são agregados: número de visitas, páginas mais vistas, país,
            tipo de dispositivo. Não conseguimos ligar essas estatísticas a uma pessoa.
          </p>

          <h2>Para que usamos os dados</h2>
          <ul>
            <li>
              <strong>Responder ao seu pedido</strong> e manter a conversa comercial que dele
              resultar. Base legal: diligências pré-contratuais a seu pedido, ou o nosso interesse
              legítimo em responder a quem nos contacta.
            </li>
            <li>
              <strong>Proteger o site de utilização abusiva.</strong> Base legal: interesse
              legítimo em manter o serviço disponível e livre de correio não solicitado.
            </li>
            <li>
              <strong>Cumprir obrigações legais</strong>, quando aplicável, nomeadamente fiscais e
              contabilísticas se a conversa der origem a uma relação comercial.
            </li>
          </ul>
          <p>
            Não usamos os seus dados para publicidade, não os vendemos e não os partilhamos com
            terceiros para fins próprios desses terceiros.
          </p>

          <h2>Quanto tempo guardamos</h2>
          <ul>
            <li>
              Pedidos de contacto que não deram origem a relação comercial: até 24 meses após o
              último contacto, e depois são apagados ou anonimizados.
            </li>
            <li>
              Dados associados a uma relação comercial: pelo prazo legal aplicável a documentos
              contratuais e fiscais.
            </li>
            <li>Registos técnicos de proteção contra abuso: no máximo 90 dias.</li>
          </ul>

          <h2>Quem tem acesso</h2>
          <p>
            Internamente, só quem precisa de responder ao seu pedido. Recorremos a prestadores de
            serviços que tratam dados por nossa conta, com contrato de subcontratação:
          </p>
          <ul>
            <li>
              <strong>Cloudflare</strong>, para alojamento do site, proteção contra ataques e
              estatísticas agregadas.
            </li>
            <li>
              <strong>Supabase</strong>, para a base de dados onde os pedidos ficam guardados, com
              alojamento na União Europeia.
            </li>
            <li>
              <strong>Mailjet</strong>, para o envio dos emails de confirmação e de aviso interno.
            </li>
          </ul>
          <p>
            Alguns destes prestadores podem tratar dados fora do Espaço Económico Europeu. Nesses
            casos, as transferências assentam nos mecanismos previstos na lei, nomeadamente
            cláusulas contratuais tipo aprovadas pela Comissão Europeia.
          </p>

          <h2>Os seus direitos</h2>
          <p>
            Pode pedir acesso aos seus dados, a sua correcção, o seu apagamento, a limitação do
            tratamento, a portabilidade, e pode opor-se a tratamentos baseados em interesse
            legítimo. Escreva para{' '}
            <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a> com o assunto
            RGPD. Respondemos no prazo de um mês.
          </p>
          <p>
            Se considerar que os seus dados não estão a ser tratados como devem, pode apresentar
            reclamação à Comissão Nacional de Proteção de Dados.
          </p>

          <h2>Segurança</h2>
          <p>
            O site é servido exclusivamente por ligação cifrada. Os dados dos formulários são
            gravados numa base de dados com acesso restrito ao servidor, sem leitura pública. As
            chaves de acesso aos serviços estão guardadas fora do código e são rodadas
            periodicamente.
          </p>

          <h2>Cacifos</h2>
          <p>
            Esta política cobre o site. Quando o serviço de aluguer de cacifos estiver aberto ao
            público, o tratamento de dados dessa utilização terá informação própria, apresentada no
            momento do aluguer.
          </p>
        </div>
      </Seccao>
    </>
  );
}
