import { useState, useEffect } from "react";
import { UserQuizApiService } from "../../api_services/userQuiz/UserQuizApiService";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { userLanguageLevelApi } from "../../api_services/userLanguage/UserLanguageApiService";
import knjiga from "../../assets/knjiga.png";

interface ApiKvizStatistika {
  userId: number;
  jezik: string;
  nivo: string;
  brojKviza: number;
}

export function UrediNivoeForma() {
  const [kvizovi, setKvizovi] = useState<ApiKvizStatistika[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nivoiPoJeziku, setNivoiPoJeziku] = useState<Record<string, string[]>>({});
  const [azuriranjeStatus, setAzuriranjeStatus] = useState<Record<string, string>>({});
  const [globalniStatus, setGlobalniStatus] = useState<string | null>(null);

  const userQuizApiService = new UserQuizApiService();
  const languageLevelAPIService = new LanguageLevelAPIService();

  useEffect(() => {
    async function fetchKvizove() {
      setLoading(true);
      setError(null);
      try {
        const response = await userQuizApiService.dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri();
        setKvizovi(response.data);

        const jedinstveniJezici = Array.from(new Set(response.data.map(k => k.jezik)));

        const nivoiMap: Record<string, string[]> = {};
        await Promise.all(
          jedinstveniJezici.map(async (jezik) => {
            const nivoiObj = await languageLevelAPIService.getLevelsByLanguage(jezik);
            nivoiMap[jezik] = nivoiObj.nivoi.length > 0 ? nivoiObj.nivoi : ["Nema nivoa"];
          })
        );
        setNivoiPoJeziku(nivoiMap);
      } catch (err) {
        setError("Greška pri dohvatanju kvizova ili nivoa");
      } finally {
        setLoading(false);
      }
    }
    fetchKvizove();
  }, []);

  function getNextLevel(jezik: string, trenutniNivo: string): string | null {
    const nivoi = nivoiPoJeziku[jezik];
    if (!nivoi) return null;
    const idx = nivoi.indexOf(trenutniNivo);
    if (idx === -1 || idx === nivoi.length - 1) return null;
    return nivoi[idx + 1];
  }

  async function azurirajNivo(userId: number, jezik: string, trenutniNivo: string) {
    const sledeciNivo = getNextLevel(jezik, trenutniNivo);
    const statusKey = `${userId}_${jezik}`;

    if (!sledeciNivo) {
      try {
        // Ako je poslednji nivo, zatvori trenutni
        const krajNivoResponse = await userLanguageLevelApi.updateKrajNivoa(userId, jezik, trenutniNivo);
        if (krajNivoResponse.success) {
          setAzuriranjeStatus(prev => ({
            ...prev,
            [statusKey]: "Korisnik je završio kurs"
          }));
        } else {
          setAzuriranjeStatus(prev => ({
            ...prev,
            [statusKey]: `Greška pri zatvaranju nivoa: ${krajNivoResponse.message}`
          }));
        }
      } catch (error) {
        console.error(error);
        setAzuriranjeStatus(prev => ({
          ...prev,
          [statusKey]: "Greška pri zatvaranju nivoa"
        }));
      }
      return;
    }

    setAzuriranjeStatus(prev => ({
      ...prev,
      [statusKey]: "Ažuriranje u toku..."
    }));

    try {
      const updateKrajResponse = await userLanguageLevelApi.updateKrajNivoa(userId, jezik, trenutniNivo);
      if (!updateKrajResponse.success) {
        setAzuriranjeStatus(prev => ({
          ...prev,
          [statusKey]: `Greška pri zatvaranju prethodnog nivoa: ${updateKrajResponse.message}`
        }));
        return;
      }

      const dodajNoviResponse = await userLanguageLevelApi.dodajUserLanguageLevel(userId, jezik, sledeciNivo);
      if (dodajNoviResponse.success) {
        setAzuriranjeStatus(prev => ({
          ...prev,
          [statusKey]: `Uspešno ažurirano na nivo ${sledeciNivo}`
        }));
      } else {
        setAzuriranjeStatus(prev => ({
          ...prev,
          [statusKey]: `Greška pri dodavanju novog nivoa: ${dodajNoviResponse.message}`
        }));
      }
    } catch (error) {
      setAzuriranjeStatus(prev => ({
        ...prev,
        [statusKey]: "Došlo je do greške prilikom ažuriranja"
      }));
      console.error("Greška pri ažuriranju nivoa:", error);
    }
  }

  async function azurirajSveKorisnike() {
    setGlobalniStatus("Pokrećem masovno ažuriranje...");
    for (const { userId, jezik, nivo } of kvizovi) {
      await azurirajNivo(userId, jezik, nivo);
    }
    setGlobalniStatus("Ažuriranje završeno. Stranica se osvežava...");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-[140px] px-6 max-w-5xl mx-auto pb-20">
        <div className="bg-purple-50 border border-purple-300 rounded-xl p-6 mb-10">
          <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Pravila napredovanja:</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Za napredovanje na viši nivo, korisnik mora položiti najmanje <strong>3 kviza</strong>.</li>
            <li>Minimum <strong>85%</strong> tačnih odgovora po kvizu.</li>
            <li>Korisnik ne može preći <strong>najviši dostupni nivo</strong> za jezik.</li>
          </ul>
        </div>

        {loading && <p className="text-center text-lg text-purple-600">Učitavanje...</p>}
        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        {!loading && !error && kvizovi.length === 0 && (
          <p className="text-center text-gray-600">Nema podataka za prikaz.</p>
        )}

        {!loading && !error && kvizovi.length > 0 && (
          <>
            <table className="w-full border border-gray-300 rounded-md text-left bg-[#f3e5ff] shadow-md">
              <thead className="bg-[#e1cff7]">
                <tr>
                  <th className="p-3 border-b border-gray-300">User ID</th>
                  <th className="p-3 border-b border-gray-300">Jezik</th>
                  <th className="p-3 border-b border-gray-300">Nivo</th>
                  <th className="p-3 border-b border-gray-300">Broj kvizova &gt; 85%</th>
                  <th className="p-3 border-b border-gray-300">Svi nivoi</th>
                  <th className="p-3 border-b border-gray-300">Sledeći nivo</th>
                  <th className="p-3 border-b border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {kvizovi.map(({ userId, jezik, nivo, brojKviza }, index) => {
                  const sledeciNivo = getNextLevel(jezik, nivo);
                  const statusKey = `${userId}_${jezik}`;
                  return (
                    <tr key={index} className="hover:bg-purple-100 align-top">
                      <td className="p-3 border-b border-gray-300">{userId}</td>
                      <td className="p-3 border-b border-gray-300">{jezik}</td>
                      <td className="p-3 border-b border-gray-300">{nivo}</td>
                      <td className="p-3 border-b border-gray-300">{brojKviza}</td>
                      <td className="p-3 border-b border-gray-300">
                        {nivoiPoJeziku[jezik]?.join(", ") ?? <em>Učitavanje nivoa...</em>}
                      </td>
                      <td className="p-3 border-b border-gray-300">{sledeciNivo ?? "Nema sledećeg nivoa"}</td>
                      <td className="p-3 border-b border-gray-300 text-sm text-gray-700">
                        {azuriranjeStatus[statusKey]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Masovno ažuriranje i dugme nazad */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                onClick={azurirajSveKorisnike}
                className="bg-green-600 text-white px-6 py-2 rounded text-lg font-semibold hover:bg-green-700"
              >
                Ažuriraj sve korisnike
              </button>

              <button
                onClick={() => window.history.back()}
                className="text-purple-600 border border-purple-600 px-4 py-2 rounded hover:bg-purple-100 transition"
              >
                ← Nazad
              </button>

              {globalniStatus && (
                <p className="mt-2 text-purple-700 text-lg font-medium">{globalniStatus}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
