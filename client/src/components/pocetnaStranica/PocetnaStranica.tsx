import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';
import { LanguageLevelAPIService } from '../../api_services/languageLevels/LanguageLevelApiService';

type JezikSaNivoima = {
  jezik: string;
  nivoi: string[];
};

function PocetnaStranica() {
  const navigate = useNavigate();
  const [jezici, setJezici] = useState<JezikSaNivoima[]>([]);
  const apiService = new LanguageLevelAPIService();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response: JezikSaNivoima[] = await apiService.getLanguagesWithLevels();

        const processed = response.map(lang => ({
          jezik: lang.jezik,
          nivoi: lang.nivoi.length > 0 ? lang.nivoi : ['Nema nivoa'],
        }));

        setJezici(processed);
      } catch (error) {
        console.error("❌ Greška pri dohvatanju jezika:", error);
      }
    };

    fetchLanguages();
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

      {/* Sekcija sa jezicima – na dnu stranice */}
      <div className="bg-white py-12 px-6 mt-10 flex flex-col items-center gap-4">
        <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-6">
          Dostupni jezici i njihovi nivoi
        </h3>

        {jezici.map((lang, index) => (
          <div
            key={index}
            className="w-full lg:w-4/5 xl:w-3/4 bg-[#f3e5ff] border-2 border-[#8f60bf] rounded-2xl p-4 shadow-md hover:shadow-lg transition flex justify-between items-center"
          >
            {/* Leva strana – ime jezika */}
            <div className="text-xl font-semibold text-[#8f60bf]">{lang.jezik}</div>

            {/* Desna strana – nivoi */}
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
    </>
  );
}

export default PocetnaStranica;
