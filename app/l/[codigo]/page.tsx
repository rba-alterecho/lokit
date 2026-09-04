import { Container, Seccao, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';

export const metadata = {
  ...metadados({
    titulo: 'Unidade Lokit',
    descricao: 'Página de acesso a uma unidade Lokit.',
    caminho: '/l',
    indexavel: false,
  }),
};

// Destino dos codigos QR impressos no equipamento.
//
// Esta rota existe desde o primeiro dia por uma razao pratica: o QR vai
// impresso no hardware e nao se reimprime. Se apontasse para o dominio da
// plataforma, mudar de fornecedor obrigaria a substituir os autocolantes de
// todos os cacifos. Apontando para aqui, muda-se o destino do lado do
// servidor e o autocolante continua certo.
//
// Enquanto nao houver plataforma ligada, mostra instrucoes e o contacto de
// apoio. O destino de cada codigo passara a vir da tabela qr_codes, nunca do
// proprio URL, para que ninguem possa transformar isto num redireccionamento
// para um site qualquer.
export default async function DestinoQr({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  // O codigo e mostrado depois de limpo. Nunca se reproduz na pagina o que
  // vier do URL sem o reduzir a um formato conhecido.
  const codigoLimpo = codigo.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 24).toUpperCase();

  return (
    <Seccao>
      <Container className="px-0">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-3">
          Unidade {codigoLimpo || 'desconhecida'}
        </p>
        <Titulo nivel={1}>Esta unidade ainda não está em serviço</Titulo>
        <div className="prosa mt-6">
          <p>
            O código foi lido corretamente, mas esta unidade ainda não está aberta ao público. Se
            encontrou este autocolante num equipamento instalado, agradecemos que nos avise: é
            provável que seja uma unidade em preparação.
          </p>
          <h2>Contacto</h2>
          <p>
            <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>
            <br />
            Indique o código {codigoLimpo || 'que aparece no equipamento'} e o local onde está.
          </p>
          <p>
            Precisa de resolver alguma coisa agora? A página de <a href="/ajuda">ajuda</a> tem as
            situações mais comuns.
          </p>
        </div>
      </Container>
    </Seccao>
  );
}
