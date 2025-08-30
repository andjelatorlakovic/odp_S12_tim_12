export interface ApiResponseLanguageWithLevel {
  success: boolean;
  message: string;
  data: JezikSaNivoima[] | null; 
}
export interface JezikSaNivoima {
  jezik: string;       // npr. "Engleski"
  nivoi: string[];     // npr. ["A1", "A2", "B1", "B2"]
}