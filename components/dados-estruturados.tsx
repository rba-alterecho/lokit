import { headers } from 'next/headers';

// JSON-LD com o nonce da CSP.
//
// Le o nonce por si em vez de o receber por propriedade: assim nenhuma pagina
// se pode esquecer dele, que era o erro obvio a acontecer daqui a tres meses
// quando alguem acrescentar a decima pagina.
export async function DadosEstruturados({ dados }: { dados: object }) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, '\\u003c') }}
    />
  );
}
