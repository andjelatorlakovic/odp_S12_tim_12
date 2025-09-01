import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import { languageApi } from "../../api_services/languages/LanguageApiService";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { validacijaPodatakaJezik } from "../../api_services/validators/languages/LanguageValidator";
import knjiga from "../../assets/knjiga.png";

// Instanciraj servis za nivoe
const languageLevelApi = new LanguageLevelAPIService();

export default function DodajNoviJezikForma() {
  const [jezik, setJezik] = useState("");
  const [nivoi, setNivoi] = useState<string[]>([]);
  const [greska, setGreska] = useState("");
  const [uspesno, setUspesno] = useState(false);
  const [brojNivoi, setBrojNivoi] = useState<number | string>("");

  const nivoiOpcije = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const navigate = useNavigate(); // useNavigate hook to navigate

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");
    setUspesno(false);

    const validacija = validacijaPodatakaJezik(jezik);

    if (!validacija.uspesno) {
      setGreska(validacija.poruka);
      return;
    }

    // Provera da li su nivoe selektovani
    if (!brojNivoi || brojNivoi === "") {
      setGreska("Морате одабрати бар 1 ниво.");
      return;
    }
    const nivoiZaDodavanje = nivoiOpcije.slice(0, Number(brojNivoi));

    // Dodaj jezik
    const odgovorJezik = await languageApi.dodajJezik(jezik.trim(), nivoiZaDodavanje.join(", "));
    console.log("API odgovorJezik:", odgovorJezik);

    if (odgovorJezik.success) {
      console.log("Dodajem nivoe:", nivoiZaDodavanje);

      // Resetuj formu
      setJezik("");
      setNivoi([]);
      setBrojNivoi("");
      setUspesno(true);

      // Dodaj svaki nivo posebno
      for (let nivo of nivoiZaDodavanje) {
        const odgovorNivo = await languageLevelApi.dodajLanguageLevel(jezik.trim(), nivo);
        if (!odgovorNivo.success) {
          setGreska(`Greška pri dodavanju nivoa: ${nivo}`);
          return;
        }
      }
    } else {
      setGreska(odgovorJezik.message);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setBrojNivoi(selectedValue);
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
            <option value="" disabled>~~ Izaberi nivoe ~~</option> {/* Placeholder opcija */}
            <option value={1}>1 nivo</option>
            <option value={2}>2 nivoa</option>
            <option value={3}>3 nivoa</option>
            <option value={4}>4 nivoa</option>
            <option value={5}>5 nivoa</option>
            <option value={6}>6 nivoa</option>
          </select>

          <label className="block text-lg text-gray-800 mb-2">Odabrani nivoi:</label>
          <div className="mb-4">
            <select
              value={nivoi}
              onChange={(e) => setNivoi(Array.from(e.target.selectedOptions, option => option.value))}
              multiple
              className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {nivoiOpcije.slice(0, Number(brojNivoi)).map((nivo, index) => (
                <option key={index} value={nivo}>{nivo}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
          >
            Dodaj jezik
          </button>

          {uspesno && (
            <p className="text-green-700 text-center mt-4">
              Језик је успешно додат!
            </p>
          )}
        </form>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back
        className="mt-6 w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
      >
        Nazad
      </button>
    </div>
  );
}
