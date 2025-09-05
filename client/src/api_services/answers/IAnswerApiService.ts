import type { Answer, ApiResponseAnswer } from "../../types/answers/ApiResponseAnswer";

export interface IAnswerAPIService {
    // Dohvati sve odgovore sa prosleđenim tokenom
    dobaviSveOdgovore(token: string): Promise<Answer[]>;

    // Kreiraj novi odgovor sa prosleđenim tokenom
    kreirajOdgovor(
        pitanje_id: number,
        tekst_odgovora: string,
        tacan: boolean,
        token: string
    ): Promise<ApiResponseAnswer>;

    // Dohvati odgovore za pitanje sa prosleđenim tokenom
    dobaviOdgovoreZaPitanje(pitanje_id: number, token: string): Promise<Answer[]>;

    // Dohvati odgovor po ID sa prosleđenim tokenom
    dobaviOdgovorPoId(id: number, token: string): Promise<Answer | null>;

    // Obrisi odgovor po ID sa prosleđenim tokenom
    obrisiOdgovor(id: number, token: string): Promise<{ success: boolean; message: string }>;
}
