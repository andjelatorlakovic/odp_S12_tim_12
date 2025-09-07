type Pitanje = {
  pitanje: string;
  odgovori: string[];
  tacanOdgovor: string;
};

interface ValidacijaRezultat {
  uspesno: boolean;
  poruka: string;
}

export function validacijaDuplikataPitanjaIPonovljenihOdgovora(pitanja: Pitanje[]): ValidacijaRezultat {
  // Provera duplikata pitanja (case insensitive i trim za preciznost)
  const pitanjaSet = new Set<string>();
  for (let i = 0; i < pitanja.length; i++) {
    const pText = pitanja[i].pitanje.trim().toLowerCase();
    if (pitanjaSet.has(pText)) {
      return {
        uspesno: false,
        poruka: `Pitanje broj ${i + 1} je duplikat.`,
      };
    }
    pitanjaSet.add(pText);

    // Provera duplikata odgovora unutar pitanja (takođe case insensitive i trim)
    const odgovoriSet = new Set<string>();
    for (let j = 0; j < pitanja[i].odgovori.length; j++) {
      const oText = pitanja[i].odgovori[j].trim().toLowerCase();
      if (odgovoriSet.has(oText)) {
        return {
          uspesno: false,
          poruka: `U pitanju broj ${i + 1} postoji duplirani odgovor: "${pitanja[i].odgovori[j]}".`,
        };
      }
      odgovoriSet.add(oText);
    }
  }

  return {
    uspesno: true,
    poruka: "",
  };
}
