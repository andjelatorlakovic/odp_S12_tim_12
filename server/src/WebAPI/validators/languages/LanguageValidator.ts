import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaAuth(jezik?: string): RezultatValidacije {
  if (!jezik) {
    return { uspesno: false, poruka: 'Jezik je obavezan.' };
  }

  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Korisnicko ime mora imati najmanje 3 karaktera.' };
  }
  return { uspesno: true };
}
