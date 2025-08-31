import type { ApiResponseQuestion, Question } from '../../types/questions/ApiResponseQuestion';

import axios from 'axios';
import type { IQuestionAPIService } from './IQuestionsApiService';

// Endpointe
const API_URL_ALL_QUESTIONS: string = import.meta.env.VITE_API_URL + 'questionsAll';
const API_URL_ADD_QUESTION: string = import.meta.env.VITE_API_URL + 'questionAdd';
const API_URL_GET_QUESTION_BY_ID: string = import.meta.env.VITE_API_URL + 'questionGetId';
const API_URL_GET_QUESTIONS_FOR_QUIZ: string = import.meta.env.VITE_API_URL + 'questionsForQuiz';
const API_URL_DELETE_QUESTION: string = import.meta.env.VITE_API_URL + 'questionDelete';

// Funkcija za token
const getToken = () => localStorage.getItem('authToken');

export class QuestionAPIService implements IQuestionAPIService {
  private apiUrlAllQuestions: string;
  private apiUrlAddQuestion: string;
  private apiUrlGetQuestionById: string;
  private apiUrlGetQuestionsForQuiz: string;
  private apiUrlDeleteQuestion: string;

  constructor() {
    this.apiUrlAllQuestions = API_URL_ALL_QUESTIONS;
    this.apiUrlAddQuestion = API_URL_ADD_QUESTION;
    this.apiUrlGetQuestionById = API_URL_GET_QUESTION_BY_ID;
    this.apiUrlGetQuestionsForQuiz = API_URL_GET_QUESTIONS_FOR_QUIZ;
    this.apiUrlDeleteQuestion = API_URL_DELETE_QUESTION;
  }

  // Dohvati sva pitanja (zahteva autentifikaciju)
  async dobaviSvaPitanja(): Promise<Question[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Question[]>(this.apiUrlAllQuestions, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju svih pitanja:', error);
      return [];
    }
  }

  // Kreiraj novo pitanje
  async kreirajPitanje(kviz_id: number, tekst_pitanja: string): Promise<ApiResponseQuestion> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post<ApiResponseQuestion>(
        this.apiUrlAddQuestion,
        { kviz_id, tekst_pitanja },
        config
      );
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri kreiranju pitanja:', error);
      throw new Error('Failed to create question');
    }
  }

  // Dohvati pitanje po ID (zahteva autentifikaciju)
  async dobaviPitanjePoId(id: number): Promise<Question | null> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Question>(`${this.apiUrlGetQuestionById}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju pitanja po ID:', error);
      return null;
    }
  }

  // Dohvati pitanja za kviz po kviz_id (zahteva autentifikaciju)
  async dobaviPitanjaZaKviz(kviz_id: number): Promise<Question[]> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get<Question[]>(`${this.apiUrlGetQuestionsForQuiz}/${kviz_id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri dohvatanju pitanja za kviz:', error);
      return [];
    }
  }

  // Obrisi pitanje po ID (zahteva autentifikaciju)
  async obrisiPitanje(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.delete<{ success: boolean; message: string }>(`${this.apiUrlDeleteQuestion}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('❌ Greška pri brisanju pitanja:', error);
      return { success: false, message: 'Greška pri brisanju pitanja' };
    }
  }
}
