import type { ApiResponseLanguage } from "../../types/languages/ResponseApiLAnguage"; // Uvozimo tip za odgovor API-ja

export interface ILanguageAPIService {
  // Metoda za dodavanje jezika
  dodajJezik(jezik: string, nivo: string): Promise<ApiResponseLanguage>;

  // Metoda za dohvatanje svih jezika
  getAllLanguages(): Promise<ApiResponseLanguage>;
}
