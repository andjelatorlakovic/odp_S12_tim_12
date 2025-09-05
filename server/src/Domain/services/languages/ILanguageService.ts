import { LanguageDto } from "../../DTOs/languages/LanguageDto";

export interface ILanguageService {
 
  dodavanjeJezika(jezik: string): Promise<LanguageDto>;
  uzmiJezikPoImenu(jezik: string): Promise<LanguageDto>;
  uzmiSveJezike(): Promise<LanguageDto[]>;
}