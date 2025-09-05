import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";

interface Korisnik {
  id: number;
  korisnickoIme: string;
  blokiran: boolean;
  uloga?: string;
}

export default function ListaBlokiranihKorisnikaForma() {
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [poruka, setPoruka] = useState("");
  const [loadingOdblokiraj, setLoadingOdblokiraj] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:4000/api/v1/korisnici", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju korisnika");
        return res.json();
      })
      .then((data) => {
        const blokiraniKorisnici = data.filter(
          (k: Korisnik) => k.blokiran && k.uloga !== "moderator"
        );
        setKorisnici(blokiraniKorisnici);
      })
      .catch((err) => {
        console.error(err);
        setPoruka("Greška pri učitavanju korisnika");
      });
  }, []);

  async function odblokirajKorisnika(id: number) {
    const token = localStorage.getItem("authToken");
    setLoadingOdblokiraj(id);
    setPoruka("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/korisnici/odblokiraj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: [id] }), // šaljemo niz sa jednim ID
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Greška pri odblokiranju korisnika");
      }

      // Ukloni korisnika iz liste nakon odblokiranja
      setKorisnici((prev) => prev.filter((k) => k.id !== id));
      setPoruka("Korisnik uspesno odblokiran.");
    } catch (err) {
      setPoruka(err instanceof Error ? err.message : "Nepoznata greška");
    } finally {
      setLoadingOdblokiraj(null);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-[140px] px-6 max-w-md mx-auto">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          Lista blokiranih korisnika
        </h2>

        {poruka && <p className="text-center text-red-700 mb-4">{poruka}</p>}

        <div className="bg-[#f3e5ff] p-6 rounded-xl shadow-md border border-purple-300 max-h-96 overflow-auto">
          {korisnici.length === 0 ? (
            <p className="text-center text-gray-700">Nema blokiranih korisnika.</p>
          ) : (
            korisnici.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between gap-3 p-2 rounded bg-purple-50 mb-2"
              >
                <span>{k.korisnickoIme}</span>
                <button
                  onClick={() => odblokirajKorisnika(k.id)}
                  disabled={loadingOdblokiraj === k.id}
                  className="py-1 px-3 bg-[#8f60bf] text-white font-semibold rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition disabled:bg-gray-400"
                >
                  {loadingOdblokiraj === k.id ? "Odblokiranje..." : "Odblokiraj"}
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
        >
          Nazad
        </button>
      </div>
    </div>
  );
}
