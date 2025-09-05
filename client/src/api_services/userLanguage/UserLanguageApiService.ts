import axios from "axios";
import type { ApiResponseUserLanguageLevel, ApiResponseLanguagesList } from "../../types/userLanguage/ApiResponseUserLanguage";
import type { IUserLanguageLevelAPIService } from "./IUserLanguageApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "userLanguage";


export const userLanguageLevelApi : IUserLanguageLevelAPIService= {

  async dodajUserLanguageLevel(userId: number, jezik: string, nivo: string, token: string): Promise<ApiResponseUserLanguageLevel> {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post<ApiResponseUserLanguageLevel>(`${API_URL}/Add`, { userId, jezik, nivo }, config);
      return response.data;
    } catch (error) {
      let message = "Greška pri dodavanju jezika korisniku.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.error("❌", message, error);
      return { success: false, message, data: null };
    }
  },

  async updateKrajNivoa(userId: number, jezik: string, nivo: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put<{ success: boolean; message: string }>(`${API_URL}/updateKrajNivoa`, { userId, jezik, nivo }, config);
      return response.data;
    } catch (error) {
      let message = "Greška pri ažuriranju datuma kraj nivoa.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.error("❌", message, error);
      return { success: false, message };
    }
  },

  async getLanguagesUserDoesNotHave(userId: number, token: string): Promise<ApiResponseLanguagesList> {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` }, params: { userId } };
      const response = await axios.get<ApiResponseLanguagesList>(`${API_URL}/Missing`, config);
      return response.data;
    } catch (error) {
      let message = "Greška pri dohvatanu jezika koje korisnik nema.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.error("❌", message, error);
      return { success: false, message, data: null };
    }
  },

  async getByUserAndLanguage(userId: number, jezik: string, token: string): Promise<ApiResponseUserLanguageLevel> {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` }, params: { userId, jezik } };
      const response = await axios.get<ApiResponseUserLanguageLevel>(`${API_URL}/ByUserAndLanguage`, config);
      return response.data;
    } catch (error) {
      let message = "Greška pri dohvatanu jezika korisnika.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.error("❌", message, error);
      return { success: false, message, data: null };
    }
  },
};
