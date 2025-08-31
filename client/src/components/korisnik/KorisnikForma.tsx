import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";
import type { JezikSaNivoima } from "../../types/languageLevels/ApiResponseLanguageWithLevel";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { jwtDecode } from "jwt-decode";
import { userLanguageLevelApi } from "../../api_services/userLanguage/UserLanguageApiService";

interface JwtPayload {
  id: number;
}

export function KorisnikForma() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const apiService = new LanguageLevelAPIService();

  // Ref za programatsko klikanje na Link
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.id;
    } catch (error) {
      console.error("Neuspešno dekodiranje tokena:", error);
      return null;
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleAddLanguage = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Niste ulogovani.");
      return;
    }

    if (!selectedLanguage) {
      alert("Molimo izaberite jezik.");
      return;
    }

    setLoading(true);
    const response = await userLanguageLevelApi.dodajUserLanguageLevel(userId, selectedLanguage, "A1");
    setLoading(false);

    if (response.success) {
      setMessage("Uspešan odabir novog jezika za učenje.");
    } else {
      setMessage("Odabrali ste postojeći jezik.");
    }

    // Nakon 2 sekunde automatski pokreni klik na Link
    setTimeout(() => {
      linkRef.current?.click();
    }, 500);
  };

  const fetchLanguages = async () => {
    try {
      const data: JezikSaNivoima[] = await apiService.getLanguagesWithLevels();
      const jezici = data.map(item => item.jezik);
      setLanguages(jezici);
    } catch (error) {
      console.error("Greška pri dohvatanju jezika sa nivoima:", error);
      setLanguages([]);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[140px] px-6">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          Dobro došli, korisniče!
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Dodavanje jezika */}
          <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Izaberi jezik za učenje</h3>
              <p className="text-gray-700 mb-6">Izaberite jezik koji želite da učite.</p>

              <div className="mb-6">
                <select
                  className="w-full p-2 border border-purple-300 rounded-md"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  <option value="">Izaberite jezik</option>
                  {languages.length > 0 ? (
                    languages.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))
                  ) : (
                    <option disabled>Nema dostupnih jezika za dodavanje</option>
                  )}
                </select>
              </div>

              {message && (
                <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md text-sm text-center">
                  {message}
                </div>
              )}
            </div>

            {/* Dugme + sakriveni Link */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddLanguage}
                disabled={loading || languages.length === 0}
                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
              >
                {loading ? "Dodavanje..." : "Započni kviz"}
              </button>

              {/* Sakriveni Link koji će biti kliknut programatski */}
              <Link to="kviz" ref={linkRef} className="hidden" />
            </div>
          </div>

          {/* Kreiraj kviz */}
          <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Kreiraj kviz</h3>
            <p className="text-gray-700 mb-6">Napravite kviz kako biste testirali svoje znanje.</p>
            <div className="flex justify-end">
              <Link
                to="kreiraj-kviz"
                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
              >
                Kreiraj kviz
              </Link>
            </div>
          </div>

          {/* Moji rezultati */}
          <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Moji rezultati</h3>
            <p className="text-gray-700 mb-6">Pogledajte rezultate svih vaših kvizova.</p>
            <div className="flex justify-end">
              <Link
                to="moji-rezultati"
                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
              >
                Pogledaj rezultate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
