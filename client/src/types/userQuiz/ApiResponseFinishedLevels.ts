import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";


export interface ApiResponseFinishedLevels {
  success: boolean;
  data: FinishedLanguageLevelDto[];
  message?: string;
}
