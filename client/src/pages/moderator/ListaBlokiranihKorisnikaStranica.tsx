import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

import ListaBlokiranihKorisnikaForma from "../../components/moderator/ListaBlokiranihKorisnikaForma";

export default function ListaBlokiranihStranica() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <ListaBlokiranihKorisnikaForma />
    </div>
  );
}
