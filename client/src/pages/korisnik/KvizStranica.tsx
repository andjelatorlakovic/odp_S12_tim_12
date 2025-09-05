import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

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
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

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
