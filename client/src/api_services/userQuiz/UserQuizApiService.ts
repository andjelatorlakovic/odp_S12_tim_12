import axios from "axios";
import type {
  ApiResponseDelete,
  ApiResponseUserQuiz,
  ApiResponseUserQuizList,
ApiResponseKvizCount   // Dodajemo novi tip za odgovor brojanja
} from "../../types/userQuiz/ApiResponseUserQuiz";
import type { IUserQuizApiService } from "./IUserQuizApiService";

// Endpointi
const API_URL_REZULTATI = import.meta.env.VITE_API_URL + "rezultati";
const API_URL_REZULTAT = import.meta.env.VITE_API_URL + "rezultat";
const API_URL_REZULTATI_USER = import.meta.env.VITE_API_URL + "rezultatiUser";
const API_URL_REZULTATI_KVIZ = import.meta.env.VITE_API_URL + "rezultatiKviz";
const API_URL_AZURIRAJ_PROCENT = import.meta.env.VITE_API_URL + "azurirajProcenat";
const API_URL_OBRISI_REZULTAT = import.meta.env.VITE_API_URL + "obrisiRezultat";
const API_URL_BROJ_KVIZOVA_SA_85 = import.meta.env.VITE_API_URL + "brojKvizovaSa85"; // Dodali smo endpoint

// Funkcija za token
const getToken = () => localStorage.getItem("authToken");

export class UserQuizApiService implements IUserQuizApiService {
  private apiUrlRezultati = API_URL_REZULTATI;
  private apiUrlRezultat = API_URL_REZULTAT;
  private apiUrlRezultatiUser = API_URL_REZULTATI_USER;
  private apiUrlRezultatiKviz = API_URL_REZULTATI_KVIZ;
  private apiUrlAzurirajProcent = API_URL_AZURIRAJ_PROCENT;
  private apiUrlObrisiRezultat = API_URL_OBRISI_REZULTAT;
  private apiUrlBrojKvizovaSa85 = API_URL_BROJ_KVIZOVA_SA_85; // Dodali smo URL za brojanje kvizova

  private getConfig() {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  async dobaviSveRezultate(): Promise<ApiResponseUserQuizList> {
    const response = await axios.get<ApiResponseUserQuizList>(this.apiUrlRezultati, this.getConfig());
    return response.data;
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

async brojKvizovaSa85(userId: number, jezik: string): Promise<ApiResponseKvizCount> {
    const response = await axios.get<ApiResponseKvizCount>(this.apiUrlBrojKvizovaSa85, {
      ...this.getConfig(),
      params: { userId, jezik } // Ovdje šaljemo userId i jezik kao parametre
    });

    return response.data;
}

}
