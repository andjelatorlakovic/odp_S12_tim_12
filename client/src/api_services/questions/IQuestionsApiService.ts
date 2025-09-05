import type { ApiResponseQuestion, Question } from '../../types/questions/ApiResponseQuestion';

export interface IQuestionAPIService {

  dobaviSvaPitanja(token: string): Promise<Question[]>;

  kreirajPitanje(kviz_id: number, tekst_pitanja: string, token: string): Promise<ApiResponseQuestion>;

  dobaviPitanjePoId(id: number, token: string): Promise<Question | null>;

  dobaviPitanjaZaKviz(kviz_id: number, token: string): Promise<Question[]>;

  obrisiPitanje(id: number, token: string): Promise<{ success: boolean; message: string }>;
}
