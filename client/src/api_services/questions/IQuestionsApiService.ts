import type { ApiResponseQuestion, Question } from '../../types/questions/ApiResponseQuestion';

export interface IQuestionAPIService {
  dobaviSvaPitanja(): Promise<Question[]>;

  kreirajPitanje(kviz_id: number, tekst_pitanja: string): Promise<ApiResponseQuestion>;

  dobaviPitanjePoId(id: number): Promise<Question | null>;

  dobaviPitanjaZaKviz(kviz_id: number): Promise<Question[]>;

  obrisiPitanje(id: number): Promise<{ success: boolean; message: string }>;
}
