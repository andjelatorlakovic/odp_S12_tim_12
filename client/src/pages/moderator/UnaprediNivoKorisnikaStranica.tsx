import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import { UrediNivoeForma } from "../../components/moderator/UnaprediNivoKorisnikaForma";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UnaprediNivoFormaProps {
  userQuizApiService: IUserQuizApiService;
  languageLevelAPIService: ILanguageLevelAPIService;
}

export default function UnaprediNivoKorisnikaStranica({ userQuizApiService, languageLevelAPIService }: UnaprediNivoFormaProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <UrediNivoeForma
        userQuizApiService={userQuizApiService}
        languageLevelAPIService={languageLevelAPIService}
      />
    </div>
  );
}
