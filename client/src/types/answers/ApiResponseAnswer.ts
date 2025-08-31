export interface Answer {
  id: number;
  pitanje_id: number;
  tekst_odgovora: string;
  tacan: boolean;
}

export interface ApiResponseAnswer {
  success: boolean;
  message: string;
  data?: Answer; // Opcionalno, može biti odgovor ako postoji
}
