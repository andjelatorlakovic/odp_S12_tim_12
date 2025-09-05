import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';
import { LanguageLevelAPIService } from '../../api_services/languageLevels/LanguageLevelApiService';
import { UserQuizApiService } from '../../api_services/userQuiz/UserQuizApiService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type JezikSaNivoima = {
  jezik: string;
  nivoi: string[];
};

type UserQuizCount = {
  username: string;
  quizCount: number;
};

type FinishedLanguageLevelDto = {
  jezik: string;
  nivo: string;
  pocetakNivoa?: string;
  krajNivoa?: string;
  dani?: number;
};

function PocetnaStranica() {
  const navigate = useNavigate();
  const [jezici, setJezici] = useState<JezikSaNivoima[]>([]);
  const [userQuizCounts, setUserQuizCounts] = useState<UserQuizCount[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userLevels, setUserLevels] = useState<FinishedLanguageLevelDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiService = LanguageLevelAPIService;
  const userQuizApiService = UserQuizApiService;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken'); // Dohvatanje tokena iz localStorage
      if (!token) {
        setError('Nema tokena za autorizaciju!');
        return;
      }

      try {
        const languagesResponse = await apiService.getLanguagesWithLevels(token); // Prosleđivanje tokena funkciji
        const quizCountResponse = await userQuizApiService.dobaviBrojKvizovaPoUseru(token); // Prosleđivanje tokena funkciji

        const jeziciSaNivoima = languagesResponse.filter(lang => lang.nivoi.length > 0);
        setJezici(jeziciSaNivoima);

        const filteredUserQuizCounts = quizCountResponse.data
          .filter(user => user.quizCount > 0)
          .sort((a, b) => b.quizCount - a.quizCount)
          .slice(0, 10);

        setUserQuizCounts(filteredUserQuizCounts);
      } catch (error) {
        console.error("❌ Greška pri dohvatanju podataka:", error);
        setError('Došlo je do greške pri učitavanju podataka.');
      }
    };

    fetchData();
  }, []); // Ovdje se koristi prazan niz jer želimo da se ovo izvrši samo jednom pri učitavanju stranice

 const handlePrikaziNapredak = async (username: string) => {
  setLoading(true);
  setError(null);
  setSelectedUser(username);
  setUserLevels(null);

  try {
    const token = localStorage.getItem('authToken'); // Dobavljanje tokena iz localStorage
    if (!token) {
      setError("Token nije pronađen.");
      return;
    }

    const data = await userQuizApiService.dobaviZavrseneNivoePoKorisnickomImenu(username, token);
    setUserLevels(data);
  } catch (err) {
    setError("Greška pri dohvatanju napretka.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const sortiraniNivoi = userLevels
    ? [...userLevels].sort((a: any, b: any) => a.nivo.localeCompare(b.nivo))
    : [];

  const chartData = {
    labels: sortiraniNivoi.map((n: any) => n.nivo),
    datasets: [
      {
        label: 'Broj dana po nivou',
        data: sortiraniNivoi.map((n: any) => n.dani ?? 0),
        borderColor: '#8f60bf',
        backgroundColor: '#d9bfff',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#8f60bf",
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Nivoi znanja'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Broj dana'
        },
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ZAGLAVLJE */}
      <div className="fixed top-0 left-0 w-screen px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Hero */}
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

      {/* Jezici i Statistika */}
      <div className="bg-white py-12 px-6 mt-10 max-w-7xl mx-auto flex gap-10">
        {/* Jezici */}
        <div className="w-1/2">
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

        {/* Statistika */}
        <div className="w-1/2">
          <h3 className="text-3xl font-bold text-center text-[#8f60bf] mb-6">
            Statistika najaktivnijih korisnika
          </h3>

          {userQuizCounts.map((user, index) => (
            <div
              key={index}
              className="bg-[#f3e5ff] border-2 border-[#8f60bf] rounded-2xl p-4 shadow-md mb-4 flex justify-between items-center"
            >
              <div className="text-xl font-semibold text-[#8f60bf]">{user.username}</div>
              <div className="text-lg font-semibold text-[#8f60bf] text-center w-24">
                {user.quizCount}
              </div>
              <Link
                to={`/prikazi-napredak/${user.username}`}
                className="bg-[#8f60bf] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#8f60bf] border border-[#8f60bf] transition"
              >
                Prikaži napredak
              </Link>
            </div>
          ))}

          {/* Prikaz grafikona */}
          {selectedUser && (
            <div className="mt-10 max-w-4xl mx-auto">
              <h4 className="text-2xl font-semibold text-[#8f60bf] mb-4">
                Napredak korisnika: {selectedUser}
              </h4>

              {loading && <div className="text-gray-700">Učitavanje...</div>}
              {error && <div className="text-red-600 mb-4">{error}</div>}

              {!loading && userLevels && userLevels.length > 0 && (
                <>
                  <Line data={chartData} options={chartOptions} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PocetnaStranica;
