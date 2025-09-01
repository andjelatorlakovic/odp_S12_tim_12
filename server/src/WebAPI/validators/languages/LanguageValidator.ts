import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaAuth(jezik?: string): RezultatValidacije {
  if (!jezik) {
    return { uspesno: false, poruka: 'Језик је обавезан.' };
  }

  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Корисничко име мора имати најмање 3 карактера.' };
  }
  return { uspesno: true };
}
