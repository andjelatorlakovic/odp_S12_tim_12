import type { ApiResponseLanguageLevel } from "../../types/languageLevels/ApiResponseLanguageLevel";

export interface ILanguageLevelAPIService {
  // Metoda za dodavanje jezik-nivo para
  dodajLanguageLevel(jezik: string, naziv: string): Promise<ApiResponseLanguageLevel>;

  // Metoda za dohvatanje svih jezik-nivo parova
  getAllLanguageLevels(): Promise<ApiResponseLanguageLevel>;
}
