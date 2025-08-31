import { UserLanguageLevelDto } from "../../Domain/DTOs/userLanguage/UserLanguageDto";
import { UserLanguageLevel } from "../../Domain/models/UserLanguageLevel";
import { UserLanguageLevelRepository } from "../../Domain/repositories/userLanguage/UserLanguageRepository";
import { IUserLanguageLevelService } from "../../Domain/services/userLanguage/IUserLanguageService";

export class UserLanguageLevelService implements IUserLanguageLevelService {
  private userLanguageLevelRepository: UserLanguageLevelRepository;

  constructor(userLanguageLevelRepository: UserLanguageLevelRepository) {
    this.userLanguageLevelRepository = userLanguageLevelRepository;
  }

  // Dohvatanje jezika i nivoa za korisnika po jeziku i nivou
  async getByUserLanguageAndLevel(
    userId: number,
    jezik: string,
    nivo: string
  ): Promise<UserLanguageLevelDto> {
    const level = await this.userLanguageLevelRepository.getByUserLanguageAndLevel(userId, jezik, nivo);

    if (level.userId !== 0) {
      return new UserLanguageLevelDto(level.userId, level.jezik, level.nivo);
    }

    return new UserLanguageLevelDto(); // Prazni DTO ako nije pronađeno
  }

  // Dodavanje novog jezika i nivoa za korisnika
  async createUserLanguageLevel(
    userId: number,
    jezik: string,
    nivo: string
  ): Promise<UserLanguageLevelDto> {
    // Provera da li korisnik već ima dati jezik
    const existing = await this.userLanguageLevelRepository.getByUserAndLanguage(userId, jezik);
    if (existing.userId !== 0) {
      return new UserLanguageLevelDto(); // Već postoji jezik za tog korisnika
    }

    const newLevel = new UserLanguageLevel(userId, jezik, nivo);
    const created = await this.userLanguageLevelRepository.createUserLanguageLevel(newLevel);

    if (created.userId !== 0) {
      return new UserLanguageLevelDto(created.userId, created.jezik, created.nivo);
    }

    return new UserLanguageLevelDto(); // Ako nešto pođe po zlu
  }

  // Nova metoda: Dohvatanje jezika koje korisnik još uvek nema
  async getLanguagesUserDoesNotHave(userId: number): Promise<string[]> {
    return await this.userLanguageLevelRepository.getLanguagesUserDoesNotHave(userId);
  }

  // Ovde možeš dodati update, delete itd.
}
