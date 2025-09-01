import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaOdgovora( tekst_odgovora?: string): RezultatValidacije {
  if (!tekst_odgovora) {
    return { uspesno: false, poruka: 'Текст одговора је обавезан.' };
  }

  if (tekst_odgovora.length < 2) {
    return { uspesno: false, poruka: 'Текст одговора мора имати најмање 2 карактера.' };
  }

  return { uspesno: true };
}
