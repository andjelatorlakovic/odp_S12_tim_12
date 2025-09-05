import { LanguagesRepository } from "../../Domain/repositories/languages/LanguagesRepository";
import { Language } from "../../Domain/models/Language";
import { LanguageDto } from "../../Domain/DTOs/languages/LanguageDto";
import { ILanguageRepository } from "../../Database/repositories/language/ILanguagesRepository";

export class LanguageService {
  private languageRepository: ILanguageRepository;

  constructor(languageRepository: ILanguageRepository) {
    this.languageRepository = languageRepository;
  }

  // Metoda za dodavanje jezika
  async dodavanjeJezika(jezik: string): Promise<LanguageDto> {
    try {
      // Proveravamo da li je jezik već prisutan u bazi
      const existingLanguage = await this.languageRepository.getByName(jezik);

      if (existingLanguage.id !== 0) {
        // Ako je jezik već prisutan, vraćamo prazni DTO
        return new LanguageDto();
      }

      // Kreiramo novi jezik u bazi
      const newLanguage = await this.languageRepository.createLanguage(new Language(0, jezik));

      if (newLanguage.id !== 0) {
        // Ako je jezik uspešno dodat, vraćamo DTO sa podacima
        return new LanguageDto(newLanguage.id, newLanguage.jezik);
      }

      // Ako nešto pođe po zlu, vraćamo prazni DTO
      return new LanguageDto();
    } catch (error) {
      console.log("Error adding language: " + error);
      return new LanguageDto();  // Vraćamo prazan DTO u slučaju greške
    }
  }

  // Metoda za uzimanje svih jezika
  async uzmiSveJezike(): Promise<LanguageDto[]> {
    try {
      const languages = await this.languageRepository.getAllLanguages();
      return languages.map(language => new LanguageDto(language.id, language.jezik));
    } catch (error) {
      console.log("Error fetching all languages: " + error);
      return [];  // Ako dođe do greške, vraćamo praznu listu
    }
  }

  // Metoda za uzimanje jezika prema imenu
  async uzmiJezikPoImenu(jezik: string): Promise<LanguageDto> {
    try {
      const language = await this.languageRepository.getByName(jezik);
      if (language.id !== 0) {
        return new LanguageDto(language.id, language.jezik);
      }
      return new LanguageDto();  // Ako je jezik nepoznat, vraćamo prazan DTO
    } catch (error) {
      console.log("Error fetching language by name: " + error);
      return new LanguageDto();  // Vraćamo prazan DTO u slučaju greške
    }
  }
}
