import type { ApiResponseUserLanguageLevel, ApiResponseLanguagesList } from "../../types/userLanguage/ApiResponseUserLanguage";


export interface IUserLanguageLevelAPIService {

  dodajUserLanguageLevel(userId: number, jezik: string, nivo: string, token: string): Promise<ApiResponseUserLanguageLevel>;

  updateKrajNivoa(userId: number, jezik: string, nivo: string, token: string): Promise<{ success: boolean; message: string }>;

  getLanguagesUserDoesNotHave(userId: number, token: string): Promise<ApiResponseLanguagesList>;

  getByUserAndLanguage(userId: number, jezik: string, token: string): Promise<ApiResponseUserLanguageLevel>;
}
