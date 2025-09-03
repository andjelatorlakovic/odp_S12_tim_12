import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import knjiga from "../../assets/knjiga.png";
import { UserQuizApiService } from "../../api_services/userQuiz/UserQuizApiService";
import type { FinishedLanguageLevelDto } from "../../models/userQuiz/FinishedLevelsDto";

interface JwtPayload {
  id: number;
  korisnickoIme: string;
  blokiran?: boolean | number;
}

const userQuizApi = new UserQuizApiService();

export function RezultatiForma() {
  const [rezultati, setRezultati] = useState<FinishedLanguageLevelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token nije pronađen. Morate biti prijavljeni.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.korisnickoIme) throw new Error("Username nije pronađen u tokenu.");
      setUsername(decoded.korisnickoIme);
      setError(null);
    } catch {
      setError("Neispravan token ili nedostaje korisničko ime.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const data = await userQuizApi.dobaviZavrseneNivoePoKorisnickomImenu(username);
        setRezultati(data ?? []); 
      } catch {
        setError("Greška pri dohvatanju završenih nivoa.");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-[#f3e5ff] py-4 shadow-md z-10 flex justify-center items-center gap-2">
        <img src={knjiga} alt="knjiga" className="w-16 h-auto" />
        <h1 className="text-4xl font-bold text-[#8f60bf]">Ucilingo</h1>
      </div>

      <div className="pt-32 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-[#8f60bf] mb-8">
          Završeni nivoi za korisnika{" "}
          <span className="underline">{username ?? "Nepoznato"}</span>
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
