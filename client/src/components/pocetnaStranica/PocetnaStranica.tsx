import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';

function PocetnaStranica() {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<{ id: number; jezik: string; nivo: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/languages')
      .then(res => res.json())
      .then(data => {
        setLanguages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Grupisani jezici (unikatni nazivi)
  const uniqueLanguages = Array.from(new Set(languages.map(l => l.jezik)));

  // Nivoi za selektovani jezik
  const nivoiZaJezik = selectedLanguage
    ? languages.filter(l => l.jezik === selectedLanguage).map(l => l.nivo)
    : [];

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

      {/* Sekcija sa jezicima */}
      <div className="bg-white py-12 px-6">
        <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-10">Dostupni jezici za ucenje</h3>

        {loading ? (
          <p className="text-center text-gray-600">Učitavanje jezika...</p>
        ) : uniqueLanguages.length === 0 ? (
          <p className="text-center text-gray-600">Nema dostupnih jezika.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {uniqueLanguages.map((jezik, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedLanguage(jezik)}
                className="bg-[#f3e5ff] border border-purple-300 rounded-xl aspect-square flex items-center justify-center text-center shadow hover:shadow-xl hover:scale-105 transition cursor-pointer"
              >
                <h4 className="text-xl font-semibold text-[#8f60bf]">{jezik}</h4>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal za prikaz nivoa */}
      {selectedLanguage && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#f3e5ff] rounded-2xl shadow-lg p-8 w-[90%] max-w-md">
            <h3 className="text-2xl font-bold text-[#8f60bf] text-center mb-6">
              Nivoi za jezik: {selectedLanguage}
            </h3>

            <ul className="grid grid-cols-2 gap-4 text-center">
              {nivoiZaJezik.map((nivo, idx) => (
                <li
                  key={idx}
                  className="bg-white text-[#8f60bf] py-3 px-4 rounded-md border border-purple-300 shadow-sm"
                >
                  {nivo}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedLanguage(null)}
              className="mt-6 w-full py-2 bg-[#8f60bf] text-white rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PocetnaStranica;
