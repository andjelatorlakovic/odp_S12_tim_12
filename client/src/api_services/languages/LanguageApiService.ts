import type { ApiResponseLanguage } from "../../types/languages/ResponseApiLAnguage";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL + "languagesAdd";

// Funkcija za dobijanje tokena iz localStorage
const getToken = () => {
  return localStorage.getItem('authToken'); // Ispravno ime tokena
};

export const languageApi = {
  // Dodavanje jezika
  async dodajJezik(jezik: string, nivo: string): Promise<ApiResponseLanguage> {
    try {
      const token = getToken();

      // Konfiguracija zaglavlja sa tokenom ako postoji
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      // Slanje POST zahteva
      const res = await axios.post<ApiResponseLanguage>(
        API_URL,
        { jezik, nivo },
        config
      );

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

  // Dohvatanje svih jezika
  async getAllLanguages(): Promise<ApiResponseLanguage> {
    try {
      const token = getToken();

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const res = await axios.get<ApiResponseLanguage>(API_URL, config);
      return res.data;
    } catch (error) {
      let message = "Greška prilikom dohvaćanja jezika.";
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
