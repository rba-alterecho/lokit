import { Botao, Container, Migalhas, Seccao, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdMigalhas, metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';

export const metadata = metadados({
  titulo: 'Contactos',
  descricao: 'Como falar com a Lokit: email, morada da sede e formulário para pedidos de parceria.',
  caminho: '/contactos',
});

export default function Contactos() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Contactos', caminho: '/contactos' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Contactos</Titulo>
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <div>
            <div className="prosa">
            <h2>Falar sobre uma parceria</h2>
            <p>
              Se tem um espaço e quer perceber se faz sentido, o formulário de parcerias é o caminho
              mais rápido: as perguntas que lá estão são as que precisamos de responder na primeira
              conversa.
            </p>

            <h2>Email</h2>
            <p>
              <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>
              <br />
              Respondemos em dois dias úteis.
            </p>

            <h2>Estou com um problema num cacifo</h2>
            <p>
              Se está neste momento à frente de uma unidade, a página de <a href="/ajuda">ajuda</a>{' '}
              é mais rápida do que o email.
            </p>
            </div>
            <div className="mt-6">
              <Botao href="/parcerias#pedido">Ir para o formulário</Botao>
            </div>
          </div>

          <div className="prosa">
            <h2>Identificação</h2>
            <ul>
              <li>{COMPANY.legalName}</li>
              <li>NIPC {COMPANY.nif}</li>
              <li>{COMPANY.address}</li>
            </ul>
            <p className="text-[13px]">
              A morada é a da sede social. Não é um espaço aberto ao público e não recebe
              correspondência comercial sem aviso prévio.
            </p>

            <h2>Proteção de dados</h2>
            <p>
              Para exercer direitos sobre os seus dados pessoais, escreva para{' '}
              <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a> com o assunto
              RGPD. Ver a <a href="/privacidade">política de privacidade</a>.
            </p>
          </div>
        </div>
      </Seccao>

      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Contactos', caminho: '/contactos' },
        ])}
      />
    </>
  );
}
