import { FinishedLanguageLevelDto } from "../../Domain/DTOs/userLanguage/FinishedLanguageLevelDto";
import { UserLanguageLevelDto } from "../../Domain/DTOs/userLanguage/UserLanguageDto";
import { UserLanguageLevel } from "../../Domain/models/UserLanguageLevel";
import { UserLanguageLevelRepository } from "../../Domain/repositories/userLanguage/UserLanguageRepository";
import { IUserLanguageLevelService } from "../../Domain/services/userLanguage/IUserLanguageService";

export class UserLanguageLevelService implements IUserLanguageLevelService {
  private userLanguageLevelRepository: UserLanguageLevelRepository;

  constructor(userLanguageLevelRepository: UserLanguageLevelRepository) {
    this.userLanguageLevelRepository = userLanguageLevelRepository;
  }

  // Dohvatanje specifičnog nivoa jezika za korisnika (userId + jezik + nivo)
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

  // Dohvatanje jezika koje korisnik još nema
  async getLanguagesUserDoesNotHave(userId: number): Promise<string[]> {
    return await this.userLanguageLevelRepository.getLanguagesUserDoesNotHave(userId);
  }

  // Dohvatanje jezika korisnika bez nivoa (korisno za proveru da li već postoji jezik)
  async getByUserAndLanguage(userId: number, jezik: string): Promise<UserLanguageLevelDto> {
    const existing = await this.userLanguageLevelRepository.getByUserAndLanguage(userId, jezik);

    if (existing.userId !== 0) {
      return new UserLanguageLevelDto(existing.userId, existing.jezik, existing.nivo);
    }

    return new UserLanguageLevelDto(); // Prazni DTO ako nije pronađeno
  }

  // Kreiranje novog jezika i nivoa za korisnika
  async createUserLanguageLevel(
    userId: number,
    jezik: string,
    nivo: string
  ): Promise<UserLanguageLevelDto> {
    // Provera da li korisnik već ima dati jezik (bilo koji nivo)
    const existing = await this.userLanguageLevelRepository.getByUserLanguageAndLevel(userId, jezik,nivo);
    if (existing.userId !== 0) {
      // Korisnik već ima dati jezik (bilo koji nivo)
      return new UserLanguageLevelDto(); // Možeš i baciti grešku ako želiš
    }

    const newLevel = new UserLanguageLevel(userId, jezik, nivo);
    const created = await this.userLanguageLevelRepository.createUserLanguageLevel(newLevel);

    if (created.userId !== 0) {
      return new UserLanguageLevelDto(created.userId, created.jezik, created.nivo);
    }

    return new UserLanguageLevelDto(); // Ako nešto pođe po zlu
  }
 async updateKrajNivoa(userId: number, jezik: string, nivo: string): Promise<boolean> {
    return await this.userLanguageLevelRepository.updateKrajNivoa(userId, jezik, nivo);
  }
  async getFinishedLevelsByUsername(korIme: string): Promise<FinishedLanguageLevelDto[]> {
  const levels = await this.userLanguageLevelRepository.getFinishedLevelsByUsername(korIme);

  if (levels.length === 0) {
  return [];
}
  return levels.map(level => {
    const start = new Date(level.pocetakNivoa);
    const end = new Date(level.krajNivoa);

    // Postavi oba datuma na početak dana (00:00:00)
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) +1;

    return new FinishedLanguageLevelDto(
      level.korisnickoIme,
      level.jezik,
      level.nivo,
      new Date(level.pocetakNivoa),
      new Date(level.krajNivoa),
      diffDays
    );
  });
}
}
