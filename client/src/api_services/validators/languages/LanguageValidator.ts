// LanguageValidation.ts

export function validacijaPodatakaJezik(jezik: string): { uspesno: boolean; poruka: string } {
  // Provera da li je jezik unet
  if (!jezik.trim()) {
    return { uspesno: false, poruka: "Molimo unesite naziv jezika." };
  }

  // Provera da li je jezik duži od 3 karaktera
  if (jezik.trim().length < 3) {
    return { uspesno: false, poruka: "Naziv jezika mora biti duži od 3 slova." };
  }

  // Ako je sve u redu
  return { uspesno: true, poruka: "" };
}
