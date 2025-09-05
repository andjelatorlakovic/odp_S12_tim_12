import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";

import { userLanguageLevelApi } from "../../api_services/userLanguage/UserLanguageApiService";
import type { JezikSaNivoima } from "../../types/languageLevels/ApiResponseLanguageWithLevel";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface KorisnikFormaProps {
  apiService: ILanguageLevelAPIService;
}

export const KorisnikForma: React.FC<KorisnikFormaProps> = ({ apiService }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, blokiran, token, logout } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (blokiran) {
      setIsBlocked(true);
      setBlockedMessage("Vaš nalog je blokiran. Možete samo pregledati rezultate.");
    } else {
      setIsBlocked(false);
      setBlockedMessage("");
    }
  }, [blokiran]);

  const fetchLanguages = async () => {
    if (!token) {
      console.error("Token nije pronađen. Niste ulogovani.");
      return;
    }
    try {
      const data: JezikSaNivoima[] = await apiService.getLanguagesWithLevels();
      const jezici = data.map((item) => item.jezik);
      setLanguages(jezici);
    } catch (error) {
      console.error("Greška pri dohvatanju jezika sa nivoima:", error);
      setLanguages([]);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [token]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleAddLanguage = async () => {
    if (!user?.id) {
      alert("Niste ulogovani.");
      return;
    }

    if (!selectedLanguage) {
      alert("Molimo izaberite jezik.");
      return;
    }

    setLoading(true);

    const response = await userLanguageLevelApi.dodajUserLanguageLevel(
      user.id,
      selectedLanguage,
      "A1",
      token!
    );

    setLoading(false);

    if (response.success) {
      setMessage("Uspešan odabir novog jezika za učenje.");
    } else {
      setMessage("Odabrali ste postojeći jezik.");
    }

    setTimeout(() => {
      navigate(`kviz?language=${encodeURIComponent(selectedLanguage)}`);
    }, 500);
  };

  // Dodajemo logout funkciju
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[140px] px-6">
        {isBlocked && (
          <div className="mb-6 max-w-5xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
            {blockedMessage}
          </div>
        )}

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
                  disabled={isBlocked}
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

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddLanguage}
                disabled={loading || languages.length === 0 || isBlocked}
                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Dodavanje..." : "Započni kviz"}
              </button>
            </div>
          </div>

          {/* Kreiraj kviz */}
          <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Kreiraj kviz</h3>
            <p className="text-gray-700 mb-6">Napravite kviz kako biste testirali svoje znanje.</p>
            <div className="flex justify-end">
              <Link
                to={isBlocked ? "#" : "kreiraj-kviz"}
                onClick={(e) => isBlocked && e.preventDefault()}
                className={`px-4 py-2 rounded-md border transition ${isBlocked
                    ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                    : "bg-[#8f60bf] text-white hover:bg-white hover:text-[#8f60bf] border-[#8f60bf]"
                  }`}
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

        {/* Logout dugme */}
        {/* Logout dugme odmah ispod zaglavlja */}
        <div className="fixed top-[20px] right-6 z-30">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#8f60bf] text-white rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
