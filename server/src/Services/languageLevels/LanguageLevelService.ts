import { ILanguageLevelService } from "../../Domain/services/languageLevel/ILanguageLevelService";
import { LanguageLevelDto } from "../../Domain/DTOs/languageLevel/LanguageLevelDto";
import { LanguageLevelsDto } from "../../Domain/DTOs/languageLevel/LanguageLevelsDto";
import { LanguageLevelRepository } from "../../Domain/repositories/languageLevels/LanguageLevelRepository";
import { LanguageLevel } from "../../Domain/models/LagnuageLevel";

export class LanguageLevelService implements ILanguageLevelService {
  private languageLevelRepository: LanguageLevelRepository;

  constructor(languageLevelRepository: LanguageLevelRepository) {
    this.languageLevelRepository = languageLevelRepository;
  }

  // Metoda za dobijanje jezika sa nivoima
  async getLanguagesWithLevels(): Promise<{ jezik: string; nivoi: string[] }[]> {
    try {
      // Dobijamo jezike sa njihovim nivoima iz repozitorijuma
      return await this.languageLevelRepository.getLanguagesWithLevels();
    } catch (error) {
      console.error("Greška pri dohvatanju jezika sa nivoima:", error);
      return [];
    }
  }

  // Metoda za dobijanje nivoa za određeni jezik
  async getLevelsByLanguage(jezik: string): Promise<LanguageLevelsDto> {
    try {
      // Dobijamo nivoe za jezik iz repozitorijuma
      const nivoi = await this.languageLevelRepository.getLevelsByLanguage(jezik);

      // Vraćamo DTO sa podacima jezika i nivoa
      return new LanguageLevelsDto(jezik, nivoi);
    } catch (error) {
      console.error(`Greška pri dohvatanju nivoa za jezik ${jezik}:`, error);
      return new LanguageLevelsDto();  // U slučaju greške vraćamo prazan DTO
    }
  }

  // Metoda za dodavanje novog nivoa za jezik
  async dodavanjeLanguageLevel(jezik: string, naziv: string): Promise<LanguageLevelDto> {
    try {
      // Kreiramo novi nivo jezika pomoću repozitorijuma
      const languageLevel = await this.languageLevelRepository.createLanguageLevels(new LanguageLevel(jezik, naziv));

      // Ako je unos uspešan, vraćamo DTO sa podacima o nivou
      if (languageLevel.jezik !== "") {
        return new LanguageLevelDto(languageLevel.jezik, languageLevel.naziv);
      }

      // Ako unos nije uspešan, vraćamo prazan DTO
      return new LanguageLevelDto();
    } catch (error) {
      console.error("Greška pri dodavanju nivoa jezika:", error);
      throw new Error("Neuspešno dodavanje nivoa jezika");  // Bacamo grešku ako dođe do problema
    }
  }
}
