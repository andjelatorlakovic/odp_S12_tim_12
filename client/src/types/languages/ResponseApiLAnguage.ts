// Definicija za jezik
export interface Language {
  id: number;
  jezik: string;
}

// Tip za odgovor API-ja vezan za jezik
export type ApiResponseLanguage = {
  success: boolean;        // Da li je operacija bila uspešna
  message: string;         // Poruka o uspehu ili grešci
  data?: Language | null;  // Podaci o jeziku (opcionalno, može biti jezik ili null)
};
