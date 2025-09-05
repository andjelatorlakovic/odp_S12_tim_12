import axios from 'axios';
import type { ApiResponseKviz, ApiResponseKvizList, ApiResponseDelete } from '../../types/quiz/ApiResponseQuiz';
import type { IQuizApiService } from './IQuizApiService';

const API_URL: string = import.meta.env.VITE_API_URL + "kviz";


export const kvizApi: IQuizApiService = {

  async dobaviSveKvizove(token: string): Promise<ApiResponseKvizList> {
    try {
      const response = await axios.get<ApiResponseKvizList>(`${API_URL}/All`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      let message = "Greška pri dohvatanju svih kvizova.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: [] };
    }
  },

  async kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKviz> {
    try {
      const response = await axios.post<ApiResponseKviz>(`${API_URL}/Kreiraj`, 
        { naziv_kviza, jezik, nivo_znanja },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      let message = "Greška pri kreiranju kviza.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizPoId(id: number, token: string): Promise<ApiResponseKviz> {
    try {
      const response = await axios.get<ApiResponseKviz>(`${API_URL}/Id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id },
      });
      return response.data;
    } catch (error) {
      let message = "Greška pri dohvatanju kviza po ID.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKviz> {
    try {
      const response = await axios.get<ApiResponseKviz>(`${API_URL}/Pretraga`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { naziv_kviza, jezik, nivo_znanja },
      });
      return response.data;
    } catch (error) {
      let message = "Greška pri dohvatanju kviza po naziv-jezik-nivo.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: null };
    }
  },

  async dobaviKvizovePoJezikuINivou(jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKvizList> {
    try {
      const response = await axios.get<ApiResponseKvizList>(`${API_URL}/Filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { jezik, nivo_znanja },
      });
      return response.data;
    } catch (error) {
      let message = "Greška pri filtriranju kvizova po jeziku i nivou.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: [] };
    }
  },

  async obrisiKviz(id: number, token: string): Promise<ApiResponseDelete> {
    try {
      const response = await axios.delete<ApiResponseDelete>(`${API_URL}/Obrisi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id },
      });
      return response.data;
    } catch (error) {
      let message = "Greška pri brisanju kviza.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message };
    }
  },
};
