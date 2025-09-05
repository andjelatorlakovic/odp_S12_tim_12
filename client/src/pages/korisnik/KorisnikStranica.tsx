import { Outlet, useLocation } from "react-router-dom";
import { KorisnikForma } from "../../components/korisnik/KorisnikForma";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";

interface KorisnikFormaProps{
  apiService: ILanguageLevelAPIService;
}

export default function KorisnikStranica({apiService} : KorisnikFormaProps) {
  const location = useLocation();

  const prikaziDashboard = location.pathname === "/korisnik-dashboard";

  return (
    <div>
      {prikaziDashboard && <KorisnikForma apiService={apiService} />}
      <Outlet />
    </div>
  );
}
