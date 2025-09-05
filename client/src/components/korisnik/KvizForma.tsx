import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { userLanguageLevelApi } from "../../api_services/userLanguage/UserLanguageApiService";
import { kvizApi } from "../../api_services/quiz/QuizApiService";
import knjiga from "../../assets/knjiga.png";
import type { IQuestionAPIService } from "../../api_services/questions/IQuestionsApiService";
import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import type { IAnswerAPIService } from "../../api_services/answers/IAnswerApiService";
import { useAuth } from "../../hooks/auth/useAuthHook";


interface KvizFomaProps {
  questionApiService: IQuestionAPIService;
  answerApiService: IAnswerAPIService;
  userQuizApi: IUserQuizApiService;
}

interface Kviz {
  id: number;
  naziv_kviza: string;
  jezik: string;
  nivo_znanja: string;
}

interface Question {
  id: number;
  tekst_pitanja: string;
}

interface Answer {
  id: number;
  tekst_odgovora: string;
  tacan: boolean;
}

export function KvizForma({
  questionApiService,
  answerApiService,
  userQuizApi,
}: KvizFomaProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const language = params.get("language") || "";

  // Use auth hook to get user and token:
  const { user, token } = useAuth();
  const userId = user?.id || null;

  const [nivo, setNivo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [kvizovi, setKvizovi] = useState<Kviz[]>([]);
  const [loadingKvizovi, setLoadingKvizovi] = useState(false);
  const [errorKvizovi, setErrorKvizovi] = useState<string | null>(null);

  const [selectedKvizId, setSelectedKvizId] = useState<number | null>(null);
  const [pitanja, setPitanja] = useState<Question[]>([]);
  const [loadingPitanja, setLoadingPitanja] = useState(false);
  const [errorPitanja, setErrorPitanja] = useState<string | null>(null);

  const [odgovoriZaPitanja, setOdgovoriZaPitanja] = useState<Record<number, Answer[]>>({});
  const [odabraniOdgovori, setOdabraniOdgovori] = useState<Record<number, number>>({});
  const [rezultat, setRezultat] = useState<number | null>(null);
  const [kvizZavrsen, setKvizZavrsen] = useState(false);

  const handleOdgovorChange = (pitanjeId: number, odgovorId: number) => {
    setOdabraniOdgovori((prev) => ({
      ...prev,
      [pitanjeId]: odgovorId,
    }));
  };

  const zavrsiKviz = async () => {
    if (!selectedKvizId) return;

    let brojTacnih = 0;
    for (const pitanjeId in odabraniOdgovori) {
      const odgovorId = odabraniOdgovori[pitanjeId];
      const odgovori = odgovoriZaPitanja[Number(pitanjeId)];
      if (odgovori) {
        const odg = odgovori.find((o) => o.id === odgovorId);
        if (odg && odg.tacan) {
          brojTacnih++;
        }
      }
    }

    setRezultat(brojTacnih);
    setKvizZavrsen(true);

    // Čuvanje rezultata
    if (!userId || !language || !nivo || !token) return;

    const procenatTacnih = (brojTacnih / pitanja.length) * 100;

    try {
      const response = await userQuizApi.kreirajRezultat(
        userId,
        selectedKvizId,
        language,
        nivo,
        procenatTacnih,
        token // token from auth hook
      );

      if (response.success) {
        console.log("Rezultat uspešno sačuvan:", response.data);
      } else {
        console.warn("Neuspešno čuvanje rezultata:", response.message);
      }
    } catch (error) {
      console.error("Greška pri čuvanju rezultata:", error);
    }
  };

  const nazadNaKvizove = () => {
    setSelectedKvizId(null);
    setPitanja([]);
    setOdgovoriZaPitanja({});
    setOdabraniOdgovori({});
    setRezultat(null);
    setKvizZavrsen(false);

    // Osvježavanje liste kvizova
    if (!userId || !language || !nivo || !token) return;

    setLoadingKvizovi(true);
    kvizApi
      .dobaviKvizovePoJezikuINivou(language, nivo, token) // token from auth hook
      .then((response) => {
        if (response.success && response.data) {
          setKvizovi(response.data);
          setErrorKvizovi(null);
        } else {
          setKvizovi([]);
          setErrorKvizovi(response.message || "Nema kvizova za dati nivo i jezik.");
        }
      })
      .catch(() => {
        setKvizovi([]);
        setErrorKvizovi("Greška pri dohvatanju kvizova.");
      })
      .finally(() => setLoadingKvizovi(false));
  };

  useEffect(() => {
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

    if (!token) {
      setError("Korisnik nije ulogovan.");
      setNivo(null);
      return;
    }

    setLoading(true);
    userLanguageLevelApi
      .getByUserAndLanguage(userId, language, token)
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
  }, [language, userId, token]);

  useEffect(() => {
    if (!nivo || !language || selectedKvizId) return;
    if (!userId || !token) return;

    setLoadingKvizovi(true);
    kvizApi
      .dobaviKvizovePoJezikuINivou(language, nivo, token)
      .then((response) => {
        if (response.success && response.data) {
          setKvizovi(response.data);
          setErrorKvizovi(null);
        } else {
          setKvizovi([]);
          setErrorKvizovi(response.message || "Nema kvizova za dati nivo i jezik.");
        }
      })
      .catch(() => {
        setKvizovi([]);
        setErrorKvizovi("Greška pri dohvatanju kvizova.");
      })
      .finally(() => setLoadingKvizovi(false));
  }, [language, nivo, selectedKvizId, userId, token]);

  useEffect(() => {
    if (!selectedKvizId) return;
    if (!token) {
      setError("Korisnik nije ulogovan.");
      setLoadingPitanja(false);
      return;
    }

    setLoadingPitanja(true);
    setErrorPitanja(null);

    questionApiService
      .dobaviPitanjaZaKviz(selectedKvizId, token)
      .then(async (pitanjaResponse) => {
        setPitanja(pitanjaResponse);

        const odgovoriMap: Record<number, Answer[]> = {};
        await Promise.all(
          pitanjaResponse.map(async (pitanje) => {
            const odgovori = await answerApiService.dobaviOdgovoreZaPitanje(pitanje.id, token);
            odgovoriMap[pitanje.id] = odgovori;
          })
        );

        setOdgovoriZaPitanja(odgovoriMap);
      })
      .catch(() => {
        setPitanja([]);
        setOdgovoriZaPitanja({});
        setErrorPitanja("Greška pri dohvatanju pitanja za kviz.");
      })
      .finally(() => setLoadingPitanja(false));
  }, [selectedKvizId, token]);

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
            ? `Odaberi kviz i testiraj znanje iz jezika ${language} za nivo ${nivo}`
            : "Učitavanje podataka..."}
        </h2>

        {loading && <p className="text-center">Učitavanje nivoa jezika...</p>}
        {!loading && error && <p className="text-center text-red-600 mb-6">{error}</p>}

        {kvizZavrsen && rezultat !== null && (
          <div className="text-center space-y-4 mt-10">
            <p className="text-lg font-bold text-green-600">
              Tačnih odgovora: {rezultat} / {pitanja.length} (
              {((rezultat / pitanja.length) * 100).toFixed(2)}%)
            </p>
            <button
              onClick={nazadNaKvizove}
              className="bg-[#8f60bf] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-[#764ba2] transition"
            >
              Nazad na kvizove
            </button>
          </div>
        )}

        {!kvizZavrsen && (
          <>
            {loadingKvizovi && <p className="text-center text-purple-700">Učitavanje kvizova...</p>}
            {!loadingKvizovi && errorKvizovi && (
              <p className="text-center text-red-600">{errorKvizovi}</p>
            )}

            {!loadingKvizovi && !errorKvizovi && kvizovi.length > 0 && (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto mb-10">
                {kvizovi.map((kviz) => (
                  <div
                    key={kviz.id}
                    onClick={() => {
                      if (!selectedKvizId) setSelectedKvizId(kviz.id);
                    }}
                    className={`bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 cursor-pointer select-none ${selectedKvizId === kviz.id ? "ring-2 ring-[#8f60bf]" : ""
                      } ${selectedKvizId ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <h3 className="text-2xl font-bold text-[#8f60bf]">{kviz.naziv_kviza}</h3>
                    <p>
                      <strong>Jezik:</strong> {kviz.jezik}
                    </p>
                    <p>
                      <strong>Nivo znanja:</strong> {kviz.nivo_znanja}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loadingKvizovi && kvizovi.length === 0 && (
              <p className="text-center text-gray-600">
                Nema dostupnih kvizova za tvoj nivo i jezik.
              </p>
            )}
          </>
        )}

        {/* Prikaz pitanja */}
        {!kvizZavrsen && !loadingPitanja && pitanja.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-8">
            {pitanja.map((pitanje, index) => (
              <div key={pitanje.id} className="bg-white border border-purple-300 rounded-lg p-6 shadow-md">
                <h4 className="text-xl font-semibold text-[#8f60bf] mb-4">
                  {index + 1}. {pitanje.tekst_pitanja}
                </h4>
                <div className="space-y-2">
                  {(odgovoriZaPitanja[pitanje.id] || []).map((odgovor) => (
                    <label key={odgovor.id} className="flex items-center space-x-2 text-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name={`pitanje-${pitanje.id}`}
                        value={odgovor.id}
                        checked={odabraniOdgovori[pitanje.id] === odgovor.id}
                        onChange={() => handleOdgovorChange(pitanje.id, odgovor.id)}
                        className="form-radio text-[#8f60bf]"
                      />
                      <span>{odgovor.tekst_odgovora}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-10">
              <button
                type="submit"
                className="mt-[30px] w-[20%] h-[45px] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition mx-auto block rounded-md"
              >
                Završi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
