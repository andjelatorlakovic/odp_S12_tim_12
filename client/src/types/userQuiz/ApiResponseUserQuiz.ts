// ApiResponse za brisanje
export interface ApiResponseDelete {
  success: boolean;
  message: string;
}

// DTO za jedan rezultat korisnika i kviza
export interface UserQuizResultData {
  userId: number;
  kvizId: number;
  jezik: string;
  nivo: string;
  procenatTacnihOdgovora: number;
}

// ApiResponse za jedan rezultat
export interface ApiResponseUserQuiz {
  success: boolean;
  message?: string;
  data: UserQuizResultData | null;
}

// ApiResponse za listu rezultata
export interface ApiResponseUserQuizList {
  success: boolean;
  message?: string;
  data: UserQuizResultData[];
}

export interface ApiResponseKvizCount {
  success: boolean;
  data: number; // Broj kvizova sa više od 85.5% tačnih odgovora
  message?: string;
}
