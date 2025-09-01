import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";

interface Korisnik {
  id: number;
  korisnickoIme: string;
  blokiran: boolean;
  uloga?: string; // dodato zbog filtera
}

export default function BlokirajKorisnikaForma() {
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [selektovani, setSelektovani] = useState<number[]>([]);
  const [poruka, setPoruka] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);

    fetch("http://localhost:4000/api/v1/korisnici", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Podaci sa servera:", data);
        // Filtriraj korisnike da ne prikazuješ moderatore i blokirane korisnike
        const filtriraniKorisnici = data.filter(
          (k: Korisnik) => k.uloga !== "moderator" && !k.blokiran
        );
        setKorisnici(filtriraniKorisnici);
      })
      .catch((err) => {
        console.log("Greška:", err);
        setPoruka("Greška pri učitavanju korisnika");
      });
  }, []);

  const toggleSelektovani = (id: number) => {
    setSelektovani((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selektovani.length === 0) {
      setPoruka("Изаберите бар 1 корисника за блокирање.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("http://localhost:4000/api/v1/korisnici/blokiraj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: selektovani }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Greška pri blokiranju korisnika");
      }

      setPoruka("Успешно блокирани корисници.");

      // Ukloni blokirane korisnike iz liste (pretpostavka da su sada blokirani)
      setKorisnici((prev) => prev.filter((k) => !selektovani.includes(k.id)));

      // Resetuj selektovane
      setSelektovani([]);
    } catch (err) {
      setPoruka(err instanceof Error ? err.message : "Nepoznata greška");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-[140px] px-6 max-w-md mx-auto">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          Blokiraj korisnika
        </h2>

        {poruka && <p className="text-center text-red-700 mb-4">{poruka}</p>}

        <form
          onSubmit={podnesiFormu}
          className="bg-[#f3e5ff] p-6 rounded-xl shadow-md border border-purple-300"
        >
          <div className="max-h-64 overflow-auto mb-6">
            {korisnici.length === 0 && <p>Nema korisnika za prikaz.</p>}
            {korisnici.map((k) => (
              <label
                key={k.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-purple-100 ${k.blokiran ? "line-through text-gray-500" : ""
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selektovani.includes(k.id)}
                  onChange={() => toggleSelektovani(k.id)}
                  disabled={k.blokiran}
                />
                <span>{k.korisnickoIme}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
          >
            Blokiraj selektovane korisnike
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Navigate back
          className="mt-6 w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
        >
          Nazad
        </button>
      </div>
    </div>
  );
}
