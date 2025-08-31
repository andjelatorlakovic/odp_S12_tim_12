import type { ApiResponseAnswer, Answer } from '../../types/answers/ApiResponseAnswer';
import axios from 'axios';
import type { IAnswerAPIService } from './IAnswerApiService';


// Endpointe
const API_URL_ALL_ANSWERS = import.meta.env.VITE_API_URL + 'answersAll';
const API_URL_ADD_ANSWER = import.meta.env.VITE_API_URL + 'answerAdd';
const API_URL_GET_ANSWER_BY_ID = import.meta.env.VITE_API_URL + 'answerGetId';
const API_URL_GET_ANSWERS_FOR_QUESTION = import.meta.env.VITE_API_URL + 'answersForQuestion';
const API_URL_DELETE_ANSWER = import.meta.env.VITE_API_URL + 'answerDelete';

// Funkcija za token
const getToken = () => localStorage.getItem('authToken');

export class AnswerAPIService implements IAnswerAPIService {
  private apiUrlAllAnswers: string;
  private apiUrlAddAnswer: string;
  private apiUrlGetAnswerById: string;
  private apiUrlGetAnswersForQuestion: string;
  private apiUrlDeleteAnswer: string;

  constructor() {
    this.apiUrlAllAnswers = API_URL_ALL_ANSWERS;
    this.apiUrlAddAnswer = API_URL_ADD_ANSWER;
    this.apiUrlGetAnswerById = API_URL_GET_ANSWER_BY_ID;
    this.apiUrlGetAnswersForQuestion = API_URL_GET_ANSWERS_FOR_QUESTION;
    this.apiUrlDeleteAnswer = API_URL_DELETE_ANSWER;
  }

  // Dohvati sve odgovore (zahteva autentifikaciju)
  async dobaviSveOdgovore(): Promise<Answer[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Answer[]>(this.apiUrlAllAnswers, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju svih odgovora:', error);
      return [];
    }
  }

  // Kreiraj novi odgovor
  async kreirajOdgovor(pitanje_id: number, tekst_odgovora: string, tacan: boolean): Promise<ApiResponseAnswer> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post<ApiResponseAnswer>(
        this.apiUrlAddAnswer,
        { pitanje_id, tekst_odgovora, tacan },
        config
      );
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri kreiranju odgovora:', error);
      throw new Error('Failed to create answer');
    }
  }

  // Dohvati odgovor po ID (zahteva autentifikaciju)
  async dobaviOdgovorPoId(id: number): Promise<Answer | null> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Answer>(`${this.apiUrlGetAnswerById}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju odgovora po ID:', error);
      return null;
    }
  }

  // Dohvati odgovore za pitanje po pitanje_id (zahteva autentifikaciju)
  async dobaviOdgovoreZaPitanje(pitanje_id: number): Promise<Answer[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Answer[]>(`${this.apiUrlGetAnswersForQuestion}/${pitanje_id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju odgovora za pitanje:', error);
      return [];
    }
  }

  // Obrisi odgovor po ID (zahteva autentifikaciju)
  async obrisiOdgovor(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.delete<{ success: boolean; message: string }>(`${this.apiUrlDeleteAnswer}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri brisanju odgovora:', error);
      return { success: false, message: 'Greška pri brisanju odgovora' };
    }
  }
}
