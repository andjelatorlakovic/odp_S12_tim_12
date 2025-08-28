import { useState } from "react";
import knjiga from "../../assets/knjiga.png";

const nivoiZnanja = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function DodajNoviJezikForma({ onSubmit }: { onSubmit: (data: { jezik: string; nivo: string }) => void }) {
    const [jezik, setJezik] = useState("");
    const [nivo, setNivo] = useState(nivoiZnanja[0]);
    const [greska, setGreska] = useState("");

    const podnesiFormu = (e: React.FormEvent) => {
        e.preventDefault();
        if (!jezik.trim()) {
            setGreska("Molimo unesite naziv jezika.");
            return;
        }
        if (!nivo) {
            setGreska("Molimo odaberite nivo znanja.");
            return;
        }
        setGreska("");
        onSubmit({ jezik: jezik.trim(), nivo });
        setJezik("");
        setNivo(nivoiZnanja[0]);
    };

    return (
        <>
            {/* Zaglavlje */}
            <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
                <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
                <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
            </div>

            {/* Forma centrirana vertikalno i horizontalno */}
            <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-[0px]">
                <form
                    onSubmit={podnesiFormu}
                    className="w-full max-w-sm bg-[#f3e5ff] p-8 rounded-2xl shadow-lg border border-purple-400"
                >
                    <h2 className="text-3xl font-bold text-[#8f60bf] mb-6 text-center">Dodaj novi jezik</h2>

                    <label className="block text-lg text-gray-800 mb-2">Naziv jezika:</label>
                    <input
                        type="text"
                        value={jezik}
                        onChange={(e) => setJezik(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-5 bg-white"
                        placeholder="Unesite naziv jezika"
                    />

                    <label className="block text-lg text-gray-800 mb-2">Nivo znanja:</label>
                    <select
                        value={nivo}
                        onChange={(e) => setNivo(e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-5 bg-white"
                    >
                        {nivoiZnanja.map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>

                    {greska && <p className="text-red-700 text-center mb-4">{greska}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#8f60bf] text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
                    >
                        Dodaj jezik
                    </button>
                </form>
            </div>
        </>
    );
}
