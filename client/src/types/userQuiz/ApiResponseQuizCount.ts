import type { UserQuizCountDto } from "../../models/userQuiz/CountDto";


export interface ApiResponseQuizCountList {
  success: boolean;                // Da li je operacija bila uspešna
  message?: string;                // Opcionalna poruka (npr. greška ili status)
  data: UserQuizCountDto[];        // Lista korisničkih kvizova ili rezultata
}
