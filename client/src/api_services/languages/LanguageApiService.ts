import type { ApiResponseLanguage } from "../../types/languages/ResponseApiLAnguage";
import axios from "axios";
import type { ILanguageAPIService } from "./ILanguageApiService";


const API_URL: string = import.meta.env.VITE_API_URL + "languagesAdd";

export const languageApi : ILanguageAPIService = {
  async dodajJezik(jezik: string, nivo: string, token: string): Promise<ApiResponseLanguage> {
    try {
      if (!token) {
        throw new Error("Nema tokena za autorizaciju.");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post<ApiResponseLanguage>(API_URL, { jezik, nivo }, config);

      return res.data;
    } catch (error) {
      let message = "Greška prilikom dodavanja jezika.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: null,
      };
    }
  },


};
