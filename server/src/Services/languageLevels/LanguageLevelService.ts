import { ILanguageLevelService } from "../../Domain/services/languageLevel/ILanguageLevelService";
import { LanguageLevelDto } from "../../Domain/DTOs/languageLevel/LanguageLevelDto";
import { LanguageLevelRepository } from "../../Domain/repositories/languageLevels/LanguageLevelRepository";

export class LanguageLevelService implements ILanguageLevelService {
  private languageLevelRepository: LanguageLevelRepository;

  constructor(languageLevelRepository: LanguageLevelRepository) {
    this.languageLevelRepository = languageLevelRepository; // Prosleđivanje instancije
  }

  // Metoda za dobijanje jezika sa njihovim nivoima
  async getLanguagesWithLevels() {
    return this.languageLevelRepository.getLanguagesWithLevels();
  }

  // Dodavanje jezik-nivo para
  async dodavanjeLanguageLevel(jezik: string, naziv: string): Promise<LanguageLevelDto> {
    try {
      // Kreiranje novog jezik-nivo para
      const languageLevel = await this.languageLevelRepository.createLanguageLevels({ jezik, naziv });

      if (languageLevel.jezik !== "") {
        // Ako je unos uspešan, vraćamo DTO sa podacima
        return new LanguageLevelDto(languageLevel.jezik, languageLevel.naziv);
      }
      // Ako unos nije uspešan, vraćamo prazan DTO
      return new LanguageLevelDto();
    } catch (error) {
      console.error("Error while adding language level:", error);
      throw new Error("Failed to add language level");
    }
  }
}
