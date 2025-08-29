import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';

import { apiInstance } from '../../api_services/auth/AuthAPIService';

type LanguageWithLevel = {
  id: number;
  jezik: string;
  nivo: string;
};

function PocetnaStranica() {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<LanguageWithLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiInstance.get('/languagesWithLevels')
      .then(res => {
        const flatLanguages = res.data.flatMap((item: { jezik: string; nivoi: string[] }) =>
          item.nivoi.length > 0
            ? item.nivoi.map((nivo: string) => ({
                id: Math.random(),
                jezik: item.jezik,
                nivo,
              }))
            : [{
                id: Math.random(),
                jezik: item.jezik,
                nivo: '',
              }]
        );
        setLanguages(flatLanguages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueLanguages = Array.from(new Set(languages.map(l => l.jezik)));

  return (
    <>
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
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

      {/* Sekcija sa jezicima - BEZ dugmadi i hover efekata */}
      <div className="bg-white py-12 px-6 mt-10">
        <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-10">Dostupni jezici za učenje</h3>

        {loading ? (
          <p className="text-center text-gray-600">Učitavanje jezika...</p>
        ) : uniqueLanguages.length === 0 ? (
          <p className="text-center text-gray-600">Nema dostupnih jezika.</p>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {uniqueLanguages.map((jezik, idx) => {
              const nivoi = Array.from(
                new Set(
                  languages
                    .filter(l => l.jezik === jezik)
                    .map(l => l.nivo)
                    .filter(nivo => nivo) // ukloni prazne nivoe
                )
              ).sort();

              return (
                <div
                  key={idx}
                  className="bg-[#f3e5ff] border border-purple-300 rounded-xl flex items-center justify-between p-4 shadow-sm"
                >
                  <h4 className="text-xl font-semibold text-[#8f60bf]">{jezik}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-purple-600">
                    {nivoi.length > 0 ? (
                      nivoi.map((nivo, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-0.5 bg-white rounded border border-purple-300 shadow-sm"
                        >
                          {nivo}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-gray-500">Nema dostupnih nivoa</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default PocetnaStranica;
