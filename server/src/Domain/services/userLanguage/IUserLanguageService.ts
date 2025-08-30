import { UserLanguageLevelDto } from "../../DTOs/userLanguage/UserLanguageDto";


export interface IUserLanguageLevelService {
  getUserLanguageLevel(userId: number, jezik: string): Promise<UserLanguageLevelDto>;
  getAllUserLanguageLevels(userId: number): Promise<UserLanguageLevelDto[]>;
  addUserLanguageLevel(userLanguageLevelDto: UserLanguageLevelDto): Promise<UserLanguageLevelDto>;
  updateUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevelDto>;
  deleteUserLanguageLevel(userId: number, jezik: string): Promise<void>;
}
