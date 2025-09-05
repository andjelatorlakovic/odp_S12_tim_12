
export function validacijaPodatakaJezik(jezik: string): { uspesno: boolean; poruka: string } {
  if (!jezik.trim()) {
    return { uspesno: false, poruka: "Molimo unesite naziv jezika." };
  }

  if (jezik.trim().length < 3) {
    return { uspesno: false, poruka: "Naziv jezika mora biti duži od 3 slova." };
  }

  return { uspesno: true, poruka: "" };
}
