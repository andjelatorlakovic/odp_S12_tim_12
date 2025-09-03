import axios from "axios";
import type {
  ApiResponseDelete,
  ApiResponseUserQuiz,
  ApiResponseUserQuizList,
  ApiResponseKvizStatistika
} from "../../types/userQuiz/ApiResponseUserQuiz";
import type { IUserQuizApiService } from "./IUserQuizApiService";
import type { ApiResponseQuizCountList } from "../../types/userQuiz/ApiResponseQuizCount";
import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";

const API_URL_REZULTATI = import.meta.env.VITE_API_URL + "rezultati";
const API_URL_REZULTAT = import.meta.env.VITE_API_URL + "rezultat";
const API_URL_REZULTATI_USER = import.meta.env.VITE_API_URL + "rezultatiUser";
const API_URL_REZULTATI_KVIZ = import.meta.env.VITE_API_URL + "rezultatiKviz";
const API_URL_AZURIRAJ_PROCENT = import.meta.env.VITE_API_URL + "azurirajProcenat";
const API_URL_OBRISI_REZULTAT = import.meta.env.VITE_API_URL + "obrisiRezultat";
const API_URL_KVIZOVI_PREKO_85_BROJ_3 = import.meta.env.VITE_API_URL + "kvizoviPreko85SaBrojemVecimOdTri";
const API_URL_BROJ_KVIZOVA_PO_USERU = import.meta.env.VITE_API_URL + "brojKvizovaPoUseru"; 
const API_URL_FINISHED_LEVELS = import.meta.env.VITE_API_URL + "userLanguagesFinished";

const getToken = () => localStorage.getItem("authToken");

export class UserQuizApiService implements IUserQuizApiService {
  async dobaviSveRezultate(): Promise<ApiResponseUserQuizList> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseUserQuizList>(API_URL_REZULTATI, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju svih rezultata:", error);
      throw error;
    }
  }

  async dobaviBrojKvizovaPoUseru(): Promise<ApiResponseQuizCountList> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseQuizCountList>(API_URL_BROJ_KVIZOVA_PO_USERU, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju broja kvizova:", error);
      throw error;
    }
  }

  async dobaviRezultatPoUserIKviz(userId: number, kvizId: number): Promise<ApiResponseUserQuiz> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { userId, kvizId } }
        : { params: { userId, kvizId } };
      const res = await axios.get<ApiResponseUserQuiz>(API_URL_REZULTAT, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po user i kviz:", error);
      throw error;
    }
  }

  async dobaviRezultatePoUser(userId: number): Promise<ApiResponseUserQuizList> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { userId } }
        : { params: { userId } };
      const res = await axios.get<ApiResponseUserQuizList>(API_URL_REZULTATI_USER, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po useru:", error);
      throw error;
    }
  }

  async dobaviRezultatePoKviz(kvizId: number): Promise<ApiResponseUserQuizList> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { kvizId } }
        : { params: { kvizId } };
      const res = await axios.get<ApiResponseUserQuizList>(API_URL_REZULTATI_KVIZ, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju rezultata po kvizu:", error);
      throw error;
    }
  }

  async kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number
  ): Promise<ApiResponseUserQuiz> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post<ApiResponseUserQuiz>(
        API_URL_REZULTAT,
        { userId, kvizId, jezik, nivo, procenatTacnihOdgovora },
        config
      );
      return res.data;
    } catch (error) {
      console.error("Greška pri kreiranju rezultata:", error);
      throw error;
    }
  }

  async azurirajProcenat(userId: number, kvizId: number, procenat: number): Promise<ApiResponseUserQuiz> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.put<ApiResponseUserQuiz>(
        API_URL_AZURIRAJ_PROCENT,
        { userId, kvizId, procenat },
        config
      );
      return res.data;
    } catch (error) {
      console.error("Greška pri ažuriranju procenta:", error);
      throw error;
    }
  }

  async obrisiRezultat(userId: number, kvizId: number): Promise<ApiResponseDelete> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, data: { userId, kvizId } }
        : { data: { userId, kvizId } };
      const res = await axios.delete<ApiResponseDelete>(API_URL_OBRISI_REZULTAT, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri brisanju rezultata:", error);
      throw error;
    }
  }

  async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(): Promise<ApiResponseKvizStatistika> {
    try {
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get<ApiResponseKvizStatistika>(API_URL_KVIZOVI_PREKO_85_BROJ_3, config);
      return res.data;
    } catch (error) {
      console.error("Greška pri dohvatanju kvizova sa procentom preko 85 i brojem većim od 3:", error);
      throw error;
    }
  }

  async dobaviZavrseneNivoePoKorisnickomImenu(korIme: string): Promise<FinishedLanguageLevelDto[]> {
    try {
      const token = getToken();
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` }, params: { korIme } }
        : { params: { korIme } };
      const res = await axios.get<{ success: boolean; data: FinishedLanguageLevelDto[] }>(
        API_URL_FINISHED_LEVELS,
        config
      );
      return res.data.data;
    } catch (error) {
      console.error("Greška pri dohvatanju završenih nivoa:", error);
      throw error;
    }
  }
}
