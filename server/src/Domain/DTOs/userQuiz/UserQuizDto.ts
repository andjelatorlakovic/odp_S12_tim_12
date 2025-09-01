export class UserQuizResultDto {
  public constructor(
    public userId: number = 0,
    public kvizId: number = 0,
    public jezik: string = "",
    public nivo: string = "",
    public procenatTacnihOdgovora: number = 0
  ) {}
}
