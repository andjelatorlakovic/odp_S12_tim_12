import { UserLanguageLevel } from "../../../Domain/models/UserLanguageLevel";


export interface IUserLanguageLevelRepository {
    // Dobijanje jezika i nivoa za korisnika
    getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevel>;

    // Dobijanje svih jezika i nivoa koje korisnik uči
    getAllByUser(userId: number): Promise<UserLanguageLevel[]>;

    // Dodavanje novog jezika i nivoa za korisnika
    createUserLanguageLevel(userLanguageLevel: UserLanguageLevel): Promise<UserLanguageLevel>;

    // Ažuriranje jezika i nivoa za korisnika
    updateUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevel>;

    // Brisanje jezika i nivoa za korisnika
    deleteUserLanguageLevel(userId: number, jezik: string): Promise<void>;
}
