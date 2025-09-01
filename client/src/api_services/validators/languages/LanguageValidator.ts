// LanguageValidation.ts

export function validacijaPodatakaJezik(jezik: string): { uspesno: boolean; poruka: string } {
  // Provera da li je jezik unet
  if (!jezik.trim()) {
    return { uspesno: false, poruka: "Молимо унесите назив језика." };
  }

  // Provera da li je jezik duži od 3 karaktera
  if (jezik.trim().length < 3) {
    return { uspesno: false, poruka: "Назив језика мора бити дужи од 3 слова." };
  }

  // Ako je sve u redu
  return { uspesno: true, poruka: "" };
}
