import type { IAnswerAPIService } from "../../api_services/answers/IAnswerApiService";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import type { IQuestionAPIService } from "../../api_services/questions/IQuestionsApiService";
import { KreirajKvizForma } from "../../components/korisnik/KreirajKvizForma";

interface KreirajKvizFormaProps {
  languageLevelAPIService: ILanguageLevelAPIService;
  questionAPIService: IQuestionAPIService;
  answerAPIService: IAnswerAPIService;
}

export default function KreirajKvizStranica({
  languageLevelAPIService,
  questionAPIService,
  answerAPIService,
}: KreirajKvizFormaProps) {
  return (
    <div>
      <KreirajKvizForma
        languageLevelAPIService={languageLevelAPIService}
        questionAPIService={questionAPIService}
        answerAPIService={answerAPIService}
      />
    </div>
  );
}
