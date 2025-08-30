import { LanguageLevel } from "../../models/LagnuageLevel";

export interface ILanguageLevelRepository
{
  
    createLanguageLevels(languageLevel: LanguageLevel): Promise<LanguageLevel>;
    getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]>;
} 