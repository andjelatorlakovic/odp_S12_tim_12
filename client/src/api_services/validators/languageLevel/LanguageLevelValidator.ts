import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

export function validacijaPodataka(jezik?: string, nivo?: string): RezultatValidacije {
  if (!jezik) {
    return { uspesno: false, poruka: 'Jezik je obavezan.' };
  }

  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Jezik mora imati najmanje 3 karaktera.' };
  }

  if (!nivo || nivo.length === 0) {
    return { uspesno: false, poruka: 'Nivo je obavezan.' };
  }

  return { uspesno: true };
}
