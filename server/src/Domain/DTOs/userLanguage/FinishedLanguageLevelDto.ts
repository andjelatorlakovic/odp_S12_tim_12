export class FinishedLanguageLevelDto {
  constructor(
    public korisnickoIme: string = "",
    public jezik: string = "",
    public nivo: string = "",
    public pocetakNivoa: Date | null = null,
    public krajNivoa: Date | null = null,
    public dani: number = 0
  ) {}
}