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

// ApiResponse za brisanje
export interface ApiResponseDelete {
  success: boolean;
  message: string;
}

// DTO za statistiku kvizova (kako dolazi sa backend-a)
export interface KvizStatistikaDto {
  userId: number;
  jezik: string;
  nivo: string;
  brojKviza: number;
}

// ApiResponse za kviz statistiku
export interface ApiResponseKvizStatistika {
  success: boolean;
  data: KvizStatistikaDto[];
  message?: string;
}
