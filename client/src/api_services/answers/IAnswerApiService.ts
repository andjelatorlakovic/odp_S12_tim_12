import type { Answer, ApiResponseAnswer } from "../../types/answers/ApiResponseAnswer";


export interface IAnswerAPIService {
    dobaviSveOdgovore(): Promise<Answer[]>;

    kreirajOdgovor(
        pitanje_id: number,
        tekst_odgovora: string,
        tacan: boolean
    ): Promise<ApiResponseAnswer>;

    dobaviOdgovoreZaPitanje(pitanje_id: number): Promise<Answer[]>;

    dobaviOdgovorPoId(id: number): Promise<Answer | null>;

    obrisiOdgovor(id: number): Promise<{ success: boolean; message: string }>;
}
