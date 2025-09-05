import type { UserQuizCountDto } from "../../models/userQuiz/CountDto";


export interface ApiResponseQuizCountList {
  success: boolean;               
  message?: string;               
  data: UserQuizCountDto[];        
}
