import { LanguageDto } from "../../DTOs/languages/LanguageDto";

export interface ILanguageService {
 
  dodavanjeJezika(jezik: string): Promise<LanguageDto>;
}