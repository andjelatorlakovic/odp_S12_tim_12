import { Language } from "../../models/Language";

export interface ILanguageRepository
{
    getAllLanguages(): Promise<Language[]>;
    createLanguage(name: string): Promise<Language>;
} 