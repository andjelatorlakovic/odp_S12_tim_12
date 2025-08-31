import { QuizDto } from "../../DTOs/quiz/QuizDto";

export interface IKvizService {
  kreirajKviz(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<QuizDto>;
  dobaviSveKvizove(): Promise<QuizDto[]>;
  dobaviKvizPoId(id: number): Promise<QuizDto>;
  dobaviKvizPoNazivJezikNivo(naziv_kviza: string, jezik: string, nivo_znanja: string): Promise<QuizDto>;
  obrisiKviz(id: number): Promise<boolean>;
}