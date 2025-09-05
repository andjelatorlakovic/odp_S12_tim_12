import axios from "axios";
import type { ApiResponseUserQuiz, ApiResponseUserQuizList, ApiResponseDelete, ApiResponseKvizStatistika } from "../../types/userQuiz/ApiResponseUserQuiz";
import type { IUserQuizApiService } from "./IUserQuizApiService";
import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";
import type { ApiResponseQuizCountList } from "../../types/userQuiz/ApiResponseQuizCount";

const API_URL = import.meta.env.VITE_API_URL + "rezultat";
const API_URL_LANG = import.meta.env.VITE_API_URL + "userLanguage";

export const UserQuizApiService: IUserQuizApiService = {

  async dobaviSveRezultate(token: string): Promise<ApiResponseUserQuizList> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseUserQuizList>(`${API_URL}/Svi`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju svih rezultata:", error);
      throw error;
    }
  },

  async dobaviBrojKvizovaPoUseru(): Promise<ApiResponseQuizCountList> {
    try {
      
      const res = await axios.get<ApiResponseQuizCountList>(`${API_URL}/brojKvizovaPoUseru`);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju broja kvizova:", error);
      throw error;
    }
  },

  async dobaviRezultatPoUserIKviz(userId: number, kvizId: number, token: string): Promise<ApiResponseUserQuiz> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` }, params: { userId, kvizId } } : { params: { userId, kvizId } };
      const res = await axios.get<ApiResponseUserQuiz>(`${API_URL}/PoUserIKviz`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju rezultata po user i kviz:", error);
      throw error;
    }
  },

  async dobaviRezultatePoUser(userId: number, token: string): Promise<ApiResponseUserQuizList> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` }, params: { userId } } : { params: { userId } };
      const res = await axios.get<ApiResponseUserQuizList>(`${API_URL}/User`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju rezultata po useru:", error);
      throw error;
    }
  },

  async dobaviRezultatePoKviz(kvizId: number, token: string): Promise<ApiResponseUserQuizList> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` }, params: { kvizId } } : { params: { kvizId } };
      const res = await axios.get<ApiResponseUserQuizList>(`${API_URL}/Kviz`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju rezultata po kvizu:", error);
      throw error;
    }
  },

  async kreirajRezultat(userId: number, kvizId: number, jezik: string, nivo: string, procenatTacnihOdgovora: number, token: string): Promise<ApiResponseUserQuiz> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post<ApiResponseUserQuiz>(`${API_URL}/Kreiraj`, { userId, kvizId, jezik, nivo, procenatTacnihOdgovora }, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri kreiranju rezultata:", error);
      throw error;
    }
  },

  async azurirajProcenat(userId: number, kvizId: number, procenat: number, token: string): Promise<ApiResponseUserQuiz> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.put<ApiResponseUserQuiz>(`${API_URL}/azurirajProcenat`, { userId, kvizId, procenat }, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri ažuriranju procenta:", error);
      throw error;
    }
  },

  async obrisiRezultat(userId: number, kvizId: number, token: string): Promise<ApiResponseDelete> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` }, data: { userId, kvizId } } : { data: { userId, kvizId } };
      const res = await axios.delete<ApiResponseDelete>(`${API_URL}/ObrisiRezultat`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri brisanju rezultata:", error);
      throw error;
    }
  },

  async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(token: string): Promise<ApiResponseKvizStatistika> {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseKvizStatistika>(`${API_URL}/kvizoviPreko85SaBrojemVecimOdTri`, config);
      return res.data;
    } catch (error) {
      console.error("❌ Greška pri dohvatanju kvizova sa procentom preko 85 i brojem većim od 3:", error);
      throw error;
    }
  },

async dobaviZavrseneNivoePoKorisnickomImenu(korIme: string): Promise<FinishedLanguageLevelDto[]> {
  try {
    const config = { params: { korIme } }; // samo query parametar, bez Authorization headera
    const res = await axios.get<{ success: boolean; data: FinishedLanguageLevelDto[] }>(`${API_URL_LANG}/Finished`, config);
    return res.data.data;
  } catch (error) {
    console.error("❌ Greška pri dohvatanju završenih nivoa:", error);
    throw error;
  }
}

};
