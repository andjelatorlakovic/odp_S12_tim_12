import { useState, useEffect } from "react";
import { UserQuizApiService } from "../../api_services/userQuiz/UserQuizApiService";

interface KvizStatistika {
  user_id: number;
  jezik: string;
  nivo: string;
  broj_kviza: number;
}

export function UrediNivoeForma() {
  const [kvizovi, setKvizovi] = useState<KvizStatistika[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userQuizApiService = new UserQuizApiService();

  useEffect(() => {
    async function fetchKvizove() {
      setLoading(true);
      setError(null);
      try {
        const response = await userQuizApiService.dobaviKvizoveSaProcentomPreko85SaBrojemVecimOdTri();
        setKvizovi(response.data || []);
      } catch (err: any) {
        setError("Greška pri dohvatanju kvizova");
      } finally {
        setLoading(false);
      }
    }

    fetchKvizove();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Kvizovi sa ≥85% i ≥3 položenih
      </h1>

      {loading && (
        <p className="text-center text-lg text-purple-600">Učitavanje...</p>
      )}

      {error && <p className="text-center text-red-600">Greška: {error}</p>}

      {!loading && !error && kvizovi.length === 0 && (
        <p className="text-center text-gray-600">Nema podataka za prikaz.</p>
      )}

      {!loading && !error && kvizovi.length > 0 && (
        <table className="w-full border border-gray-300 rounded-md text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b border-gray-300">User ID</th>
              <th className="p-3 border-b border-gray-300">Jezik</th>
              <th className="p-3 border-b border-gray-300">Nivo</th>
              <th className="p-3 border-b border-gray-300">Broj kvizova &gt; 85%</th>
            </tr>
          </thead>
          <tbody>
            {kvizovi.map(({ user_id, jezik, nivo, broj_kviza }, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-300">{user_id}</td>
                <td className="p-3 border-b border-gray-300">{jezik}</td>
                <td className="p-3 border-b border-gray-300">{nivo}</td>
                <td className="p-3 border-b border-gray-300">{broj_kviza}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
