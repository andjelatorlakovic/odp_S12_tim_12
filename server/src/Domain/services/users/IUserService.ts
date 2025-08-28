import { UserDto } from "../../DTOs/users/UserDto";

export interface IUserService {
  blokirajKorisnike(userIds: number[]): unknown;
     /**
     * Vraca listu svih korisnika u sistemu.
     * @returns Podatke o korisnicima u vidu liste.
     */
  getSviKorisnici(): Promise<UserDto[]>;
  blokirajKorisnike(userIds: number[]): Promise<void>;
  odblokirajKorisnike(userIds: number[]): Promise<void>;
}