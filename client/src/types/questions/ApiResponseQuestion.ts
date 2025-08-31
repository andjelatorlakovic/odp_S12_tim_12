// Tip za pojedinačno pitanje
export interface Question {
  id: number;
  kviz_id: number;
  tekst_pitanja: string;
  // Dodaj još polja ako ih imaš, npr. createdAt, updatedAt, itd.
}

// ApiResponseQuestion je tip odgovora koji vraća API prilikom kreiranja pitanja
export interface ApiResponseQuestion {
  success: boolean;
  message: string;
  data: Question;
}
