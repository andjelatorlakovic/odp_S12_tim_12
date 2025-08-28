export class UserDto {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = "",
    public uloga: string = "korisnik",
    public blokiran: boolean = false
  ) {}
}
