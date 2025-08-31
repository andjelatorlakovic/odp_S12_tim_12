import { useState, useEffect } from "react";
import knjiga from "../../assets/knjiga.png";
import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { kvizApi } from "../../api_services/quiz/QuizApiService";

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
  const [languages, setLanguages] = useState<Jezik[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [levels, setLevels] = useState<string[]>([]);
  const [nazivKviza, setNazivKviza] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [apiMessage, setApiMessage] = useState<string>("");

  const languageLevelAPIService = new LanguageLevelAPIService();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesWithLevels = await languageLevelAPIService.getLanguagesWithLevels();
        setLanguages(languagesWithLevels);
      } catch (error) {
        console.error("Greška pri dohvaćanju jezika:", error);
        setLanguages([]);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    const languageData = languages.find((lang) => lang.jezik === language);
    if (languageData) {
      setLevels(languageData.nivoi);
      setSelectedLevel("");
    } else {
      setLevels([]);
      setSelectedLevel("");
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
    setErrorMessage("");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiMessage("");

    if (!nazivKviza.trim() || !selectedLanguage || !selectedLevel) {
      setApiMessage("Molimo popunite sva obavezna polja: naziv kviza, jezik i nivo.");
      return;
    }

    if (!canCreateQuiz) {
      return;
    }

    try {
      const response = await kvizApi.kreirajKviz(nazivKviza, selectedLanguage, selectedLevel);
      if (response.success) {
        setApiMessage("Kviz uspešno kreiran!");
        setNazivKviza("");
        setSelectedLanguage("");
        setSelectedLevel("");
        setPitanja([{ pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "odgovor1" }]);
        setLevels([]);
        setErrorMessage("");
      } else {
        setApiMessage(response.message || "Došlo je do greške prilikom kreiranja kviza.");
      }
    } catch (error) {
      setApiMessage("Greška pri slanju podataka na server.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      <div className="pt-[140px] px-6">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          Kreiraj novi kviz
        </h2>

        <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#8f60bf] mb-4">Podaci o kvizu</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={nazivKviza}
                onChange={(e) => setNazivKviza(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="jezik" className="block text-gray-700 font-semibold mb-2">
                Izaberi jezik
              </label>
              <select
                id="jezik"
                name="jezik"
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="">Izaberite jezik</option>
                {languages.map((lang, index) => (
                  <option key={index} value={lang.jezik}>
                    {lang.jezik}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nivo" className="block text-gray-700 font-semibold mb-2">
                Izaberi nivo znanja
              </label>
              <select
                id="nivo"
                name="nivo"
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Izaberite nivo</option>
                {levels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {pitanja.map((pitanje, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label htmlFor={`pitanje-${index}`} className="block text-gray-700 font-semibold mb-2">
                    Pitanje {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`pitanje-${index}`}
                    name={`pitanje-${index}`}
                    placeholder="Unesite pitanje"
                    className="w-full p-2 border border-purple-300 rounded-md bg-white"
                    value={pitanje.pitanje}
                    onChange={(e) => handleQuestionChange(index, "pitanje", e.target.value)}
                  />
                </div>

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
                      onChange={(e) => handleAnswerChange(index, i, e.target.value)}
                    />
                  ))}
                </div>

                <div>
                  <label htmlFor={`tacanOdgovor-${index}`} className="block text-gray-700 font-semibold mb-2">
                    Izaberi tačan odgovor
                  </label>
                  <select
                    id={`tacanOdgovor-${index}`}
                    name={`tacanOdgovor-${index}`}
                    className="w-full p-2 border border-purple-300 rounded-md bg-white"
                    value={pitanje.tacanOdgovor}
                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
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

            {errorMessage && (
              <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
            )}

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

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-[#8f60bf] text-white px-6 py-3 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
              >
                Kreiraj kviz
              </button>
            </div>

            {apiMessage && (
              <div
                className={`mt-4 text-center text-sm ${
                  apiMessage.toLowerCase().includes("greška") || apiMessage.toLowerCase().includes("došlo")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {apiMessage}
              </div>
            )}

            {!canCreateQuiz && (
              <div className="text-red-500 text-sm mt-4">
                Potrebno je uneti najmanje 3 pitanja da biste kreirali kviz.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
