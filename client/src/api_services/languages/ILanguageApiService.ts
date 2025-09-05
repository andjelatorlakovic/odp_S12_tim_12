import type { ApiResponseLanguage } from "../../types/languages/ResponseApiLAnguage";


export interface ILanguageAPIService {

  dodajJezik(jezik: string, nivo: string, token: string): Promise<ApiResponseLanguage>;

}
