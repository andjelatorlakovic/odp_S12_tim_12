import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { KorisnikForma } from "../../components/korisnik/KorisnikForma";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useEffect } from "react";

interface KorisnikFormaProps {
  apiService: ILanguageLevelAPIService;
}

export default function KorisnikStranica({ apiService }: KorisnikFormaProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Dodajem samo ovu proveru
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const prikaziDashboard = location.pathname === "/korisnik-dashboard";

  return (
    <div>
      {prikaziDashboard && <KorisnikForma apiService={apiService} />}
      <Outlet />
    </div>
  );
}
