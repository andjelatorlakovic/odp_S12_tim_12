export class User {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = '',
    public uloga: string = 'korisnik',
    public lozinka: string = ''
  ) {}
}