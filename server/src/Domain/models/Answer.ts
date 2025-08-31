export class Answer {
  public constructor(
    public id: number = 0,
    public pitanje_id: number = 0,
    public tekst_odgovora: string = '',
    public tacan: boolean = false
  ) {}
}
