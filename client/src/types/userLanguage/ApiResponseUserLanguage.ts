

export type ApiResponseUserLanguageLevel = {
  success: boolean;              // status operacije
  message: string;               // poruka (uspeh ili greška)
  data: UserLanguageLevelData | null; // podaci ili null ako nije uspešno
};
export interface UserLanguageLevelData {
  userId: number;
  jezik: string;
  nivo: string;
};
export type ApiResponseLanguagesList = {
  success: boolean;
  message: string;
  data: string[] | null;  // niz naziva jezika ili null
};