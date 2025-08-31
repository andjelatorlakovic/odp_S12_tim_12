// validations/validations.ts

export interface Pitanje {
  pitanje: string;
  odgovori: string[];
  tacanOdgovor: string; // npr. "odgovor1"
}

interface ValidacijaRezultat {
  uspesno: boolean;
  poruka: string;
}

export function validirajNazivKviza(naziv: string): ValidacijaRezultat {
  if (!naziv.trim()) {
    return { uspesno: false, poruka: "Naziv kviza ne sme biti prazan." };
  }
  return { uspesno: true, poruka: "" };
}

export function validirajJezik(jezik: string): ValidacijaRezultat {
  if (!jezik.trim()) {
    return { uspesno: false, poruka: "Molimo unesite naziv jezika." };
  }

  if (jezik.trim().length < 3) {
    return { uspesno: false, poruka: "Naziv jezika mora biti duži od 3 slova." };
  }

  return { uspesno: true, poruka: "" };
}

export function validirajNivo(nivo: string): ValidacijaRezultat {
  if (!nivo.trim()) {
    return { uspesno: false, poruka: "Izaberite nivo." };
  }
  return { uspesno: true, poruka: "" };
}

export function validirajPitanja(pitanja: Pitanje[]): ValidacijaRezultat {
  if (pitanja.length < 3) {
    return { uspesno: false, poruka: "Potrebno je uneti najmanje 3 pitanja." };
  }

  for (let i = 0; i < pitanja.length; i++) {
    const p = pitanja[i];
    if (!p.pitanje.trim()) {
      return { uspesno: false, poruka: `Pitanje ${i + 1} ne sme biti prazno.` };
    }
    for (let j = 0; j < p.odgovori.length; j++) {
      if (!p.odgovori[j].trim()) {
        return { uspesno: false, poruka: `Odgovor ${j + 1} na pitanju ${i + 1} ne sme biti prazan.` };
      }
    }
    if (!p.tacanOdgovor) {
      return { uspesno: false, poruka: `Izaberite tačan odgovor za pitanje ${i + 1}.` };
    }
  }

  return { uspesno: true, poruka: "" };
}
