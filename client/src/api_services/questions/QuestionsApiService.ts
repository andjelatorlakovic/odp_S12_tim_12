import axios from "axios";
import type { ApiResponseQuestion, Question } from "../../types/questions/ApiResponseQuestion";
import type { IQuestionAPIService } from "./IQuestionsApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "question";

export const QuestionAPIService: IQuestionAPIService = {

  async dobaviSvaPitanja(token: string): Promise<Question[]> {
    try {
      const response = await axios.get<Question[]>(`${API_URL}/All`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju svih pitanja:", error);
      return [];
    }
  },


  async kreirajPitanje(kviz_id: number, tekst_pitanja: string, token: string): Promise<ApiResponseQuestion> {
    try {
      const response = await axios.post<ApiResponseQuestion>(`${API_URL}/Add`, 
        { kviz_id, tekst_pitanja },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Greška pri kreiranju pitanja:", error);
      throw new Error("Failed to create question");
    }
  },

  async dobaviPitanjePoId(id: number, token: string): Promise<Question | null> {
    try {
      const response = await axios.get<Question>(`${API_URL}/GetId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju pitanja po ID:", error);
      return null;
    }
  },

  async dobaviPitanjaZaKviz(kviz_id: number, token: string): Promise<Question[]> {
    try {
      const response = await axios.get<Question[]>(`${API_URL}/ForQuiz/${kviz_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju pitanja za kviz:", error);
      return [];
    }
  },

  async obrisiPitanje(id: number, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete<{ success: boolean; message: string }>(`${API_URL}/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Greška pri brisanju pitanja:", error);
      return { success: false, message: "Greška pri brisanju pitanja" };
    }
  },
};
