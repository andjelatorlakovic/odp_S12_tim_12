import { QuestionDto } from "../../DTOs/questions/QuestionDto";


export interface IQuestionService {
  kreirajPitanje(kviz_id: number, tekst_pitanja: string): Promise<QuestionDto>;
  dobaviSvaPitanja(): Promise<QuestionDto[]>;
  dobaviPitanjaZaKviz(kviz_id: number): Promise<QuestionDto[]>;
  dobaviPitanjePoId(id: number): Promise<QuestionDto>;
  obrisiPitanje(id: number): Promise<boolean>;
}
