import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaJezikNivo(jezik?: string, nivo?: string): RezultatValidacije {
  if (!jezik) {
    return { uspesno: false, poruka: 'Језик је обавезан.' };
  }

  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Језик мора имати најмање 3 карактера.' };
  }

  if (!nivo) {
    return { uspesno: false, poruka: 'Ниво је обавезан.' };
  }

  return { uspesno: true };
}
