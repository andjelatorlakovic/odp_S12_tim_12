import { Link } from "react-router-dom";
import knjiga from "../../assets/knjiga.png";  // Dodaj sliku "knjiga" ako je koristiš

export default function NotFoundStranica() {
  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[140px] px-6">
        <div className="bg-white/30 backdrop-blur-lg border border-slate-500 shadow-xl rounded-2xl px-10 py-14 text-center max-w-lg mx-auto">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Stranica nije pronadjena</h2>
          <p className="text-gray-600 mb-6">
            Stranica koju tražite ne postoji ili je premještena.
          </p>

          <Link
            to="/"
            className="inline-block bg-[#8f60bf] text-white px-6 py-2 rounded-xl hover:bg-[#8f60bf]/90 transition"
          >
            Povratak na početnu stranicu
          </Link>
        </div>
      </div>
    </div>
  );
}
