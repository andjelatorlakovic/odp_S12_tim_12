import type { ApiResponseLanguageLevel } from '../../types/languageLevels/ApiResponseLanguageLevel';
import type { JezikSaNivoima } from '../../types/languageLevels/ApiResponseLanguageWithLevel';
import type { ILanguageLevelAPIService } from './ILanguageLevelApiService';
import axios from 'axios';

// Endpointe
const API_URL_ADD: string = import.meta.env.VITE_API_URL + "addLanguageLevel";
const API_URL_WITH_LEVELS: string = import.meta.env.VITE_API_URL + "languagesWithLevels";

// Funkcija za token
const getToken = () => localStorage.getItem('authToken');

export class LanguageLevelAPIService implements ILanguageLevelAPIService {
  private apiUrlAdd: string;
  private apiUrlWithLevels: string;

  constructor() {
    this.apiUrlAdd = API_URL_ADD;
    this.apiUrlWithLevels = API_URL_WITH_LEVELS;
  }
  getAllLanguageLevels(): Promise<ApiResponseLanguageLevel> {
    throw new Error('Method not implemented.');
  }

  // Dodavanje jezika sa nivoom
  async dodajLanguageLevel(jezik: string, naziv: string): Promise<ApiResponseLanguageLevel> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post<ApiResponseLanguageLevel>(this.apiUrlAdd, { jezik, naziv }, config);
      return response.data;
    } catch (error) {
      console.error("❌ Greška prilikom dodavanja jezik-nivo para:", error);
      throw new Error('Failed to add language level');
    }
  }

  // Dohvat svih jezika sa svim nivoima
  async getLanguagesWithLevels(): Promise<JezikSaNivoima[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Server vraća direktno niz objekata, ne data polje
      const response = await axios.get<JezikSaNivoima[]>(this.apiUrlWithLevels, config);

      return response.data.map(lang => ({
        jezik: lang.jezik,
        nivoi: lang.nivoi.length > 0 ? lang.nivoi : ['Nema nivoa'],
      }));
    } catch (error) {
      console.error("❌ Greška pri dohvatanju jezika sa nivoima:", error);
      return [];
    }
  }
}
