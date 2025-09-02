export class UserQuizCountDto {
  public constructor(
    public username: string = "",
    public quizCount: number = 0
  ) {}
}