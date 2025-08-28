import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import knjiga from "../../assets/knjiga.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

interface PrijavaFormaProps extends AuthFormProps {
  onUlogovan?: () => void;
}

export function PrijavaForma({ authApi, onUlogovan }: PrijavaFormaProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);


      const claims = jwtDecode<JwtTokenClaims>(odgovor.data);
      if (claims.uloga === "admin") {
        navigate("/admin-dashboard");
      } else if (claims.uloga === "user") {
        navigate("/user-dashboard");
      } else {
        navigate("/");
      }

      if (onUlogovan) onUlogovan(); 
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
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
            Potvrdi
          </button>
        </form>
      </div>
    </div>
  );
}
