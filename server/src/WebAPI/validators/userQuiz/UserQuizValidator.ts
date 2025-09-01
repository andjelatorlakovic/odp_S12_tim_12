interface ValidacijaRezultat {
  uspesno: boolean;
  poruka?: string;
}

export function validacijaPodatakaUserQuiz(
  userId: number,
  kvizId: number,
  jezik: string,
  nivo: string,
  procenatTacnihOdgovora: number
): ValidacijaRezultat {
  if (typeof userId !== 'number' || userId <= 0) {
    return { uspesno: false, poruka: "Nevalidan userId" };
  }

  if (typeof kvizId !== 'number' || kvizId <= 0) {
    return { uspesno: false, poruka: "Nevalidan kvizId" };
  }

  if (typeof jezik !== 'string' || jezik.trim().length === 0) {
    return { uspesno: false, poruka: "Nevalidan jezik" };
  }

  if (typeof nivo !== 'string' || nivo.trim().length === 0) {
    return { uspesno: false, poruka: "Nevalidan nivo" };
  }

  if (typeof procenatTacnihOdgovora !== 'number' || procenatTacnihOdgovora < 0 || procenatTacnihOdgovora > 100) {
    return { uspesno: false, poruka: "Procenat tacnih odgovora mora biti između 0 i 100" };
  }

  return { uspesno: true };
}
