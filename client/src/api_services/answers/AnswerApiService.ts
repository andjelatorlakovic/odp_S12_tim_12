import axios from "axios";
import type { ApiResponseAnswer, Answer } from "../../types/answers/ApiResponseAnswer";
import type { IAnswerAPIService } from './IAnswerApiService';

const API_URL: string = import.meta.env.VITE_API_URL + 'answer';

export const AnswerAPIService: IAnswerAPIService = {
  async dobaviSveOdgovore(token: string): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(`${API_URL}/All`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching all answers:', error);
      return [];
    }
  },

  async kreirajOdgovor(pitanje_id: number, tekst_odgovora: string, tacan: boolean, token: string): Promise<ApiResponseAnswer> {
    try {
      const response = await axios.post<ApiResponseAnswer>(`${API_URL}/Add`, {
        pitanje_id,
        tekst_odgovora,
        tacan,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error creating answer:', error);
      throw new Error('Failed to create answer');
    }
  },

  async dobaviOdgovorPoId(id: number, token: string): Promise<Answer | null> {
    try {
      const response = await axios.get<Answer>(`${API_URL}/GetId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching answer by ID:', error);
      return null;
    }
  },

  async dobaviOdgovoreZaPitanje(pitanje_id: number, token: string): Promise<Answer[]> {
    try {
      const response = await axios.get<Answer[]>(`${API_URL}/ForQuestion/${pitanje_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching answers for the question:', error);
      return [];
    }
  },

  async obrisiOdgovor(id: number, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete<{ success: boolean; message: string }>(`${API_URL}/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting answer:', error);
      return { success: false, message: 'Error deleting answer' };
    }
  },
};
