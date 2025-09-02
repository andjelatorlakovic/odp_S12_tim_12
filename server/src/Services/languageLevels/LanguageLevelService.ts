import { ILanguageLevelService } from "../../Domain/services/languageLevel/ILanguageLevelService";
import { LanguageLevelDto } from "../../Domain/DTOs/languageLevel/LanguageLevelDto";
import { LanguageLevelsDto } from "../../Domain/DTOs/languageLevel/LanguageLevelsDto";

import { LanguageLevelRepository } from "../../Domain/repositories/languageLevels/LanguageLevelRepository";

export class LanguageLevelService implements ILanguageLevelService {
  private languageLevelRepository: LanguageLevelRepository;

  constructor(languageLevelRepository: LanguageLevelRepository) {
    this.languageLevelRepository = languageLevelRepository;
  }

  async getLanguagesWithLevels() {
    return this.languageLevelRepository.getLanguagesWithLevels();
  }

  async getLevelsByLanguage(jezik: string): Promise<LanguageLevelsDto> {
    try {
      const nivoi = await this.languageLevelRepository.getLevelsByLanguage(jezik);
      return new LanguageLevelsDto(jezik, nivoi);
    } catch (error) {
      console.error(`Greška pri dohvatanju nivoa za jezik ${jezik}:`, error);
      return new LanguageLevelsDto();
    }
  }

  async dodavanjeLanguageLevel(jezik: string, naziv: string): Promise<LanguageLevelDto> {
    try {
      const languageLevel = await this.languageLevelRepository.createLanguageLevels({ jezik, naziv });

      if (languageLevel.jezik !== "") {
        return new LanguageLevelDto(languageLevel.jezik, languageLevel.naziv);
      }
      return new LanguageLevelDto();
    } catch (error) {
      console.error("Error while adding language level:", error);
      throw new Error("Failed to add language level");
    }
  }
}
