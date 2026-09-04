import { Botao, Cartao, Container, Migalhas, Seccao, Sobrescrito, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdMigalhas, metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Como funciona',
  descricao:
    'Como funciona um cacifo automático Lokit: leitura do código, pagamento pelo tempo escolhido e abertura por fechadura eletrónica, sem chave e sem cadeado.',
  caminho: '/como-funciona',
});

export default function ComoFunciona() {
  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Como funciona', caminho: '/como-funciona' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Como funciona</Titulo>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          Um cacifo Lokit não tem cadeado, não tem chave e não tem código escrito num papel. A porta
          é aberta por uma fechadura eletrónica que só destranca depois de o pagamento estar
          confirmado.
        </p>

        <div className="prosa mt-10">
          <h2>Do lado de quem guarda as coisas</h2>
          <ol>
            <li>
              <strong>Lê o código.</strong> Cada unidade tem um código visível. A câmara do telemóvel
              abre a página, sem instalar nada e sem criar conta.
            </li>
            <li>
              <strong>Escolhe o tamanho e o tempo.</strong> A página mostra o que está livre naquele
              momento e quanto custa. O preço aparece antes do pagamento, não depois.
            </li>
            <li>
              <strong>Paga.</strong> Pelo telemóvel, com os meios de pagamento habituais em Portugal.
            </li>
            <li>
              <strong>Abre e volta a abrir.</strong> Enquanto o período pago não terminar, a porta
              abre as vezes que forem precisas. Ninguém tem de decidir de manhã se vai precisar da
              carteira à tarde.
            </li>
          </ol>

          <h2>E se o telemóvel ficar sem bateria?</h2>
          <p>
            É a pergunta que aparece sempre, e é justa. A abertura não depende de o telemóvel estar
            ligado: o pessoal do espaço consegue pedir a abertura de um cacifo com registo de quem
            pediu, quando, e porquê. É por isso que existe uma página de ajuda com o contacto de
            apoio, separada da página de pagamento.
          </p>

          <h2>O que não fazemos</h2>
          <p>
            Não guardamos os seus bens. Um cacifo é um espaço fechado que a pessoa aluga e usa, e a
            responsabilidade pelo conteúdo é de quem o guarda. Isto não é uma tecnicalidade: é o que
            distingue um cacifo de um serviço de depósito, e está escrito nos termos de utilização
            com o valor máximo recomendado por cacifo.
          </p>

          <h2>A tecnologia</h2>
          <p>
            O hardware é fabricado em Portugal, com estrutura em fenólico preparada para ambientes
            exteriores, ecrã anti-vandalismo e fechadura eletromagnética por porta. A plataforma de
            pagamento e de gestão corre sobre a mesma unidade, com ligação à rede do espaço ou por
            rede móvel própria quando não existe alternativa.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Cartao titulo="Tamanhos" destaque>
            Uma unidade típica tem cacifos pequenos, para telemóvel, carteira e chaves, e cacifos
            médios, para mochila, toalha e roupa. A proporção muda conforme o sítio: numa praia
            pedem-se mais pequenos, numa discoteca mais médios.
          </Cartao>
          <Cartao titulo="Períodos" destaque>
            Na praia o período natural é o dia. Na noite é a noite inteira. Em festivais é o dia de
            evento. O preço acompanha o período, em vez de contar horas soltas que ninguém consegue
            prever.
          </Cartao>
        </div>

        <div className="mt-10">
          <Sobrescrito>Tem um espaço?</Sobrescrito>
          <Botao href="/parcerias#pedido">Falar sobre uma instalação</Botao>
        </div>
      </Seccao>

      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Como funciona', caminho: '/como-funciona' },
        ])}
      />
    </>
  );
}
