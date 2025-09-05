import type { IAnswerAPIService } from "../../api_services/answers/IAnswerApiService";
import type { IQuestionAPIService } from "../../api_services/questions/IQuestionsApiService";
import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import { KvizForma } from "../../components/korisnik/KvizForma";

interface KvizFormaProps {
  questionApiService: IQuestionAPIService;
  answerApiService: IAnswerAPIService;
  userQuizApi: IUserQuizApiService;
}

export default function KvizStranica({
  questionApiService,
  answerApiService,
  userQuizApi,
}: KvizFormaProps) {
  return (
    <div>
      <KvizForma
        questionApiService={questionApiService}
        answerApiService={answerApiService}
        userQuizApi={userQuizApi}
      />
    </div>
  );
}
