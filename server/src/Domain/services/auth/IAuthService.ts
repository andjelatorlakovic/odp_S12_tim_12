import { UserAuthDataDto } from "../../DTOs/auth/UserAuthDataDto";

export interface IAuthService {
 
  prijava(korisnickoIme: string, lozinka: string): Promise<UserAuthDataDto>;

  registracija(korisnickoIme: string, uloga: string, lozinka: string): Promise<UserAuthDataDto>;
}
