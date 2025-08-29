import { useState } from "react";
import { languageApi } from "../../api_services/languages/LanguageApiService"; // Importuj LanguageApiService
import { validacijaPodatakaJezik } from "../../api_services/validators/languages/LanguageValidator"; // Importuj funkciju validacije
import knjiga from "../../assets/knjiga.png"; // Importuj sliku za logo

export default function DodajNoviJezikForma() {
  const [jezik, setJezik] = useState("");  // Stanje za naziv jezika
  const [nivoi, setNivoi] = useState<string[]>([]);  // Stanje za nivo jezika, sada kao niz
  const [greska, setGreska] = useState(""); // Stanje za greške
  const [greska2, setGreska2] = useState(""); // Stanje za greške
  const [uspesno, setUspesno] = useState(false);  // Stanje za uspesnu registraciju



  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault(); // Sprečava ponovno učitavanje stranice pri submit-u
    setGreska("");  // Resetuje grešku pre svakog pokušaja
    setUspesno(false); // Resetuje status uspeha

    // Pozivanje funkcije za validaciju jezika
    const validacija = validacijaPodatakaJezik(jezik);

    // Ako validacija nije uspešna, postavljamo grešku
    if (!validacija.uspesno) {
      setGreska(validacija.poruka);
      return;
    }

    // Validacija nivoa
    if (nivoi.length === 0) {
      setGreska2("Molimo odaberite barem jedan nivo.");
      return;
    }

    // Poziv API funkcije za dodavanje jezika
    const odgovor = await languageApi.dodajJezik(jezik.trim(), nivoi.join(", "));

    // Ako je odgovor uspešan, prikazuje poruku o uspehu
    if (odgovor.success) {
      setUspesno(true);
      setJezik("");  // Resetuje unos jezika
      setNivoi([]);   // Resetuje nivo jezika
      setGreska("");
      setGreska2("");
    } else {
      setGreska(odgovor.message);  // Ako dođe do greške, postavlja grešku
    }
  };

  // Funkcija za ažuriranje stanja nivoa
  const handleCheckboxChange = (nivo: string) => {
    if (nivoi.includes(nivo)) {
      setNivoi(nivoi.filter((item) => item !== nivo)); // Uklanja nivo iz stanja ako je već označen
    } else {
      setNivoi([...nivoi, nivo]); // Dodaje nivo u stanje ako nije označen
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
          <label className="block text-lg text-gray-800 mb-2">Naziv jezika:</label>
          <input
            type="text"
            value={jezik}
            onChange={(e) => setJezik(e.target.value)} // Ažurira stanje jezika
            className="w-full px-4 bg-white py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Unesite naziv jezika"
          />

          {/* Prikazivanje greške ako je naziv jezika manji od 3 slova */}
          {greska && !nivoi.length && <p className="text-red-700 text-center mb-4">{greska}</p>}

          <label className="block text-lg text-gray-800 mb-2 mt-4">Nivo znanja:</label>
          
          {/* Raspored checkboksova u dva reda */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Prvi red: A1, B1, C1 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="A1"
                  checked={nivoi.includes("A1")}
                  onChange={() => handleCheckboxChange("A1")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">A1</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="B1"
                  checked={nivoi.includes("B1")}
                  onChange={() => handleCheckboxChange("B1")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">B1</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="C1"
                  checked={nivoi.includes("C1")}
                  onChange={() => handleCheckboxChange("C1")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">C1</span>
              </label>
            </div>
            
            {/* Drugi red: A2, B2, C2 */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="A2"
                  checked={nivoi.includes("A2")}
                  onChange={() => handleCheckboxChange("A2")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">A2</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="B2"
                  checked={nivoi.includes("B2")}
                  onChange={() => handleCheckboxChange("B2")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">B2</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="C2"
                  checked={nivoi.includes("C2")}
                  onChange={() => handleCheckboxChange("C2")}
                  className="form-checkbox text-purple-600"
                />
                <span className="ml-2">C2</span>
              </label>
            </div>
          </div>

          {/* Greška za nivo jezika sada se prikazuje samo ispod checkboksova */}
          {nivoi.length === 0 && greska2 && (
            <p className="text-red-700 text-center mt-2">{greska2}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
          >
            Dodaj jezik
          </button>

          {/* Poruka o uspehu ako je jezik uspešno dodat */}
          {uspesno && (
            <p className="text-green-700 text-center mb-4">
              Jezik je uspešno dodat!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
