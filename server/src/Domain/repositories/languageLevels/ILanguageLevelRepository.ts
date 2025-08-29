import { LanguageLevel } from "../../models/LagnuageLevel";

export interface ILanguageLevelRepository
{
    getAllLanguageLevels(): Promise<LanguageLevel[]>;
    createLanguageLevels(languageLevel: LanguageLevel): Promise<LanguageLevel>;
    getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]>;
} 