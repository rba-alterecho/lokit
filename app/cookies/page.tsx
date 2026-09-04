import { Container, Migalhas, Seccao, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';
import { REVISTO_EM } from '@/lib/legal';

export const metadata = metadados({
  titulo: 'Cookies',
  descricao: 'Que cookies este site usa e porquê. Não usamos cookies de publicidade nem de análise comportamental.',
  caminho: '/cookies',
});

export default function Cookies() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Cookies', caminho: '/cookies' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Cookies</Titulo>
        <p className="mt-3 text-sm text-ink-3">Última revisão: {REVISTO_EM}</p>

        <div className="prosa mt-8">
          <h2>Porque não há banner</h2>
          <p>
            Não usamos cookies de publicidade, de redes sociais nem de análise comportamental. A lei
            só exige consentimento para cookies que não sejam estritamente necessários, e nós não
            usamos nenhum. Por isso não verá aqui uma janela a pedir autorização, que é uma coisa
            que ninguém lê e que toda a gente fecha.
          </p>

          <h2>O que existe mesmo</h2>
          <h3>Medição de visitas sem cookies</h3>
          <p>
            Usamos o Cloudflare Web Analytics, que conta visitas sem gravar cookies e sem criar um
            identificador que siga a pessoa entre sites. Os números que vemos são agregados: quantas
            visitas, que páginas, que país, que tipo de dispositivo.
          </p>

          <h3>Proteção do formulário</h3>
          <p>
            Os formulários usam o Cloudflare Turnstile para distinguir pessoas de robots. Este
            serviço pode gravar um cookie técnico de curta duração (habitualmente chamado{' '}
            <code>__cf_bm</code>), estritamente necessário para essa verificação de segurança. Sem
            ele, o formulário ficaria aberto a envios automatizados.
          </p>

          <h3>Preferências guardadas no seu navegador</h3>
          <p>
            Neste momento, nenhuma. Se algum dia isso mudar, esta página muda com isso, antes de a
            funcionalidade ser publicada.
          </p>

          <h2>Como controlar</h2>
          <p>
            Pode bloquear ou apagar cookies nas definições do seu navegador. Como aqui só existe um
            cookie técnico de segurança, bloqueá-lo pode impedir o envio do formulário, mas não
            afecta a leitura do site.
          </p>

          <h2>Dúvidas</h2>
          <p>
            <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>
          </p>
        </div>
      </Seccao>
    </>
  );
}
