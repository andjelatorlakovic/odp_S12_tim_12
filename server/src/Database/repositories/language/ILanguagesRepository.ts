import { Language } from "../../../Domain/models/Language";


export interface ILanguageRepository
{
    getAllLanguages(): Promise<Language[]>;
    createLanguage(language: Language): Promise<Language>;
    getByName(jezik: string): Promise<Language>;
} 