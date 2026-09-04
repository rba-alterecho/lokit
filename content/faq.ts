// Perguntas frequentes.
//
// Vivem num ficheiro proprio porque servem duas coisas ao mesmo tempo: a
// pagina /faq e a marcacao FAQPage que os motores de busca leem. Duas copias
// da mesma pergunta acabariam sempre por divergir.
export type Pergunta = { pergunta: string; resposta: string; grupo: 'utilizador' | 'parceiro' };

export const PERGUNTAS: Pergunta[] = [
  {
    grupo: 'utilizador',
    pergunta: 'É preciso instalar alguma aplicação?',
    resposta:
      'Não. Lê-se o código com a câmara do telemóvel, e o resto acontece numa página normal do navegador. Não é preciso criar conta.',
  },
  {
    grupo: 'utilizador',
    pergunta: 'Posso abrir o cacifo mais do que uma vez?',
    resposta:
      'Sim. Enquanto o período que pagou não terminar, a porta abre as vezes que forem precisas. Ninguém tem de decidir de manhã se vai precisar da carteira à tarde.',
  },
  {
    grupo: 'utilizador',
    pergunta: 'E se o meu telemóvel ficar sem bateria?',
    resposta:
      'A abertura não depende de o telemóvel estar ligado. O pessoal do espaço consegue pedir a abertura da porta, e esse pedido fica registado com a hora e o motivo.',
  },
  {
    grupo: 'utilizador',
    pergunta: 'O que acontece se me esquecer de levantar as minhas coisas?',
    resposta:
      'A unidade avisa antes do fim do período. Passado o prazo indicado nos termos de utilização, os bens são recolhidos e guardados pelo espaço durante o período aí definido, para poderem ser reclamados.',
  },
  {
    grupo: 'utilizador',
    pergunta: 'Quanto custa?',
    resposta:
      'Depende do sítio e do tamanho do cacifo, porque uma noite numa discoteca e um dia inteiro de praia não são a mesma coisa. O preço aparece sempre antes do pagamento, nunca depois.',
  },
  {
    grupo: 'utilizador',
    pergunta: 'Posso guardar objetos de valor?',
    resposta:
      'Um cacifo serve para telemóvel, carteira, chaves, roupa e mochila. Há um valor máximo recomendado por cacifo, indicado nos termos de utilização, e não é um serviço de depósito de valores.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'O que é que o meu espaço tem de pôr?',
    resposta:
      'O lugar e a ligação à corrente. A instalação, a manutenção, o suporte a quem usa e a operação são nossos.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'Tenho de comprar o equipamento?',
    resposta:
      'Não. Em dois dos três modelos o investimento é nosso: ou pagamos uma renda pelo espaço, ou partilhamos a receita. Comprar só faz sentido em casos específicos, e nesses dizemos porquê.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'Funciona ao ar livre?',
    resposta:
      'Sim. A estrutura é em fenólico, escolhida para aguentar sal, areia e humidade. É o material que distingue uma unidade de praia de um armário de interior posto lá fora.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'E se não houver rede no local?',
    resposta:
      'A unidade pode funcionar com a rede do espaço ou com rede móvel própria. Onde não há nem uma nem outra em condições, dizemos antes de instalar em vez de descobrir depois.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'Quanto tempo demora a instalar?',
    resposta:
      'A montagem de uma unidade típica é de um dia. O que costuma demorar mais é o que vem antes: licenciamento, autorização da concessão ou do condomínio, e ligação eléctrica.',
  },
  {
    grupo: 'parceiro',
    pergunta: 'Já têm unidades a funcionar?',
    resposta:
      'Ainda não. Estamos a fechar a primeira localização. Dizemos isto de forma clara porque preferimos uma conversa honesta a um mapa cheio de pontos que não existem.',
  },
];
