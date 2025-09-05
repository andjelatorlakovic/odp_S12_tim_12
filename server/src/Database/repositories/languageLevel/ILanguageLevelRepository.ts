import { LanguageLevel } from "../../../Domain/models/LagnuageLevel";


export interface ILanguageLevelRepository
{
    getLevelsByLanguage(jezik: string): Promise<string[]>;
    createLanguageLevels(languageLevel: LanguageLevel): Promise<LanguageLevel>;
    getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]>;
} 