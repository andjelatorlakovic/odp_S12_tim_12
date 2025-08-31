
import type { ApiResponseDelete, ApiResponseKviz, ApiResponseKvizList } from "../../types/quiz/ApiResponseQuiz";

export interface IQuizApiService {
  // Metoda za dodavanje jezika
 dobaviSveKvizove(): Promise<ApiResponseKvizList>;
dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<ApiResponseKviz>;
 kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<ApiResponseKviz>;
 dobaviKvizPoId(id: number): Promise<ApiResponseKviz>;
 obrisiKviz(id: number): Promise<ApiResponseDelete>;
}
