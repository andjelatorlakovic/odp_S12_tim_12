import { useState, useEffect } from "react";
import knjiga from "../../assets/knjiga.png";

import { LanguageLevelAPIService } from "../../api_services/languageLevels/LanguageLevelApiService";
import { kvizApi } from "../../api_services/quiz/QuizApiService";
import { QuestionAPIService } from "../../api_services/questions/QuestionsApiService";
import { AnswerAPIService } from "../../api_services/answers/AnswerApiService";

type Pitanje = {
  pitanje: string;
  odgovori: string[];
  tacanOdgovor: string; // npr. "odgovor1"
};

type Jezik = {
  jezik: string;
  nivoi: string[];
};

export function KreirajKvizForma() {
  const [pitanja, setPitanja] = useState<Pitanje[]>([
    { pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [apiMessage, setApiMessage] = useState<string>("");

  const [languages, setLanguages] = useState<Jezik[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [levels, setLevels] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const [nazivKviza, setNazivKviza] = useState<string>("");

  const languageLevelAPIService = new LanguageLevelAPIService();
  const questionAPIService = new QuestionAPIService();
  const answerAPIService = new AnswerAPIService();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await languageLevelAPIService.getLanguagesWithLevels();
        setLanguages(langs);
      } catch (error) {
        console.error("Greška pri dohvaćanju jezika:", error);
        setLanguages([]);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const foundLang = languages.find((l) => l.jezik === lang);
    if (foundLang) {
      setLevels(foundLang.nivoi);
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
      { pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "" },
    ]);
    setErrorMessage("");
  };

  const handleQuestionChange = (index: number, value: string) => {
    const copy = [...pitanja];
    copy[index].pitanje = value;
    setPitanja(copy);
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
    const copy = [...pitanja];
    copy[qIndex].odgovori[aIndex] = value;
    setPitanja(copy);
  };

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const copy = [...pitanja];
    copy[index].tacanOdgovor = value;
    setPitanja(copy);
  };

  // Validacija - sva polja ne smeju biti prazna i mora biti izabran tacan odgovor
  const validateQuestions = (): boolean => {
    for (let i = 0; i < pitanja.length; i++) {
      const p = pitanja[i];
      if (!p.pitanje.trim()) {
        setErrorMessage(`Pitanje ${i + 1} ne sme biti prazno.`);
        return false;
      }
      for (let j = 0; j < p.odgovori.length; j++) {
        if (!p.odgovori[j].trim()) {
          setErrorMessage(`Odgovor ${j + 1} na pitanju ${i + 1} ne sme biti prazan.`);
          return false;
        }
      }
      if (!p.tacanOdgovor) {
        setErrorMessage(`Izaberite tačan odgovor za pitanje ${i + 1}.`);
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const canCreateQuiz = pitanja.length >= 3;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiMessage("");
    setErrorMessage("");

    if (!nazivKviza.trim() || !selectedLanguage || !selectedLevel) {
      setApiMessage("Molimo popunite sva obavezna polja: naziv kviza, jezik i nivo.");
      return;
    }

    if (!canCreateQuiz) {
      setApiMessage("Potrebno je uneti najmanje 3 pitanja da biste kreirali kviz.");
      return;
    }

    if (!validateQuestions()) {
      return;
    }

    try {
      // Kreiraj kviz prvo
      const response = await kvizApi.kreirajKviz(nazivKviza, selectedLanguage, selectedLevel);

      if (!response.success || !response.data) {
        setApiMessage(response.message || "Došlo je do greške prilikom kreiranja kviza.");
        return;
      }

      const createdQuizId = response.data.id;

      // Kreiraj pitanja i njihove odgovore
      for (const pitanje of pitanja) {
        const pitanjeResponse = await questionAPIService.kreirajPitanje(createdQuizId, pitanje.pitanje);

        if (!pitanjeResponse.success || !pitanjeResponse.data) {
          setApiMessage("Greška pri kreiranju pitanja.");
          return;
        }

        const createdQuestionId = pitanjeResponse.data.id;

        for (let i = 0; i < pitanje.odgovori.length; i++) {
          const odgovorTekst = pitanje.odgovori[i];
          const tacan = pitanje.tacanOdgovor === `odgovor${i + 1}`;

          await answerAPIService.kreirajOdgovor(createdQuestionId, odgovorTekst, tacan);
        }
      }

      setApiMessage("Kviz, pitanja i odgovori uspešno kreirani!");

      // Reset forme
      setNazivKviza("");
      setSelectedLanguage("");
      setSelectedLevel("");
      setPitanja([{ pitanje: "", odgovori: ["", "", "", ""], tacanOdgovor: "" }]);
      setLevels([]);
      setErrorMessage("");
    } catch (error) {
      setApiMessage("Greška pri slanju podataka na server.");
      console.error(error);
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
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="">Izaberite jezik</option>
                {languages.map((lang, i) => (
                  <option key={i} value={lang.jezik}>
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
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                disabled={levels.length === 0}
              >
                <option value="">Izaberite nivo</option>
                {levels.map((level, i) => (
                  <option key={i} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="text-2xl font-bold text-[#8f60bf] mb-4 mt-8">Pitanja</h3>

            {pitanja.map((pitanje, index) => (
              <div key={index} className="mb-6 border border-purple-300 rounded-lg p-4 bg-white">
                <label className="block text-gray-700 font-semibold mb-2">
                  Pitanje {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="Unesite pitanje"
                  className="w-full p-2 border border-purple-300 rounded-md mb-3"
                  value={pitanje.pitanje}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                />

                <div className="space-y-2 mb-3">
                  {pitanje.odgovori.map((odgovor, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Odgovor ${i + 1}`}
                      className="w-full p-2 border border-purple-300 rounded-md"
                      value={odgovor}
                      onChange={(e) => handleAnswerChange(index, i, e.target.value)}
                    />
                  ))}
                </div>

                <label className="block text-gray-700 font-semibold mb-1">
                  Izaberi tačan odgovor
                </label>
                <select
                  className="w-full p-2 border border-purple-300 rounded-md"
                  value={pitanje.tacanOdgovor}
                  onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                >
                  <option value="">-- Izaberite tačan odgovor --</option>
                  {pitanje.odgovori.map((_, i) => (
                    <option key={i} value={`odgovor${i + 1}`}>
                      Odgovor {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {errorMessage && (
              <div className="text-red-600 font-semibold mb-3">{errorMessage}</div>
            )}

            {apiMessage && (
              <div className="text-green-700 font-semibold mb-3">{apiMessage}</div>
            )}

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
              >
                Dodaj pitanje
              </button>

              <button
                type="submit"
                disabled={!canCreateQuiz}
                className={`px-4 py-2 rounded-md text-white ${
                  canCreateQuiz
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition`}
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