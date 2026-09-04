import { AdaptadorExemplo } from './fake';
import { AdaptadorMicroIO } from './microio';
import type { LockersPort } from './port';

// Escolhe o adaptador pela variavel de ambiente. Mudar de plataforma e mudar
// uma variavel, nao mexer no codigo das paginas.
//
//   LOCKERS_PROVIDER=exemplo   (defeito) dados de exemplo, deterministicos
//   LOCKERS_PROVIDER=microio   plataforma real, quando existir
let _instancia: LockersPort | null = null;

export function lockers(): LockersPort {
  if (!_instancia) {
    _instancia =
      process.env.LOCKERS_PROVIDER === 'microio' ? new AdaptadorMicroIO() : new AdaptadorExemplo();
  }
  return _instancia;
}

export function _reporAdaptador(): void {
  _instancia = null;
}

export type { LockersPort } from './port';
export * from './types';
