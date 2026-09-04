import { Container, Seccao, Titulo } from '@/components/ui';
import { metadados } from '@/lib/seo';
import { COMPANY } from '@/lib/company';

export const metadata = metadados({
  titulo: 'Ajuda',
  descricao: 'Apoio a quem está à frente de um cacifo Lokit e precisa de resolver alguma coisa agora.',
  caminho: '/ajuda',
});

// Pagina deliberadamente curta e sem imagens.
//
// Quem chega aqui esta de pe, com pressa, provavelmente com pouca bateria e com
// a rede da praia ou da discoteca. Cada elemento a mais e um segundo a mais.
export default function Ajuda() {
  return (
    <Seccao>
      <Container className="px-0">
        <Titulo nivel={1}>Precisa de ajuda?</Titulo>

        <div className="prosa mt-8">
          <h2>Não consigo abrir o cacifo</h2>
          <p>
            Confirme que está a usar a mesma ligação que recebeu ao pagar. Se a página não carregar,
            a rede do local pode estar fraca: afaste-se alguns metros da unidade e tente outra vez.
          </p>

          <h2>Já paguei e não recebi nada</h2>
          <p>
            Verifique a caixa de correio não desejado. Se em cinco minutos não tiver recebido nada,
            escreva-nos com a hora do pagamento e o local, e resolvemos.
          </p>

          <h2>Fiquei sem bateria</h2>
          <p>
            Fale com o pessoal do espaço. A abertura pode ser feita por eles, e fica registada com a
            hora e o motivo.
          </p>

          <h2>Esqueci-me de levantar as minhas coisas</h2>
          <p>
            Contacte-nos assim que puder. Os bens são recolhidos e guardados pelo espaço, e podem ser
            reclamados dentro do prazo indicado nos termos de utilização.
          </p>

          <h2>Falar connosco</h2>
          <p>
            Email: <a href={`mailto:${COMPANY.contactEmail}`}>{COMPANY.contactEmail}</a>
            <br />
            Indique o local e a hora, que é o que nos permite encontrar a unidade e o aluguer.
          </p>
        </div>
      </Container>
    </Seccao>
  );
}
