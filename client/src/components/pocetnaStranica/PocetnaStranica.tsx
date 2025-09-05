import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import knjiga from '../../assets/knjiga.png';
import panda from '../../assets/panda.png';

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
import type { ILanguageLevelAPIService } from '../../api_services/languageLevels/ILanguageLevelApiService';
import type { IUserQuizApiService } from '../../api_services/userQuiz/IUserQuizApiService';

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

interface PocetnaProps {
  apiService: ILanguageLevelAPIService;
  userQuizApiService: IUserQuizApiService;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PocetnaStranica({ apiService, userQuizApiService }: PocetnaProps) {
  const navigate = useNavigate();


  const [jezici, setJezici] = useState<JezikSaNivoima[]>([]);
  const [userQuizCounts, setUserQuizCounts] = useState<UserQuizCount[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userLevels, setUserLevels] = useState<FinishedLanguageLevelDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const languagesResponse = await apiService.getLanguagesWithLevels();
        const quizCountResponse = await userQuizApiService.dobaviBrojKvizovaPoUseru();

        const jeziciSaNivoima = languagesResponse.filter(lang => lang.nivoi.length > 0);
        setJezici(jeziciSaNivoima);

        const filteredUserQuizCounts = quizCountResponse.data
          .filter(user => user.quizCount > 0)
          .sort((a, b) => b.quizCount - a.quizCount)
          .slice(0, 10);

        setUserQuizCounts(filteredUserQuizCounts);
      } catch (error) {
        console.error("❌ Greška pri dohvatanju podataka:", error);
        setError("Greška pri dohvatanju podataka");
      }
    };

    fetchData();
  }, [apiService, userQuizApiService]);

  const handlePrikaziNapredak = async (username: string) => {
    setLoading(true);
    setError(null);
    setSelectedUser(username);
    setUserLevels(null);

    try {


      const data = await userQuizApiService.dobaviZavrseneNivoePoKorisnickomImenu(username);
      setUserLevels(data);
    } catch (err) {
      setError("Greška pri dohvatanju napretka.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortiraniNivoi = userLevels
    ? [...userLevels].sort((a, b) => a.nivo.localeCompare(b.nivo))
    : [];

  const chartData = {
    labels: sortiraniNivoi.map((n) => n.nivo),
    datasets: [
      {
        label: 'Broj dana po nivou',
        data: sortiraniNivoi.map((n) => n.dani ?? 0),
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
    <>
      {/* Zaglavlje */}
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
            className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition rounded-md"
            onClick={() => navigate('/prijava')}
          >
            Prijava
          </button>

          <button
            className="mt-[30px] w-[50%] h-[10%] bg-[#8f60bf] text-white text-[20px] hover:bg-white hover:text-[#8f60bf] border-2 border-[#8f60bf] transition rounded-md"
            onClick={() => navigate('/registracija')}
          >
            Registracija
          </button>
        </div>
      </div>

      {/* Jezici i Statistika jedno pored drugog */}
      <div className="bg-white py-12 px-6 mt-10 max-w-7xl mx-auto flex gap-10">
        {/* Jezici - leva strana */}
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

        {/* Statistika - desna strana */}
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
                onClick={() => handlePrikaziNapredak(user.username)}
              >
                Prikaži napredak
              </Link>
            </div>
          ))}

          {/* Prikaz tabele i grafikona za izabranog korisnika */}
          {selectedUser && (
            <div className="mt-10 max-w-4xl mx-auto">
              <h4 className="text-2xl font-semibold text-[#8f60bf] mb-4">
                Napredak korisnika: {selectedUser}
              </h4>

              {loading && <div className="text-gray-700">Učitavanje...</div>}
              {error && <div className="text-red-600 mb-4">{error}</div>}

              {!loading && userLevels && userLevels.length === 0 && (
                <div className="text-gray-700">Nema završenih nivoa za ovog korisnika.</div>
              )}

              {!loading && userLevels && userLevels.length > 0 && (
                <>
                  <table className="table-auto border-collapse border border-purple-300 w-full text-left mb-6">
                    <thead>
                      <tr>
                        <th className="border border-purple-300 p-2">Jezik</th>
                        <th className="border border-purple-300 p-2">Nivo</th>
                        <th className="border border-purple-300 p-2">Početak nivoa</th>
                        <th className="border border-purple-300 p-2">Kraj nivoa</th>
                        <th className="border border-purple-300 p-2">Broj dana</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortiraniNivoi.map((nivo, idx) => (
                        <tr key={idx}>
                          <td className="border border-purple-300 p-2">{nivo.jezik}</td>
                          <td className="border border-purple-300 p-2">{nivo.nivo}</td>
                          <td className="border border-purple-300 p-2">{nivo.pocetakNivoa ?? '-'}</td>
                          <td className="border border-purple-300 p-2">{nivo.krajNivoa ?? '-'}</td>
                          <td className="border border-purple-300 p-2">{nivo.dani ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Line data={chartData} options={chartOptions} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PocetnaStranica;
