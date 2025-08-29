// types/languageLevels/ResponseApiLanguageLevel.ts

export type ApiResponseLanguageLevel = {
  success: boolean;   // Status operacije (uspešno ili neuspešno)
  message: string;    // Poruka o uspehu ili grešci
  data: LanguageLevelData | null; // Podaci o jezik-nivo paru, može biti null ako operacija nije uspela
};

// Tip koji opisuje jezik-nivo par
export type LanguageLevelData = {
  jezik_id: number;  // ID jezika
  nivo_id: number;   // ID nivoa
};
