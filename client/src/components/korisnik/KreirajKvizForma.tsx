import { useState, useEffect } from "react";
import knjiga from "../../assets/knjiga.png";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";

type Pitanje = {
  pitanje: string;
  odgovori: string[];
  tacanOdgovor: string;
};

type Jezik = {
  jezik: string;
  nivoi: string[];
};

export function KreirajKvizForma() {
  const [pitanja, setPitanja] = useState<Pitanje[]>([
    { pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "odgovor1" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [languages, setLanguages] = useState<Jezik[]>([]);  // Stanje za jezike
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");  // Stanje za odabrani jezik
  const [levels, setLevels] = useState<string[]>([]);  // Stanje za nivoe jezika

  const languageLevelAPIService = new LanguageLevelAPIService(); // Kreiranje instance servisa

  // Funkcija za dohvat jezika i nivoa sa servera
  const fetchLanguages = async () => {
    try {
      const languagesWithLevels = await languageLevelAPIService.getLanguagesWithLevels();
      setLanguages(languagesWithLevels);
    } catch (error) {
      console.error("Greška pri dohvaćanju jezika:", error);
      setLanguages([]); // Postavi praznu listu ako dođe do greške
    }
  };

  // Pozivanje funkcije za učitavanje jezika kada se komponenta učita
  useEffect(() => {
    fetchLanguages();
  }, []);

  // Funkcija koja se poziva kada korisnik izabere jezik
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);

    // Filtriramo nivoe na osnovu odabranog jezika
    const languageData = languages.find(lang => lang.jezik === language);
    if (languageData) {
      setLevels(languageData.nivoi);
    }
  };

  const handleAddQuestion = () => {
    if (pitanja.length >= 6) {
      setErrorMessage("Maksimalno 6 pitanja po kvizu.");
      return;
    }
    setPitanja([
      ...pitanja,
      { pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "odgovor1" },
    ]);
    setErrorMessage("");  // Reset greške
  };

  const handleQuestionChange = (index: number, field: "pitanje", value: string) => {
    const newPitanja = [...pitanja];
    newPitanja[index][field] = value;
    setPitanja(newPitanja);
  };

  const handleAnswerChange = (index: number, answerIndex: number, value: string) => {
    const newPitanja = [...pitanja];
    newPitanja[index].odgovori[answerIndex] = value;
    setPitanja(newPitanja);
  };

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const newPitanja = [...pitanja];
    newPitanja[index].tacanOdgovor = value;
    setPitanja(newPitanja);
  };

  const canCreateQuiz = pitanja.length >= 3;

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
              <label htmlFor="quizName" className="block text-gray-700 font-semibold mb-2">
                Naziv kviza
              </label>
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
              <label htmlFor="jezik" className="block text-gray-700 font-semibold mb-2">
                Izaberi jezik
              </label>
              <select
                id="jezik"
                name="jezik"
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                value={selectedLanguage}
                onChange={handleLanguageChange}  // Pozivamo funkciju kada korisnik izabere jezik
              >
                <option value="">Izaberite jezik</option>
                {languages.map((lang, index) => (
                  <option key={index} value={lang.jezik}>
                    {lang.jezik}
                  </option>
                ))}
              </select>
            </div>

            {/* Odabir nivoa znanja */}
            <div>
              <label htmlFor="nivo" className="block text-gray-700 font-semibold mb-2">
                Izaberi nivo znanja
              </label>
              <select
                id="nivo"
                name="nivo"
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
              >
                {levels.length > 0 ? (
                  levels.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))
                ) : (
                  <option value="">Prvo izaberite jezik</option>
                )}
              </select>
            </div>

            {/* Unos pitanja i odgovora */}
            {pitanja.map((pitanje, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label
                    htmlFor={`pitanje-${index}`}
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Pitanje {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`pitanje-${index}`}
                    name={`pitanje-${index}`}
                    placeholder="Unesite pitanje"
                    className="w-full p-2 border border-purple-300 rounded-md bg-white"
                    value={pitanje.pitanje}
                    onChange={(e) =>
                      handleQuestionChange(index, "pitanje", e.target.value)
                    }
                  />
                </div>

                {/* Odgovori za pitanje */}
                <div className="space-y-2">
                  {pitanje.odgovori.map((odgovor, i) => (
                    <input
                      key={i}
                      type="text"
                      id={`odgovor-${index}-${i}`}
                      name={`odgovor-${index}-${i}`}
                      placeholder={`Odgovor ${i + 1}`}
                      className="w-full p-2 border border-purple-300 rounded-md bg-white"
                      value={odgovor}
                      onChange={(e) =>
                        handleAnswerChange(index, i, e.target.value)
                      }
                    />
                  ))}
                </div>

                {/* Odabir tačnog odgovora */}
                <div>
                  <label
                    htmlFor={`tacanOdgovor-${index}`}
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Izaberi tačan odgovor
                  </label>
                  <select
                    id={`tacanOdgovor-${index}`}
                    name={`tacanOdgovor-${index}`}
                    className="w-full p-2 border border-purple-300 rounded-md bg-white"
                    value={pitanje.tacanOdgovor}
                    onChange={(e) =>
                      handleCorrectAnswerChange(index, e.target.value)
                    }
                  >
                    {pitanje.odgovori.map((_, i) => (
                      <option key={i} value={`odgovor${i + 1}`}>
                        Odgovor {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {/* Poruka o grešci */}
            {errorMessage && (
              <div className="text-red-500 text-sm mt-4">
                {errorMessage}
              </div>
            )}

            {/* Dugme za dodavanje pitanja */}
            {pitanja.length < 6 && (
              <div className="flex justify-start mt-6">
                <button
                  type="button"
                  className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
                  onClick={handleAddQuestion}
                >
                  Dodaj pitanje
                </button>
              </div>
            )}

            {/* Dugme za slanje forme (onemogućeno ako nije uneto bar 3 pitanja) */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-[#8f60bf] text-white px-6 py-3 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
                disabled={!canCreateQuiz}
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
