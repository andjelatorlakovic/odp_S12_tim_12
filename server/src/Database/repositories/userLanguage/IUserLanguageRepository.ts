import { UserLanguageLevel } from "../../../Domain/models/UserLanguageLevel";


export interface IUserLanguageLevelRepository {

    getByUserLanguageAndLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevel>;
    getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevel>;
    createUserLanguageLevel(userLanguageLevel: UserLanguageLevel): Promise<UserLanguageLevel>;
    getLanguagesUserDoesNotHave(userId: number): Promise<string[]>;
}
