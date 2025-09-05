import axios from 'axios';
import type { ApiResponseLanguageLevel } from '../../types/languageLevels/ApiResponseLanguageLevel';
import type { JezikSaNivoima } from '../../types/languageLevels/ApiResponseLanguageWithLevel';
import type { LanguageLevelsDto } from '../../models/languageLevels/LanguageLevelsDto';
import type { ILanguageLevelAPIService } from './ILanguageLevelApiService';

const API_URL: string = import.meta.env.VITE_API_URL + 'languageLevel';

export const LanguageLevelAPIService: ILanguageLevelAPIService = {

  async dodajLanguageLevel(jezik: string, naziv: string, token: string): Promise<ApiResponseLanguageLevel> {
    try {
      const response = await axios.post<ApiResponseLanguageLevel>(`${API_URL}/Add`, { jezik, naziv }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Greška prilikom dodavanja jezik-nivo para:", error);
      throw new Error('Failed to add language level');
    }
  },

  async getLanguagesWithLevels(): Promise<JezikSaNivoima[]> {
    try {
      const response = await axios.get<JezikSaNivoima[]>(`${API_URL}/With`
      );
      return response.data.map(lang => ({
        jezik: lang.jezik,
        nivoi: lang.nivoi.length > 0 ? lang.nivoi : ['Nema nivoa'],
      }));
    } catch (error) {
      console.error("❌ Greška pri dohvatanju jezika sa nivoima:", error);
      return [];
    }
  },

  async getLevelsByLanguage(jezik: string, token: string): Promise<LanguageLevelsDto> {
    try {
      const response = await axios.get<LanguageLevelsDto>(`${API_URL}/levels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { jezik },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Greška pri dohvatanju nivoa za jezik "${jezik}":`, error);
      return { jezik, nivoi: ['Nema nivoa'] };
    }
  },
};
