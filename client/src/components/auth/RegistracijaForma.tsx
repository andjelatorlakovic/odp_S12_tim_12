import { useState } from "react";
import { Link } from "react-router-dom"; 
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import knjiga from "../../assets/knjiga.png";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("korisnik");
  const [greska, setGreska] = useState("");
  const [uspesno, setUspesno] = useState(false); 


  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    setGreska("");

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.registracija(korisnickoIme, lozinka, uloga);
    if (odgovor.success && odgovor.data) {
     
      setUspesno(true);
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
          {uspesno && (
            <p className="text-center text-green-700 font-semibold mb-4 text-lg">
              Uspešno ste kreirali profil.{" "}
              <Link to="/prijava" className="underline text-purple-600 hover:text-purple-800">
                Ulogujte se
              </Link>
              .
            </p>
          )}

          <label className="block text-lg text-gray-800 mb-2">Korisnicko ime:</label>
          <input
            type="text"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={uspesno}
          />

          <label className="block text-lg text-gray-800 mb-2 mt-4">Lozinka:</label>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={uspesno}
          />

          <label className="block text-lg text-gray-800 mb-2 mt-4">Uloga:</label>
          <select
            value={uloga}
            onChange={(e) => setUloga(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={uspesno}
          >
            <option value="korisnik">Korisnik</option>
            <option value="moderator">Moderator</option>
          </select>

          {greska && (
            <p className="text-md text-center text-red-700 font-medium mt-4">{greska}</p>
          )}

          <button
            type="submit"
            className="mt-[30px] w-[60%] h-[60px] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition mx-auto block"
            disabled={uspesno}
          >
            Registracija
          </button>
        </form>
      </div>
    </div>
  );
}
