import { UserLanguageLevel } from "../../../Domain/models/UserLanguageLevel";
import { UserLanguageLevelDto } from "../../DTOs/userLanguage/UserLanguageDto";

export interface IUserLanguageLevelService {

    getByUserLanguageAndLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevelDto>;
    getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevelDto>
    createUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevelDto>;
    getLanguagesUserDoesNotHave(userId: number): Promise<string[]>;
 
}
