import type{ ApiResponseLanguage } from "../../types/languages/ResponseApiLAnguage"; // Importuj ApiResponseLanguage
import axios from "axios"; // Importuj axios za HTTP pozive

const API_URL: string = import.meta.env.VITE_API_URL + "languagesAdd"; // URL za API

// Funkcija za dobijanje tokena sa localStorage
const getToken = () => {
  return localStorage.getItem('token'); // Pretpostavljamo da je token sačuvan u localStorage
};

export const languageApi = {
  // Dodavanje jezika
  async dodajJezik(jezik: string, nivo: string): Promise<ApiResponseLanguage> {
    try {
      const token = getToken(); // Dohvatanje tokena

      // Ako token postoji, dodajemo ga u Authorization header
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`, // Dodajemo token u Authorization header
            },
          }
        : {};

      // Slanje POST zahteva sa tokenom u Authorization zaglavlju
      const res = await axios.post<ApiResponseLanguage>(`${API_URL}`, {
        jezik,
        nivo,
      }, config);  // Prosleđujemo config sa zaglavljem

      return res.data; // Vraćamo podatke iz odgovora
    } catch (error) {
      let message = "Greška prilikom dodavanja jezika.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: null,
      }; // Vraćamo grešku ako nešto pođe po zlu
    }
  },

  // Dohvatanje svih jezika
  async getAllLanguages(): Promise<ApiResponseLanguage> {
    try {
      const token = getToken(); // Dohvatanje tokena

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`, // Dodajemo token u Authorization header
            },
          }
        : {};

      // Slanje GET zahteva sa tokenom u Authorization zaglavlju
      const res = await axios.get<ApiResponseLanguage>(`${API_URL}`, config);
      return res.data; // Vraćamo podatke iz odgovora
    } catch (error) {
      let message = "Greška prilikom dohvaćanja jezika.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: null,
      }; // Vraćamo grešku ako nešto pođe po zlu
    }
  },
};
