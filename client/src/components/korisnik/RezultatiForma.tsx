import  { useEffect, useState } from "react";

import knjiga from "../../assets/knjiga.png";
import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";
import type { IUserQuizApiService } from "../../api_services/userQuiz/IUserQuizApiService";
import type { ILanguageLevelAPIService } from "../../api_services/languageLevels/ILanguageLevelApiService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface RezultatiFormaProps {
  userQuizApi: IUserQuizApiService;
  languageLevelAPIService: ILanguageLevelAPIService;
}

export function RezultatiForma({ userQuizApi, languageLevelAPIService }: RezultatiFormaProps) {
  const { token, user } = useAuth();  
  const [rezultati, setRezultati] = useState<FinishedLanguageLevelDto[]>([]);
  const [nivoiPoJeziku, setNivoiPoJeziku] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.korisnickoIme || !token) {
        setError("Niste prijavljeni ili nema tokena.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
     
        const data = await userQuizApi.dobaviZavrseneNivoePoKorisnickomImenu(user.korisnickoIme);
        setRezultati(data ?? []);

        
        const jedinstveniJezici = Array.from(new Set((data ?? []).map(r => r.jezik)));


        const nivoiMap: Record<string, string[]> = {};
        await Promise.all(
          jedinstveniJezici.map(async (jezik) => {
            const nivoRes = await languageLevelAPIService.getLevelsByLanguage(jezik, token);
            nivoiMap[jezik] = nivoRes.nivoi.length > 0 ? nivoRes.nivoi : ["Nema nivoa"];
          })
        );

        setNivoiPoJeziku(nivoiMap);
        setError(null);
      } catch {
        setError("Greška pri dohvatanju podataka.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, token, userQuizApi, languageLevelAPIService]);

  // Provera da li je nivo poslednji za dati jezik
  function isLastLevel(jezik: string, nivo: string): boolean {
    const nivoi = nivoiPoJeziku[jezik];
    if (!nivoi || nivoi.length === 0) return false;
    return nivoi[nivoi.length - 1] === nivo;
  }

  // Provera da li je korisnik završio kurs za neki od jezika
  const korisnikZavrsioKurs = rezultati.some(item => isLastLevel(item.jezik, item.nivo));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-32 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-[#8f60bf] mb-8">
          Završeni nivoi za korisnika{" "}
          <span className="underline">{user?.korisnickoIme ?? "Nepoznato"}</span>
        </h2>

        {loading && <p className="text-center text-purple-700">Učitavanje podataka...</p>}

        {error && <p className="text-center text-red-600 font-semibold mb-6">{error}</p>}

        {!loading && !error && rezultati.length === 0 && (
          <p className="text-center text-gray-600 font-semibold">
            Korisnik nema završenih nivoa.
          </p>
        )}

        {!loading && !error && rezultati.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white rounded-lg border border-gray-200">
              <thead className="bg-[#8f60bf] text-white">
                <tr>
                  <th className="p-4 text-left">Korisnik</th>
                  <th className="p-4 text-left">Jezik</th>
                  <th className="p-4 text-left">Nivo</th>
                  <th className="p-4 text-left">Početak nivoa</th>
                  <th className="p-4 text-left">Kraj nivoa</th>
                  <th className="p-4 text-left">Ukupno dana</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {rezultati.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-purple-50 transition">
                    <td className="p-4">{item.korisnickoIme}</td>
                    <td className="p-4">{item.jezik}</td>
                    <td className="p-4">{item.nivo}</td>
                    <td className="p-4">{new Date(item.pocetakNivoa).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(item.krajNivoa).toLocaleDateString()}</td>
                    <td className="p-4">{item.dani} dana</td>
                  </tr>
                ))}
                {korisnikZavrsioKurs && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center  font-bold bg-purple-200">
                      Korisnik je završio kurs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
