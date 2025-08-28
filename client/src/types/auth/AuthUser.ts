export interface AuthUser {
  id: number;
  korisnickoIme: string;
  uloga: string;
  blokiran: boolean;  // dodaš ovo
}