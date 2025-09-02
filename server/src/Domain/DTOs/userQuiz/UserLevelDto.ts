export class UserQuizSummaryDto {
  public constructor(
    public userId: number = 0,
    public jezik: string = "",
    public nivo: string = "",
    public brojKviza: number = 0
  ) {}
}
