import type { ApiResponseLanguageLevel } from '../../types/languageLevels/ApiResponseLanguageLevel';
import type { ILanguageLevelAPIService } from './ILanguageLevelApiService';
import axios from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL + "addLanguageLevel"; // Primer - prilagodi tačno prema backendu

const getToken = () => {
  return localStorage.getItem('authToken'); // Ispravno ime tokena
};


export class LanguageLevelAPIService implements ILanguageLevelAPIService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_URL; // koristi bazni URL iz env varijable sa dodatkom za jezik-nivo endpoint
  }

  async dodajLanguageLevel(jezik: string, naziv: string): Promise<ApiResponseLanguageLevel> {
    try {
      const token = getToken();

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      // POST zahtev na punu adresu iz this.apiUrl
      const response = await axios.post(this.apiUrl, { jezik, naziv }, config);

      return response.data;
    } catch (error) {
      console.error("Greška prilikom dodavanja jezik-nivo para:", error);
      throw new Error('Failed to add language level');
    }
  }

  async getAllLanguageLevels(): Promise<ApiResponseLanguageLevel> {
    try {
      const token = getToken();
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const response = await axios.get(this.apiUrl, config);
      return response.data;
    } catch (error) {
      console.error("Greška prilikom dohvatanja jezik-nivo parova:", error);
      throw new Error('Failed to fetch language levels');
    }
  }
}
