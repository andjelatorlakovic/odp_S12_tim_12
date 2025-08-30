export class UserLanguageLevel {
  public constructor(
    public userId: number = 0,    // ID korisnika
    public jezik: string = "",     // Jezik koji korisnik uči
    public nivo: string = ""       // Nivo jezika korisnika
  ) {}
}
