import { UserQuizResult } from "../../../Domain/models/UserKviz";


export interface IUserQuizResultRepository {
  // Vrati sve rezultate
  getAllResults(): Promise<UserQuizResult[]>;

  // Kreiraj novi rezultat
  createResult(result: UserQuizResult): Promise<UserQuizResult>;

  // Vrati rezultat po userId i kvizId
  getByUserAndKviz(userId: number, kvizId: number): Promise<UserQuizResult | null>;

  // Vrati sve rezultate za jednog korisnika
  getByUser(userId: number): Promise<UserQuizResult[]>;

  // Vrati sve rezultate za jedan kviz
  getByKviz(kvizId: number): Promise<UserQuizResult[]>;

  // Izbriši rezultat po userId i kvizId
  deleteByUserAndKviz(userId: number, kvizId: number): Promise<boolean>;
  getQuizCountByUser(): Promise<{ username: string, quizCount: number }[]>;
  countQuizzesAbove85(userId: number, jezik: string): Promise<number>;
  getQuizzesAbove85Grouped(): Promise<{ user_id: number; jezik: string; nivo: string; broj_kviza: number }[]>;
  // Ažuriraj procenat tačnih odgovora
  updateProcenat(userId: number, kvizId: number, procenat: number): Promise<boolean>;
}
