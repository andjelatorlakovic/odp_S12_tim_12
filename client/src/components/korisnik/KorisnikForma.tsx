import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";
import type { JezikSaNivoima } from '../../types/languageLevels/ApiResponseLanguageWithLevel';
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";

export function KorisnikForma() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState<string[]>([]);
    const apiService = new LanguageLevelAPIService();

    // Funkcija koja menja izabrani jezik (samo lokalno)
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    // Dohvat jezika iz API-ja pri mountovanju komponente
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const data: JezikSaNivoima[] = await apiService.getLanguagesWithLevels();
                const jezici = data.map(item => item.jezik);
                setLanguages(jezici);
            } catch (error) {
                console.error("Greška pri dohvatanju jezika:", error);
            }
        };
        fetchLanguages();
    }, []);

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
                    Dobro dosli, korisnice!
                </h2>

                {/* Kartice sa opcijama */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto">
                    {/* Kartica: Dodaj jezik */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Dodaj jezik za učenje</h3>
                        <p className="text-gray-700 mb-6">
                            Izaberite jezik koji želite da učite.
                        </p>

                        {/* Padajući meni */}
                        <div className="mb-6">
                            <select
                                className="w-full p-2 border border-purple-300 rounded-md"
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                            >
                                <option value="">Izaberite jezik</option>
                                {languages.map((language, index) => (
                                    <option key={index} value={language}>{language}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Ostale kartice */}
                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Kreiraj kviz</h3>
                        <p className="text-gray-700 mb-6">
                            Napravite kviz kako biste testirali svoje znanje.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="kreiraj-kviz"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Kreiraj kviz
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Radite kviz</h3>
                        <p className="text-gray-700 mb-6">
                            Pronađite kvizove i testirajte svoje znanje.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="radite-kviz"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Radite kviz
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Moji rezultati</h3>
                        <p className="text-gray-700 mb-6">
                            Pogledajte rezultate svih vaših kvizova.
                        </p>
                        <div className="flex justify-end">
                            <Link
                                to="moji-rezultati"
                                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition flex items-center justify-center"
                            >
                                Pogledaj rezultate
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
