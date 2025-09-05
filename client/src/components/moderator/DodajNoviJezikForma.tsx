import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { languageApi } from "../../api_services/languages/LanguageApiService";
import { validacijaPodatakaJezik } from "../../api_services/validators/languages/LanguageValidator";
import knjiga from "../../assets/knjiga.png";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import { useAuth } from "../../hooks/auth/useAuthHook"; // Import useAuth

interface DodajJezikFormaProps {
  languageLevelApi: ILanguageLevelAPIService;
}

export default function DodajNoviJezikForma({ languageLevelApi }: DodajJezikFormaProps) {
  const [jezik, setJezik] = useState("");
  const [greska, setGreska] = useState("");
  const [uspesno, setUspesno] = useState(false);
  const [brojNivoi, setBrojNivoi] = useState<number | string>("");

  const nivoiOpcije = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const navigate = useNavigate();

  const { token } = useAuth(); // Uzmi token iz useAuth hooka

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");
    setUspesno(false);

    // Validacija jezika
    const validacija = validacijaPodatakaJezik(jezik);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka);
      return;
    }

    // Validacija broja nivoa
    if (!brojNivoi || brojNivoi === "") {
      setGreska("Morate odabrati bar 1 nivo.");
      return;
    }

    const nivoiZaDodavanje = nivoiOpcije.slice(0, Number(brojNivoi));

    if (!token) {
      setGreska("Token nije pronađen.");
      return;
    }

    // Dodaj jezik preko languageApi
    const odgovorJezik = await languageApi.dodajJezik(jezik.trim(), nivoiZaDodavanje.join(", "), token);

    if (!odgovorJezik.success) {
      setGreska(odgovorJezik.message);
      return;
    }

    // Dodaj nivoe preko languageLevelApi, koristi jezik, naziv nivoa i token
    for (const nivo of nivoiZaDodavanje) {
      const odgovorNivo = await languageLevelApi.dodajLanguageLevel(jezik.trim(), nivo, token);
      if (!odgovorNivo.success) {
        setGreska(`Greška pri dodavanju nivoa: ${nivo}`);
        return;
      }
    }

    // Resetuj formu i prikaži poruku uspeha
    setJezik("");
    setBrojNivoi("");
    setUspesno(true);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrojNivoi(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[120px] flex justify-center mt-[60px]">
        <form
          onSubmit={podnesiFormu}
          className="bg-[#f3e5ff] shadow-md rounded-2xl p-10 w-full max-w-md border border-purple-400"
        >
          <label className="block text-lg text-gray-800 mb-2">Naziv jezika:</label>
          <input
            type="text"
            value={jezik}
            onChange={(e) => setJezik(e.target.value)}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Unesite naziv jezika"
          />

          {greska && <p className="text-red-700 text-center mb-4">{greska}</p>}

          <label className="block text-lg text-gray-800 mb-2 mt-4">Broj nivoa jezika:</label>
          <select
            value={brojNivoi}
            onChange={handleSelectChange}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
          >
            <option value="" disabled>~~ Izaberi nivoe ~~</option>
            <option value={1}>1 nivo</option>
            <option value={2}>2 nivoa</option>
            <option value={3}>3 nivoa</option>
            <option value={4}>4 nivoa</option>
            <option value={5}>5 nivoa</option>
            <option value={6}>6 nivoa</option>
          </select>

          <label className="block text-lg text-gray-800 mb-2">Odabrani nivoi:</label>
          <select
            multiple
            disabled
            value={nivoiOpcije.slice(0, Number(brojNivoi))}
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 cursor-not-allowed"
          >
            {nivoiOpcije.slice(0, Number(brojNivoi)).map((nivo, index) => (
              <option key={index} value={nivo}>
                {nivo}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
          >
            Dodaj jezik
          </button>

          {uspesno && (
            <p className="text-green-700 text-center mt-4">
              Jezik je uspeno dodat!
            </p>
          )}
        </form>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
      >
        Nazad
      </button>
    </div>
  );
}
