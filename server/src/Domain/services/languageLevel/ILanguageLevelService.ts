import { LanguageLevelDto } from "../../DTOs/languageLevel/LanguageLevelDto";
import { LanguageLevelsDto } from "../../DTOs/languageLevel/LanguageLevelsDto";

export interface ILanguageLevelService {
  dodavanjeLanguageLevel(jezik: string, naziv: string): Promise<LanguageLevelDto>;
  getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]>;
  getLevelsByLanguage(jezik: string): Promise<LanguageLevelsDto>;

}
