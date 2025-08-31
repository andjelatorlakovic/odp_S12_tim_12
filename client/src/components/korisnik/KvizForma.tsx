import  { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userLanguageLevelApi } from "../../api_services/userLanguage/UserLanguageApiService";
import { jwtDecode } from "jwt-decode";
import { kvizApi } from "../../api_services/quiz/QuizApiService";
import knjiga from "../../assets/knjiga.png";

interface Kviz {
  id: number;
  naziv_kviza: string;
  jezik: string;
  nivo_znanja: string;
}

function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("Token nije pronađen u localStorage.");
    return null;
  }

  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Greška pri dekodiranju tokena:", error);
    return null;
  }
}

export function KvizForma() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const language = params.get("language") || "";

  const [nivo, setNivo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [kvizovi, setKvizovi] = useState<Kviz[]>([]);
  const [loadingKvizovi, setLoadingKvizovi] = useState(false);
  const [errorKvizovi, setErrorKvizovi] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserIdFromToken();

    if (!userId) {
      setError("Korisnik nije ulogovan.");
      setNivo(null);
      return;
    }

    if (!language) {
      setError("Nije prosleđen jezik.");
      setNivo(null);
      return;
    }

    setLoading(true);
    userLanguageLevelApi
      .getByUserAndLanguage(userId, language)
      .then((response) => {
        if (response.success && response.data) {
          setNivo(response.data.nivo);
          setError(null);
        } else {
          setNivo(null);
          setError(response.message || "Nema podataka za korisnikov jezik.");
        }
      })
      .catch(() => {
        setNivo(null);
        setError("Greška pri učitavanju podataka.");
      })
      .finally(() => setLoading(false));
  }, [language]);

  useEffect(() => {
    if (!nivo || !language) {
      setKvizovi([]);
      return;
    }

    setLoadingKvizovi(true);
    kvizApi
      .dobaviKvizovePoJezikuINivou(language, nivo)
      .then((response) => {
        if (response.success && response.data) {
          setKvizovi(response.data);
          setErrorKvizovi(null);
        } else {
          setKvizovi([]);
          setErrorKvizovi(
            response.message || "Nema kvizova za dati nivo i jezik."
          );
        }
      })
      .catch(() => {
        setKvizovi([]);
        setErrorKvizovi("Greška pri dohvatanju kvizova.");
      })
      .finally(() => setLoadingKvizovi(false));
  }, [language, nivo]);

  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[140px] px-6 pb-10">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          {nivo && language
            ? `Odaberi kviz i testiraj znanje iz jezika ${language} za trenutni nivo znanja ${nivo}`
            : "Učitavanje podataka..."}
        </h2>

        {loading && <p className="text-center">Učitavanje nivoa jezika...</p>}

        {!loading && error && (
          <p className="text-center text-red-600 mb-6">{error}</p>
        )}

        {loadingKvizovi && (
          <p className="text-center text-purple-700">Učitavanje kvizova...</p>
        )}

        {!loadingKvizovi && errorKvizovi && (
          <p className="text-center text-red-600">{errorKvizovi}</p>
        )}

        {!loadingKvizovi && kvizovi.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
            {kvizovi.map((kviz) => (
              <div
                key={kviz.id}
                className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-[#8f60bf]">
                  {kviz.naziv_kviza}
                </h3>
              </div>
            ))}
          </div>
        )}

        {!loadingKvizovi && !errorKvizovi && kvizovi.length === 0 && nivo && (
          <p className="text-center text-gray-600">
            Nema dostupnih kvizova za tvoj nivo i jezik.
          </p>
        )}
      </div>
    </div>
  );
}
