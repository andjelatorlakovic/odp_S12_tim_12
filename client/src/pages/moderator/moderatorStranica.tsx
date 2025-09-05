import { Outlet, useLocation } from "react-router-dom";
import { ModeratorForma } from "../../components/moderator/ModeratorForma";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModeratorStranica() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Prikazuj ModeratorFormu samo ako smo tačno na /moderator-dashboard
  const prikaziFormu = location.pathname === "/moderator-dashboard";

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

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
