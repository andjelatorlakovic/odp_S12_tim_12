import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import { RezultatiForma } from "../../components/korisnik/RezultatiForma";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";

interface RezultatiFormaProps {
  userQuizApi: IUserQuizApiService;
  languageLevelAPIService: ILanguageLevelAPIService; // Dodaj servis za nivoe kao opcioni prop
}

export default function RezultatiStranica({ userQuizApi, languageLevelAPIService }: RezultatiFormaProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <RezultatiForma userQuizApi={userQuizApi} languageLevelAPIService={languageLevelAPIService}/>
    </div>
  );
}
