export class QuizDto {
  constructor(
    public id: number=0,
    public naziv_kviza: string="",
    public jezik: string="",
    public nivo_znanja: string=""
  ) {}
}