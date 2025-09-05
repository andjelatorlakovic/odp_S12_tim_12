import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

export function validacijaPodatakaOdgovora(tekst_odgovora?: string): RezultatValidacije {
  if (!tekst_odgovora) {
    return { uspesno: false, poruka: 'Tekst odgovora je obavezan.' };
  }

  if (tekst_odgovora.length < 2) {
    return { uspesno: false, poruka: 'Tekst odgovora mora imati najmanje 2 karaktera.' };
  }

  return { uspesno: true };
}
