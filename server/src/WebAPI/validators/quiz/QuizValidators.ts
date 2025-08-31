import { RezultatValidacije } from '../../../Domain/types/ValidationResult';

export function validacijaPodatakaKviz(
  naziv_kviza?: string,
  jezik?: string,
  nivo_znanja?: string
): RezultatValidacije {
  if (!naziv_kviza) {
    return { uspesno: false, poruka: 'Naziv kviza je obavezan.' };
  }
  if (naziv_kviza.length < 3) {
    return { uspesno: false, poruka: 'Naziv kviza mora imati najmanje 3 karaktera.' };
  }

  if (!jezik) {
    return { uspesno: false, poruka: 'Jezik je obavezan.' };
  }
  if (jezik.length < 3) {
    return { uspesno: false, poruka: 'Jezik mora imati najmanje 3 karaktera.' };
  }

  if (!nivo_znanja) {
    return { uspesno: false, poruka: 'Nivo znanja je obavezan.' };
  }
  // Ovde možeš dodati dodatne provere za nivo znanja ako želiš (npr. da li je jedan od dozvoljenih nivoa)

  return { uspesno: true };
}
