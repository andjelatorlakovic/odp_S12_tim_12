import type { RezultatValidacije } from "../../../types/validation/ValidationResult";


export function validacijaPodatakaPitanja(tekst_pitanja?: string): RezultatValidacije {
  // Provera da li je tekst pitanja unet
  if (!tekst_pitanja) {
    return { uspesno: false, poruka: 'Текст питања је обавезан.' };
  }

  // Provera da li je tekst pitanja duži od 5 karaktera
  if (tekst_pitanja.length < 5) {
    return { uspesno: false, poruka: 'Текст питања мора имати најмање 5 карактера.' };
  }

  // Ako je sve u redu
  return { uspesno: true, poruka: '' };
}
