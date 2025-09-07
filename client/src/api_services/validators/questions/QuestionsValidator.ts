import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

export function validacijaPodatakaPitanja(tekst_pitanja?: string): RezultatValidacije {
  // Provera da li je tekst pitanja unet
  if (!tekst_pitanja) {
    return { uspesno: false, poruka: 'Tekst pitanja je obavezan.' };
  }

  // Provera da li je tekst pitanja duži od 5 karaktera
  if (tekst_pitanja.length < 3) {
    return { uspesno: false, poruka: 'Tekst pitanja mora imati najmanje 3 karaktera.' };
  }

  // Ako je sve u redu
  return { uspesno: true, poruka: '' };
}
