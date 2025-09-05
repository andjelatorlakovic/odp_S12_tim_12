import type { ApiResponseDelete, ApiResponseKviz, ApiResponseKvizList } from "../../types/quiz/ApiResponseQuiz";

export interface IQuizApiService {
  dobaviSveKvizove(token: string): Promise<ApiResponseKvizList>;

  dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKviz>;
  dobaviKvizovePoJezikuINivou(jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKvizList>;
  kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string, token: string): Promise<ApiResponseKviz>;

  dobaviKvizPoId(id: number, token: string): Promise<ApiResponseKviz>;

  obrisiKviz(id: number, token: string): Promise<ApiResponseDelete>;
}
