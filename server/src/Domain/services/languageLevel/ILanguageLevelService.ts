import { LanguageLevelDto } from "../../DTOs/languageLevel/LanguageLevelDto";

export interface ILanguageLevelService {
  dodavanjeLanguageLevel(jezik: string, naziv: string): Promise<LanguageLevelDto>;
}
