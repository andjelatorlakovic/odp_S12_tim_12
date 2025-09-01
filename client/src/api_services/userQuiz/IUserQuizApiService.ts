import type { ApiResponseDelete, ApiResponseKvizCount, ApiResponseUserQuiz, ApiResponseUserQuizList } from "../../types/userQuiz/ApiResponseUserQuiz";


export interface IUserQuizApiService {
  dobaviSveRezultate(): Promise<ApiResponseUserQuizList>;
  dobaviRezultatPoUserIKviz(userId: number, kvizId: number): Promise<ApiResponseUserQuiz>;
  dobaviRezultatePoUser(userId: number): Promise<ApiResponseUserQuizList>;
  dobaviRezultatePoKviz(kvizId: number): Promise<ApiResponseUserQuizList>;
  kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number
  ): Promise<ApiResponseUserQuiz>;
  azurirajProcenat(userId: number, kvizId: number, procenat: number): Promise<ApiResponseUserQuiz>;
  obrisiRezultat(userId: number, kvizId: number): Promise<ApiResponseDelete>;
  brojKvizovaSa85(userId: number, jezik: string): Promise<ApiResponseKvizCount>;
}