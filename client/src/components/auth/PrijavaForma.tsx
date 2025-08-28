import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import knjiga from "../../assets/knjiga.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import { SačuvajVrednostPoKljuču } from "../../helpers/local_storage";

interface PrijavaFormaProps extends AuthFormProps {
  onUlogovan?: () => void;
}

interface AuthResponseData {
  token?: string;
  [key: string]: any;
}

export function PrijavaForma({ authApi, onUlogovan }: PrijavaFormaProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login, setBlokiran } = useAuth(); // Pretpostavimo da si dodao i setBlokiran u context
  const navigate = useNavigate();

const podnesiFormu = async (e: React.FormEvent) => {
  e.preventDefault();

  const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
  if (!validacija.uspesno) {
    setGreska(validacija.poruka ?? "Неисправни подаци");
    return;
  }

  const odgovor = await authApi.prijava(korisnickoIme, lozinka);

  // Ova linija menja tip zbog TS greške
  const data = odgovor.data as unknown as AuthResponseData;

  let token: string;

  if (typeof data === "string") {
    token = data;
  } else if (data.token && typeof data.token === "string") {
    token = data.token;
  } else {
    setGreska("Nepoznat format tokena.");
    return;
  }

  try {
  const claims = jwtDecode<JwtTokenClaims>(token);

  SačuvajVrednostPoKljuču('authToken', token);  // Čuvanje tokena u localStorage

  login(token);
  setBlokiran(claims.blokiran);

  if (claims.blokiran) {
    setGreska("Vaš nalog je blokiran. Imaćete ograničen pristup.");
  }

  if (claims.uloga === "moderator") {
    navigate("/moderator-dashboard");
  } else if (claims.uloga === "korisnik") {
    navigate("/korisnik-dashboard");
  } else {
    navigate("/");
  }

  if (onUlogovan) onUlogovan();
} catch (error) {
  setGreska("Token je neispravan.");
}
};


  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj ispod zaglavlja */}
      <div className="pt-[120px] flex justify-center mt-[60px]">
        <form
          onSubmit={podnesiFormu}
          className="bg-[#f3e5ff] shadow-md rounded-2xl p-10 w-full max-w-md border border-purple-400"
        >
          <label className="block text-lg text-gray-800 mb-2">Korisnicko ime:</label>
          <input
            type="text"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <label className="block text-lg text-gray-800 mb-2 mt-4">Lozinka:</label>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {greska && (
            <p className="text-md text-center text-red-700 font-medium mt-4">{greska}</p>
          )}

          <button
            type="submit"
            className="mt-[30px] w-[50%] h-[45px] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition mx-auto block"
          >
            Prijava
          </button>
        </form>
      </div>
    </div>
  );
}
