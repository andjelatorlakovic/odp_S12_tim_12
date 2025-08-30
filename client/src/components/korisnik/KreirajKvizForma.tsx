import knjiga from "../../assets/knjiga.png";

export function KreirajKvizForma() {
    return (
        <div className="min-h-screen bg-white">
            {/* Zaglavlje */}
            <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
                <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
                <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
            </div>

            {/* Glavni sadržaj */}
            <div className="pt-[140px] px-6">
                <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
                    Kreiraj novi kviz
                </h2>

                {/* Forma za kreiranje kviza */}
                <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Podaci o kvizu</h3>
                    <form className="space-y-4">
                        {/* Unos naziva kviza */}
                        <div>
                            <label htmlFor="quizName" className="block text-gray-700 font-semibold mb-2">Naziv kviza</label>
                            <input
                                type="text"
                                id="quizName"
                                name="quizName"
                                placeholder="Unesite naziv kviza"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                        </div>

                        {/* Odabir jezika */}
                        <div>
                            <label htmlFor="jezik" className="block text-gray-700 font-semibold mb-2">Izaberi jezik</label>
                            <select id="jezik" name="jezik" className="w-full p-2 border border-purple-300 rounded-md bg-white">
                                <option value="engleski">Engleski</option>
                                <option value="nemacki">Nemački</option>
                                <option value="francuski">Francuski</option>
                                {/* Dodaj ostale jezike po potrebi */}
                            </select>
                        </div>

                        {/* Odabir nivoa znanja */}
                        <div>
                            <label htmlFor="nivo" className="block text-gray-700 font-semibold mb-2">Izaberi nivo znanja</label>
                            <select id="nivo" name="nivo" className="w-full p-2 border border-purple-300 rounded-md bg-white">
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                        </div>

                        {/* Unos pitanja */}
                        <div>
                            <label htmlFor="pitanje" className="block text-gray-700 font-semibold mb-2">Pitanje</label>
                            <input
                                type="text"
                                id="pitanje"
                                name="pitanje"
                                placeholder="Unesite pitanje"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                        </div>

                        {/* Unos odgovora */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold">Odgovori</label>
                            <input
                                type="text"
                                id="odgovor1"
                                name="odgovor1"
                                placeholder="Odgovor 1"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                            <input
                                type="text"
                                id="odgovor2"
                                name="odgovor2"
                                placeholder="Odgovor 2"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                            <input
                                type="text"
                                id="odgovor3"
                                name="odgovor3"
                                placeholder="Odgovor 3"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                            <input
                                type="text"
                                id="odgovor4"
                                name="odgovor4"
                                placeholder="Odgovor 4"
                                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                            />
                        </div>

                        {/* Odabir tačnog odgovora */}
                        <div>
                            <label htmlFor="tacanOdgovor" className="block text-gray-700 font-semibold mb-2">Izaberi tačan odgovor</label>
                            <select id="tacanOdgovor" name="tacanOdgovor" className="w-full p-2 border border-purple-300 rounded-md bg-white">
                                <option value="odgovor1">Odgovor 1</option>
                                <option value="odgovor2">Odgovor 2</option>
                                <option value="odgovor3">Odgovor 3</option>
                                <option value="odgovor4">Odgovor 4</option>
                            </select>
                        </div>

                        {/* Dugme za slanje forme */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
                            >
                                Kreiraj kviz
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
