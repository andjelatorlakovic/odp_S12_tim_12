import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";
import type { ApiResponseQuizCountList } from "../../types/userQuiz/ApiResponseQuizCount";
import type { ApiResponseDelete, ApiResponseKvizStatistika, ApiResponseUserQuiz, ApiResponseUserQuizList } from "../../types/userQuiz/ApiResponseUserQuiz";

export interface IUserQuizApiService {

  dobaviSveRezultate(token: string): Promise<ApiResponseUserQuizList>;

  dobaviRezultatPoUserIKviz(userId: number, kvizId: number, token: string): Promise<ApiResponseUserQuiz>;

  dobaviRezultatePoUser(userId: number, token: string): Promise<ApiResponseUserQuizList>;

  dobaviRezultatePoKviz(kvizId: number, token: string): Promise<ApiResponseUserQuizList>;
  dobaviBrojKvizovaPoUseru(token: string): Promise<ApiResponseQuizCountList>;
  dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri(token: string): Promise<ApiResponseKvizStatistika>;
  dobaviZavrseneNivoePoKorisnickomImenu(korIme: string, token: string): Promise<FinishedLanguageLevelDto[]>;
  kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number,
    token: string
  ): Promise<ApiResponseUserQuiz>;

  azurirajProcenat(userId: number, kvizId: number, procenat: number, token: string): Promise<ApiResponseUserQuiz>;

  obrisiRezultat(userId: number, kvizId: number, token: string): Promise<ApiResponseDelete>;
}
