import axios from "axios";
import type {
  ApiResponseDelete,
  ApiResponseUserQuiz,
  ApiResponseUserQuizList,
  ApiResponseKvizStatistika
} from "../../types/userQuiz/ApiResponseUserQuiz";
import type { IUserQuizApiService } from "./IUserQuizApiService";
import type { ApiResponseQuizCountList } from "../../types/userQuiz/ApiResponseQuizCount";

const API_URL_REZULTATI = import.meta.env.VITE_API_URL + "rezultati";
const API_URL_REZULTAT = import.meta.env.VITE_API_URL + "rezultat";
const API_URL_REZULTATI_USER = import.meta.env.VITE_API_URL + "rezultatiUser";
const API_URL_REZULTATI_KVIZ = import.meta.env.VITE_API_URL + "rezultatiKviz";
const API_URL_AZURIRAJ_PROCENT = import.meta.env.VITE_API_URL + "azurirajProcenat";
const API_URL_OBRISI_REZULTAT = import.meta.env.VITE_API_URL + "obrisiRezultat";
const API_URL_KVIZOVI_PREKO_85_BROJ_3 = import.meta.env.VITE_API_URL + "kvizoviPreko85SaBrojemVecimOdTri";
const API_URL_BROJ_KVIZOVA_PO_USERU = import.meta.env.VITE_API_URL + "brojKvizovaPoUseru"; 
const getToken = () => localStorage.getItem("authToken");

export class UserQuizApiService implements IUserQuizApiService {
  private apiUrlRezultati = API_URL_REZULTATI;
  private apiUrlRezultat = API_URL_REZULTAT;
  private apiUrlRezultatiUser = API_URL_REZULTATI_USER;
  private apiUrlRezultatiKviz = API_URL_REZULTATI_KVIZ;
  private apiUrlAzurirajProcent = API_URL_AZURIRAJ_PROCENT;
  private apiUrlObrisiRezultat = API_URL_OBRISI_REZULTAT;
  private apiUrlKvizoviPreko85Broj3 = API_URL_KVIZOVI_PREKO_85_BROJ_3;

  private getConfig() {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  async dobaviSveRezultate(): Promise<ApiResponseUserQuizList> {
    const response = await axios.get<ApiResponseUserQuizList>(this.apiUrlRezultati, this.getConfig());
    return response.data;
  }
 async dobaviBrojKvizovaPoUseru(): Promise<ApiResponseQuizCountList> {
    try {
      const response = await axios.get<ApiResponseQuizCountList>(API_URL_BROJ_KVIZOVA_PO_USERU, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data; // Vraćamo podatke o kvizovima
    } catch (error) {
      console.error("Greška pri dohvatanju broja kvizova:", error);
      throw error; // Bacamo grešku dalje
    }
  }
  async dobaviRezultatPoUserIKviz(userId: number, kvizId: number): Promise<ApiResponseUserQuiz> {
    const response = await axios.get<ApiResponseUserQuiz>(this.apiUrlRezultat, {
      ...this.getConfig(),
      params: { userId, kvizId }
    });
    return response.data;
  }

  async dobaviRezultatePoUser(userId: number): Promise<ApiResponseUserQuizList> {
    const response = await axios.get<ApiResponseUserQuizList>(this.apiUrlRezultatiUser, {
      ...this.getConfig(),
      params: { userId }
    });
    return response.data;
  }

  async dobaviRezultatePoKviz(kvizId: number): Promise<ApiResponseUserQuizList> {
    const response = await axios.get<ApiResponseUserQuizList>(this.apiUrlRezultatiKviz, {
      ...this.getConfig(),
      params: { kvizId }
    });
    return response.data;
  }

  async kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number
  ): Promise<ApiResponseUserQuiz> {
    const response = await axios.post<ApiResponseUserQuiz>(
      this.apiUrlRezultat,
      { userId, kvizId, jezik, nivo, procenatTacnihOdgovora },
      this.getConfig()
    );
    return response.data;
  }

  async azurirajProcenat(userId: number, kvizId: number, procenat: number): Promise<ApiResponseUserQuiz> {
    const response = await axios.put<ApiResponseUserQuiz>(
      this.apiUrlAzurirajProcent,
      { userId, kvizId, procenat },
      this.getConfig()
    );
    return response.data;
  }

  async obrisiRezultat(userId: number, kvizId: number): Promise<ApiResponseDelete> {
    const response = await axios.delete<ApiResponseDelete>(
      this.apiUrlObrisiRezultat,
      { ...this.getConfig(), data: { userId, kvizId } }
    );
    return response.data;
  }

  async dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(): Promise<ApiResponseKvizStatistika> {
    const response = await axios.get<ApiResponseKvizStatistika>(this.apiUrlKvizoviPreko85Broj3, this.getConfig());
    return response.data;
  }
  
}
