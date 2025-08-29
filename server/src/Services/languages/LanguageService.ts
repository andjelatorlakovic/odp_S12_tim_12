import { LanguagesRepository } from "../../Domain/repositories/languages/LanguagesRepository";
import { Language } from "../../Domain/models/Language";
import { LanguageDto } from "../../Domain/DTOs/languages/LanguageDto";

export class LanguageService {
  private languageRepository: LanguagesRepository;

  constructor(languageRepository: LanguagesRepository) {
    this.languageRepository = languageRepository;
  }

  async dodavanjeJezika(jezik: string): Promise<LanguageDto> {
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
  }
}
