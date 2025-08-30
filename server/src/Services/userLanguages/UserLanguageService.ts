import { IUserLanguageLevelRepository } from "../../Database/repositories/userLanguage/IUserLanguageRepository";
import { UserLanguageLevelDto } from "../../Domain/DTOs/userLanguage/UserLanguageDto";
import { IUserLanguageLevelService } from "../../Domain/services/userLanguage/IUserLanguageService";


export class UserLanguageLevelService implements IUserLanguageLevelService {
  public constructor(
    private userLangLevelRepository: IUserLanguageLevelRepository
  ) {}

  // Dohvatanje jezika i nivoa za korisnika
  async getUserLanguageLevel(userId: number, jezik: string): Promise<UserLanguageLevelDto> {
    const userLangLevel = await this.userLangLevelRepository.getByUserAndLanguage(userId, jezik);

    if (userLangLevel.userId !== 0) {
      return new UserLanguageLevelDto(userLangLevel.userId, userLangLevel.jezik, userLangLevel.nivo);
    }

    // Ako nije pronađen, vraća prazan objekat
    return new UserLanguageLevelDto();
  }

  // Dohvatanje svih jezika i nivoa za korisnika
  async getAllUserLanguageLevels(userId: number): Promise<UserLanguageLevelDto[]> {
    const userLangLevels = await this.userLangLevelRepository.getAllByUser(userId);

    return userLangLevels.map((langLevel) =>
      new UserLanguageLevelDto(langLevel.userId, langLevel.jezik, langLevel.nivo)
    );
  }

  // Dodavanje jezika i nivoa za korisnika
async addUserLanguageLevel(dto: UserLanguageLevelDto): Promise<UserLanguageLevelDto> {
    const { userId, jezik, nivo } = dto;

    // Prvo proveravamo da li korisnik već ima jezik sa nivoom
    const existingLangLevel = await this.userLangLevelRepository.getByUserAndLanguage(userId, jezik);

    if (existingLangLevel.userId !== 0) {
        return new UserLanguageLevelDto(); // Korisnik već ima jezik sa nivoom
    }

    // Ako nema, kreiramo novi zapis
    const newUserLangLevel = await this.userLangLevelRepository.createUserLanguageLevel(
        new UserLanguageLevelDto(userId, jezik, nivo)
    );

    return new UserLanguageLevelDto(newUserLangLevel.userId, newUserLangLevel.jezik, newUserLangLevel.nivo);
}

  // Ažuriranje jezika i nivoa za korisnika
  async updateUserLanguageLevel(userId: number, jezik: string, nivo: string): Promise<UserLanguageLevelDto> {
    const existingLangLevel = await this.userLangLevelRepository.getByUserAndLanguage(userId, jezik);

    if (existingLangLevel.userId === 0) {
      return new UserLanguageLevelDto(); // Ne postoji jezik za ovog korisnika
    }

    // Ažuriramo nivo
    const updatedUserLangLevel = await this.userLangLevelRepository.updateUserLanguageLevel(userId, jezik, nivo);

    return new UserLanguageLevelDto(updatedUserLangLevel.userId, updatedUserLangLevel.jezik, updatedUserLangLevel.nivo);
  }

  // Brisanje jezika i nivoa za korisnika
  async deleteUserLanguageLevel(userId: number, jezik: string): Promise<void> {
    const existingLangLevel = await this.userLangLevelRepository.getByUserAndLanguage(userId, jezik);

    if (existingLangLevel.userId !== 0) {
      await this.userLangLevelRepository.deleteUserLanguageLevel(userId, jezik);
    } else {
      console.log("No language level found to delete.");
    }
  }
}
