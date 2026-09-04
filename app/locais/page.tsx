import { Botao, Cartao, Container, Migalhas, Seccao, Sobrescrito, Titulo } from '@/components/ui';
import { DadosEstruturados } from '@/components/dados-estruturados';
import { jsonLdMigalhas, metadados } from '@/lib/seo';
import { lockers } from '@/lib/lockers';

export const metadata = metadados({
  titulo: 'Onde estamos',
  descricao:
    'Estado das unidades Lokit. As primeiras localizações estão em preparação e a lista é actualizada à medida que abrem.',
  caminho: '/locais',
});

// Le a lista pela camada de cacifos, e nao por uma lista escrita a mao. Hoje
// por tras esta o adaptador de exemplo; quando a plataforma real existir, esta
// pagina passa a mostrar unidades verdadeiras sem uma linha alterada.
export default async function Locais() {
  const unidades = await lockers().listarUnidades();
  const activas = unidades.filter((u) => u.estado === 'activa');

  return (
    <>
      <Container className="pt-10">
        <Migalhas itens={[{ titulo: 'Início', caminho: '/' }, { titulo: 'Onde estamos', caminho: '/locais' }]} />
      </Container>

      <Seccao className="pt-2">
        <Titulo nivel={1}>Onde estamos</Titulo>

        {activas.length === 0 ? (
          <>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Ainda não há unidades abertas ao público. Estamos a fechar a primeira localização e a
              preparar a instalação para a próxima época.
            </p>
            <p className="mt-4 max-w-2xl text-ink-2">
              Podíamos encher esta página com um mapa e pontos por confirmar. Não vale a pena: quem
              chega aqui quer saber se pode contar com um cacifo hoje, e a resposta honesta é ainda
              não.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Cartao titulo="Tem um espaço onde isto faz falta?" destaque>
                É assim que as próximas unidades aparecem. Diga-nos onde é e como é o movimento, e
                respondemos em dois dias úteis.
              </Cartao>
              <Cartao titulo="Quer saber quando abrirmos perto de si?">
                Escreva para info@lokit.pt com a localidade. Guardamos só o email e a localidade, e
                usamo-los apenas para esse aviso.
              </Cartao>
            </div>

            <div className="mt-8">
              <Botao href="/parcerias#pedido">Falar sobre um espaço</Botao>
            </div>
          </>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {activas.map((u) => (
              <Cartao key={u.id} titulo={u.nome}>
                {u.localidade}, {u.distrito}
                {u.horario ? <span className="mt-2 block text-[13px] text-ink-3">{u.horario}</span> : null}
              </Cartao>
            ))}
          </div>
        )}

        <div className="mt-14">
          <Sobrescrito>Como escolhemos</Sobrescrito>
          <p className="max-w-2xl text-ink-2">
            Procuramos sítios com muita gente a passar e com um problema concreto de bagagem: praias
            com concessão, discotecas com bengaleiro em fila, festivais, e comércio de rua com
            clientes de passagem. O critério não é o tamanho do espaço, é o movimento nas horas de
            ponta.
          </p>
        </div>
      </Seccao>

      <DadosEstruturados
        dados={jsonLdMigalhas([
          { titulo: 'Início', caminho: '/' },
          { titulo: 'Onde estamos', caminho: '/locais' },
        ])}
      />
    </>
  );
}
