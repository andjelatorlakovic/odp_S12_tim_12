import type { ApiResponseLanguageLevel } from '../../types/languageLevels/ApiResponseLanguageLevel';
import type { JezikSaNivoima } from '../../types/languageLevels/ApiResponseLanguageWithLevel';
import type { LanguageLevelsDto } from '../../models/languageLevels/LanguageLevelsDto'; // DTO interface

export interface ILanguageLevelAPIService {
  dodajLanguageLevel(jezik: string, naziv: string, token: string): Promise<ApiResponseLanguageLevel>;

  getLanguagesWithLevels(token: string): Promise<JezikSaNivoima[]>;

  getLevelsByLanguage(jezik: string, token: string): Promise<LanguageLevelsDto>;
}
