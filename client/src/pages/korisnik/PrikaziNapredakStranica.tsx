import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

type FinishedLanguageLevelDto = {
  jezik: string;
  nivo: string;
  pocetakNivoa?: string;
  krajNivoa?: string;
  dani?: number;
};

function PrikaziNapredakStranica() {
  const { username } = useParams<{ username: string }>();
  const [userLevels, setUserLevels] = useState<FinishedLanguageLevelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userQuizApiService = new UserQuizApiService();

  useEffect(() => {
    if (username) {
      setLoading(true);
      setError(null);
      userQuizApiService.dobaviZavrseneNivoePoKorisnickomImenu(username)
        .then(data => setUserLevels(data))
        .catch(() => setError("Greška pri dohvatanju napretka"))
        .finally(() => setLoading(false));
    }
  }, [username]);

  // Sortiranje nivoa po nazivu
  const sortiraniNivoi = userLevels
    ? [...userLevels].sort((a, b) => a.nivo.localeCompare(b.nivo))
    : [];

  const chartData = {
    labels: sortiraniNivoi.map(n => n.nivo),
    datasets: [
      {
        label: 'Broj dana po nivou',
        data: sortiraniNivoi.map(n => n.dani ?? 0),
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

  if (loading) return <div className="text-center mt-10">Učitavanje...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold text-[#8f60bf] mb-6">
        Napredak korisnika: {username}
      </h2>

      {userLevels.length === 0 ? (
        <div className="text-gray-700">Nema završenih nivoa za ovog korisnika.</div>
      ) : (
        <>
          <table className="table-auto border-collapse border border-purple-300 w-full text-left mb-6">
            <thead>
              <tr>
                <th className="border border-purple-300 px-4 py-2">Jezik</th>
                <th className="border border-purple-300 px-4 py-2">Nivo</th>
                <th className="border border-purple-300 px-4 py-2">Početak nivoa</th>
                <th className="border border-purple-300 px-4 py-2">Kraj nivoa</th>
                <th className="border border-purple-300 px-4 py-2">Broj dana</th>
              </tr>
            </thead>
            <tbody>
              {sortiraniNivoi.map((nivo, idx) => (
                <tr key={idx} className="even:bg-purple-50">
                  <td className="border border-purple-300 px-4 py-2">{nivo.jezik}</td>
                  <td className="border border-purple-300 px-4 py-2">{nivo.nivo}</td>
                  <td className="border border-purple-300 px-4 py-2">
                    {nivo.pocetakNivoa ? new Date(nivo.pocetakNivoa).toLocaleDateString() : "-"}
                  </td>
                  <td className="border border-purple-300 px-4 py-2">
                    {nivo.krajNivoa ? new Date(nivo.krajNivoa).toLocaleDateString() : "-"}
                  </td>
                  <td className="border border-purple-300 px-4 py-2">{nivo.dani ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Line data={chartData} options={chartOptions} />
        </>
      )}
    </div>
  );
}

export default PrikaziNapredakStranica;
