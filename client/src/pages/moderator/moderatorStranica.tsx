import { Outlet, useLocation } from "react-router-dom";
import { ModeratorForma } from "../../components/moderator/ModeratorForma";

export default function ModeratorStranica() {
  const location = useLocation();

  // Prikazuj ModeratorFormu samo ako smo tačno na /moderator-dashboard
  const prikaziFormu = location.pathname === "/moderator-dashboard";

  return (
    <div>
      {/* Zaglavlje */}
      <h1>Moderator stranica</h1>

      {/* Prikaz forme samo ako je ruta tačno /moderator-dashboard */}
      {prikaziFormu && <ModeratorForma />}

      {/* Ovde će se prikazivati podrute */}
      <Outlet />
    </div>
  );
}
