
export class UserLanguageLevelDto {
  constructor(
    public userId: number = 0,
    public jezik: string = '',
    public nivo: string = ''
  ) {}
}
