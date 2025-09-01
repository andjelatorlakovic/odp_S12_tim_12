import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaKviz(
  naziv_kviza?: string,
  jezik?: string,
  nivo_znanja?: string
): RezultatValidacije {
  if (!naziv_kviza) {
    return { uspesno: false, poruka: 'Назив квиза је обавезан.' };
  }
  if (naziv_kviza.length < 3) {
    return { uspesno: false, poruka: 'Назив квиза мора имати најмање 3 карактера.' };
  }

  if (!jezik) {
    return { uspesno: false, poruka: 'Језик је обавезан.' };
  }
  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Језик мора имати најмање 3 карактера.' };
  }

  if (!nivo_znanja) {
    return { uspesno: false, poruka: 'Ниво знања је обавезан.' };
  }
  
  return { uspesno: true };
}
