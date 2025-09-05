import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

import BlokirajKorisnikaForma from "../../components/moderator/BlokirajKorisnikaForma";

export default function BlokirajKorisnikaStranica() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <BlokirajKorisnikaForma />
    </div>
  );
}
