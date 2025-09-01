import { UserQuizResultDto } from "../../DTOs/userQuiz/UserQuizDto";

export interface IUserQuizResultService {
  kreirajRezultat(
    userId: number,
    kvizId: number,
    jezik: string,
    nivo: string,
    procenatTacnihOdgovora: number
  ): Promise<UserQuizResultDto>;

  dobaviSveRezultate(): Promise<UserQuizResultDto[]>;

  dobaviRezultatPoUserIKviz(userId: number, kvizId: number): Promise<UserQuizResultDto | null>;

  dobaviRezultatePoUser(userId: number): Promise<UserQuizResultDto[]>;

  dobaviRezultatePoKviz(kvizId: number): Promise<UserQuizResultDto[]>;

  obrisiRezultat(userId: number, kvizId: number): Promise<boolean>;

  azurirajProcenat(userId: number, kvizId: number, procenat: number): Promise<boolean>;
}
