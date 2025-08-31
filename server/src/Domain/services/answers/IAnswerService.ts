import { AnswerDto } from "../../DTOs/answers/AnswerDto";


export interface IAnswerService {
  kreirajOdgovor(pitanje_id: number, tekst_odgovora: string, tacan: boolean): Promise<AnswerDto>;
  dobaviSveOdgovore(): Promise<AnswerDto[]>;
  dobaviOdgovoreZaPitanje(pitanje_id: number): Promise<AnswerDto[]>;
  dobaviOdgovorPoId(id: number): Promise<AnswerDto>;
  obrisiOdgovor(id: number): Promise<boolean>;
}
