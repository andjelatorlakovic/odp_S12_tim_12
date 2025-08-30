import { Outlet, useLocation } from "react-router-dom";
import { KorisnikForma } from "../../components/korisnik/KorisnikForma";

export default function KorisnikStranica() {
  const location = useLocation();

  const prikaziDashboard = location.pathname === "/korisnik-dashboard";

  return (
    <div>
      {prikaziDashboard && <KorisnikForma />}
      <Outlet />
    </div>
  );
}
