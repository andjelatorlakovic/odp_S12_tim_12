import type { ApiResponseLanguageLevel } from '../../types/languageLevels/ApiResponseLanguageLevel';
import type { JezikSaNivoima } from '../../types/languageLevels/ApiResponseLanguageWithLevel';
import type { ILanguageLevelAPIService } from './ILanguageLevelApiService';
import type { LanguageLevelsDto } from '../../models/languageLevels/LanguageLevelsDto'; // DTO interface
import axios from 'axios';

// Endpoints
const API_URL_ADD: string = import.meta.env.VITE_API_URL + "addLanguageLevel";
const API_URL_WITH_LEVELS: string = import.meta.env.VITE_API_URL + "languagesWithLevels";
const API_URL_LEVELS_BY_LANGUAGE: string = import.meta.env.VITE_API_URL + "levels"; // query param

// Token helper
const getToken = () => localStorage.getItem('authToken');

export class LanguageLevelAPIService implements ILanguageLevelAPIService {
  private apiUrlAdd: string;
  private apiUrlWithLevels: string;
  private apiUrlLevelsByLanguage: string;

  constructor() {
    this.apiUrlAdd = API_URL_ADD;
    this.apiUrlWithLevels = API_URL_WITH_LEVELS;
    this.apiUrlLevelsByLanguage = API_URL_LEVELS_BY_LANGUAGE;
  }

  getAllLanguageLevels(): Promise<ApiResponseLanguageLevel> {
    throw new Error('Method not implemented.');
  }

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

  async getLanguagesWithLevels(): Promise<JezikSaNivoima[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

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

  // Dohvati nivoe za dati jezik (query parametar)
  async getLevelsByLanguage(jezik: string): Promise<LanguageLevelsDto> {
    try {
      const token = getToken();
      const config = token 
        ? { headers: { Authorization: `Bearer ${token}` }, params: { jezik } } 
        : { params: { jezik } };

      const response = await axios.get<LanguageLevelsDto>(this.apiUrlLevelsByLanguage, config);
      return response.data;
    } catch (error) {
      console.error(`❌ Greška pri dohvatanju nivoa za jezik "${jezik}":`, error);
      return { jezik, nivoi: ['Nema nivoa'] };
    }
  }
}
