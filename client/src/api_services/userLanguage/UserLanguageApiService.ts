import axios from "axios";
import type { ApiResponseUserLanguageLevel, ApiResponseLanguagesList } from "../../types/userLanguage/ApiResponseUserLanguage";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL_ADD = API_BASE + "userLanguagesAdd";
const API_URL_MISSING = API_BASE + "userLanguagesMissing";
const API_URL_BY_USER_AND_LANGUAGE = API_BASE + "userLanguageByUserAndLanguage";

const getToken = () => localStorage.getItem("authToken");

export const userLanguageLevelApi = {
  async dodajUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<ApiResponseUserLanguageLevel> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post<ApiResponseUserLanguageLevel>(API_URL_ADD, { userId, jezik, nivo }, config);
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

  async getLanguagesUserDoesNotHave(userId: number): Promise<ApiResponseLanguagesList> {
    try {
      const token = getToken();
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId },
          }
        : { params: { userId } };
      const response = await axios.get<ApiResponseLanguagesList>(API_URL_MISSING, config);
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

  async getByUserAndLanguage(userId: number, jezik: string): Promise<ApiResponseUserLanguageLevel> {
    try {
      const token = getToken();
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId, jezik },
          }
        : { params: { userId, jezik } };
      const response = await axios.get<ApiResponseUserLanguageLevel>(API_URL_BY_USER_AND_LANGUAGE, config);
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
