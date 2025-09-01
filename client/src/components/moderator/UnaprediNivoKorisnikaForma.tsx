import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";
import { usersApi } from "../../api_services/users/UsersAPIService";
import type { UserDto } from "../../models/users/UserDto";
import type { JezikSaNivoima } from "../../types/languageLevels/ApiResponseLanguageWithLevel";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { UserQuizApiService } from "../../api_services/userQuiz/UserQuizApiService";
import type { ApiResponseKvizCount } from "../../types/userQuiz/ApiResponseUserQuiz";

// Dodajemo interfejs za korisnika sa jezicima koji ispunjavaju uslove
interface KorisnikSaJezicima {
  korisnik: UserDto;
  jeziciKojiIspravljaju: string[];
  trenutniNivo: string; // Dodajemo polje za trenutni nivo
}

export function UrediNivoeForma() {
  const [korisnici, setKorisnici] = useState<UserDto[]>([]);
  const [jezici, setJezici] = useState<JezikSaNivoima[]>([]); 
  const [korisniciZaNapredovanje, setKorisniciZaNapredovanje] = useState<KorisnikSaJezicima[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 

  const token = localStorage.getItem("authToken") || "";
  const languageLevelAPIService = new LanguageLevelAPIService();
  const userQuizApiService = new UserQuizApiService();

  // Učitaj korisnike i jezike
  useEffect(() => {
    async function fetchKorisnici() {
      setLoading(true);
      try {
        const korisniciSaServera = await usersApi.getSviKorisnici(token);
        const filtrirani = korisniciSaServera.filter(
          (k: UserDto) => k.uloga !== "moderator" && !k.blokiran
        );
        setKorisnici(filtrirani);
      } catch (error) {
        console.error("Greška pri dohvatanju korisnika:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchJezici() {
      setLoading(true);
      try {
        const jeziciSaNivima = await languageLevelAPIService.getLanguagesWithLevels();
        setJezici(jeziciSaNivima);
      } catch (error) {
        console.error("Greška pri dohvatanju jezika sa nivoima:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchKorisnici();
    fetchJezici();
  }, [token]);

  // Funkcija koja vraća nivo za korisnika na osnovu jezika
  const getTrenutniNivo = (jezik: string) => {
    const jezikNivo = jezici.find((item) => item.jezik === jezik);
    if (jezikNivo && jezikNivo.nivoi.length > 0) {
      return jezikNivo.nivoi[0]; // Vraća prvi nivo za dati jezik (možeš implementirati logiku za više nivoa ako je potrebno)
    }
    return "Nema nivoa"; // Vraća poruku ako nema nivoa
  };

  // Proverava da li korisnik ispunjava uslove za napredovanje na bilo kojem jeziku
  const checkKorisnikZaNapredovanje = async (userId: number) => {
    try {
      const jeziciKojiIspravljaju = []; // Spisak jezika za koje korisnik ispunjava uslove

      for (const jezik of jezici) {
        const response: ApiResponseKvizCount = await userQuizApiService.brojKvizovaSa85(userId, jezik.jezik);
        if (response.data >= 3) { 
          jeziciKojiIspravljaju.push(jezik.jezik); // Dodaj jezik u spisak
        }
      }

      // Ako korisnik ispunjava uslove za bilo koji jezik, vraćamo niz jezika
      return jeziciKojiIspravljaju.length > 0 ? jeziciKojiIspravljaju : null;
    } catch (error) {
      console.error("Greška pri prebrojavanju kvizova korisnika:", error);
      return null;
    }
  };

  // Filtrira korisnike koji ispunjavaju uslove za napredovanje
  useEffect(() => {
    if (korisnici.length === 0 || jezici.length === 0) {
      console.log("Korisnici ili jezici nisu učitani.");
      return;
    }

    async function fetchKorisniciZaNapredovanje() {
      setLoading(true);
      try {
        const filtrirani = await Promise.all(
          korisnici.map(async (korisnik) => {
            const jeziciKojiIspravljaju = await checkKorisnikZaNapredovanje(korisnik.id);
            if (jeziciKojiIspravljaju) {
              // Uzmi nivo za prvi jezik koji korisnik ispunjava
              const trenutniNivo = getTrenutniNivo(jeziciKojiIspravljaju[0]);
              return { korisnik, jeziciKojiIspravljaju, trenutniNivo };
            }
            return null;
          })
        );
        setKorisniciZaNapredovanje(filtrirani.filter(Boolean) as KorisnikSaJezicima[]); // Filtriraj null vrednosti
      } catch (error) {
        console.error("Greška pri filtriranju korisnika:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchKorisniciZaNapredovanje();
  }, [korisnici, jezici]); // Ovaj useEffect se pokreće kada se promene korisnici ili jezici

  // Funkcija za napredovanje svih korisnika koji ispunjavaju uslove
  const handleNapredovanjeSvih = async () => {
    try {
      for (const korisnikSaJezicima of korisniciZaNapredovanje) {
        // Za svakog korisnika koji ispunjava uslove, izvrši napredovanje
        console.log(`Korisnik ${korisnikSaJezicima.korisnik.korisnickoIme} je napredovao na viši nivo.`);
      }
      alert("Svi korisnici koji ispunjavaju uslove su unapređeni.");
    } catch (error) {
      console.error("Greška pri napredovanju korisnika:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-[140px] px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-8">
          Korisnici koji mogu napredovati
        </h2>

        {/* Pravila napredovanja */}
        <div className="bg-purple-50 border border-purple-300 rounded-xl p-6 mb-10">
          <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Pravila napredovanja:</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Za napredovanje na viši nivo, korisnik mora položiti najmanje <strong>3 kviza</strong>.</li>
            <li>Minimum <strong>85%</strong> tačnih odgovora po kvizu.</li>
            <li>Korisnik ne može preći <strong>najviši dostupni nivo</strong> za jezik.</li>
          </ul>
        </div>

        {loading && <div className="text-center text-xl text-purple-600">Učitavanje...</div>}

        {!loading && korisniciZaNapredovanje.length === 0 && (
          <div className="text-center text-xl text-red-600">Nema korisnika koji ispunjavaju uslove za napredovanje.</div>
        )}

        <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl p-6 shadow-md space-y-6">
          <table className="min-w-full table-auto text-left">
            <thead>
              <tr className="bg-purple-200">
                <th className="py-2 px-4">Korisnik</th>
                <th className="py-2 px-4">Trenutni Nivo</th>
                <th className="py-2 px-4">Jezik</th>
              </tr>
            </thead>
            <tbody>
              {korisniciZaNapredovanje.map(({ korisnik, jeziciKojiIspravljaju, trenutniNivo }) => (
                <tr key={korisnik.id}>
                  <td className="py-2 px-4">{korisnik.korisnickoIme}</td>
                  <td className="py-2 px-4">{trenutniNivo}</td>
                  <td className="py-2 px-4">{jeziciKojiIspravljaju.join(", ")}</td> {/* Prikazivanje jezika */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            className="bg-[#8f60bf] text-white py-2 px-4 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
            onClick={handleNapredovanjeSvih}
          >
            Unapredi sve korisnike
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link
            to="/moderator-dashboard"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Nazad
          </Link>
        </div>
      </div>
    </div>
  );
}
