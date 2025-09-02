import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';
import { LanguageLevelAPIService } from '../../api_services/languageLevels/LanguageLevelApiService';
import { UserQuizApiService } from '../../api_services/userQuiz/UserQuizApiService';  // Novi API servis za kvizove

type JezikSaNivoima = {
  jezik: string;
  nivoi: string[];
};

type UserQuizCount = {
  username: string;
  quizCount: number;
};

function PocetnaStranica() {
  const navigate = useNavigate();
  const [jezici, setJezici] = useState<JezikSaNivoima[]>([]);
  const [userQuizCounts, setUserQuizCounts] = useState<UserQuizCount[]>([]);
  const apiService = new LanguageLevelAPIService();
  const userQuizApiService = new UserQuizApiService();  // Kreiramo instancu UserQuizApiService

  useEffect(() => {
    const fetchLanguagesAndQuizCounts = async () => {
      try {
        // Pozivamo API za jezike sa nivoima
        const languagesResponse: JezikSaNivoima[] = await apiService.getLanguagesWithLevels();

        // Dobijamo broj kvizova po korisnicima
        const quizCountResponse = await userQuizApiService.dobaviBrojKvizovaPoUseru();

        // Filtriramo jezike koji imaju nivoe
        const jeziciSaNivoima = languagesResponse.filter(lang => lang.nivoi.length > 0);
        setJezici(jeziciSaNivoima);

        // Filtriramo korisnike koji imaju kvizove > 0, sortimo ih po broju kvizova i prikazujemo samo prvih 3
        const filteredUserQuizCounts = quizCountResponse.data
          .filter(user => user.quizCount > 0)  // Prikazujemo samo korisnike sa više od 0 kvizova
          .sort((a, b) => b.quizCount - a.quizCount)  // Sortiramo po broju kvizova u opadajućem redosledu
          .slice(0, 5);  // Prikazujemo samo prvih 3 korisnika

        setUserQuizCounts(filteredUserQuizCounts);
      } catch (error) {
        console.error("❌ Greška pri dohvatanju jezika ili broja kvizova:", error);
      }
    };

    fetchLanguagesAndQuizCounts();
  }, []);

  return (
    <>
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Hero sekcija */}
      <div className="pt-[150px] h-screen flex w-screen">
        <div className="w-1/2 flex justify-center items-start mt-5">
          <img src={panda} alt="panda" className="w-[80%] h-auto" />
        </div>

        <div className="w-1/2 flex flex-col items-center pt-[10px] px-8">
          <h2 className="text-[60px] text-[#8f60bf] font-semibold mb-8">DOBRO DOŠLI!</h2>

          <button
            className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
            onClick={() => navigate('/prijava')}
          >
            Prijava
          </button>
          <button
            className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition"
            onClick={() => navigate('/registracija')}
          >
            Registracija
          </button>
        </div>
      </div>

      {/* Sekcija sa jezicima */}
      <div className="bg-white py-12 px-6 mt-10">
        <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-6">
          Dostupni jezici i njihovi nivoi
        </h3>

        {jezici.map((lang, index) => (
          <div
            key={index}
            className="w-full bg-[#f3e5ff] border-2 border-[#8f60bf] rounded-2xl p-4 shadow-md hover:shadow-lg transition flex justify-between items-center mb-4"
          >
            <div className="text-xl font-semibold text-[#8f60bf]">{lang.jezik}</div>

            <div className="flex flex-wrap gap-2">
              {lang.nivoi.map((nivo, idx) => (
                <span
                  key={idx}
                  className="bg-[#8f60bf] text-white text-sm font-medium px-3 py-1 rounded-full"
                >
                  {nivo}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sekcija sa statistikom korisnika */}
      <div className="bg-white py-12 px-6 mt-10">
        <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-6">
          Statistika najaktivnijih korisnika
        </h3>

        {userQuizCounts.map((user, index) => (
          <div key={index} className="bg-[#f3e5ff] border-2 border-[#8f60bf] rounded-2xl p-4 shadow-md mb-4 flex justify-between items-center">
            <div className="text-xl font-semibold text-[#8f60bf]">{user.username}</div>
            <div className="text-lg font-semibold text-[#8f60bf]">{user.quizCount} kviza</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PocetnaStranica;
