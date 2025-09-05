import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import DodajNoviJezikForma from "../../components/moderator/DodajNoviJezikForma";

interface DodajJezikFormaProps {
  languageLevelApi: ILanguageLevelAPIService;
}

export default function DodajNoviJezikStranica({ languageLevelApi }: DodajJezikFormaProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      <DodajNoviJezikForma languageLevelApi={languageLevelApi} />
    </div>
  );
}
