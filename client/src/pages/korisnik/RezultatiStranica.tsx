import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import { RezultatiForma } from "../../components/korisnik/RezultatiForma";

interface RezultatiFormaProps {
  userQuizApi: IUserQuizApiService;
}

export default function RezultatiStranica({ userQuizApi }: RezultatiFormaProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <RezultatiForma userQuizApi={userQuizApi} />
    </div>
  );
}
