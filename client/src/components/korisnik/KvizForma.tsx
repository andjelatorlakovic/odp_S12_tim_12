import knjiga from "../../assets/knjiga.png";

export function KvizForma() {
  return (
    <div className="min-h-screen bg-white">
      {/* Zaglavlje */}
      <div className="fixed top-0 left-0 w-screen box-border px-5 py-2 bg-[#f3e5ff] shadow-md flex items-center justify-center gap-2 z-20">
        <img src={knjiga} alt="knjiga" className="w-20 h-auto" />
        <h1 className="text-[60px] text-[#8f60bf] font-bold">Ucilingo</h1>
      </div>

      {/* Glavni sadržaj */}
      <div className="pt-[140px] px-6">
        <h2 className="text-4xl font-semibold text-center text-[#8f60bf] mb-10">
          Započni svoj kviz
        </h2>

        {/* Forma kviza */}
        <div className="bg-[#f3e5ff] border border-purple-300 rounded-xl shadow-md p-6 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#8f60bf] mb-6">
            Pitanja i odgovori
          </h3>

          {/* Ovde dolaze pitanja */}
          <p className="text-gray-700">
            Ova sekcija je spremna za prikaz pitanja, odgovora i slanje kviza. Dodaj svoju logiku ovde.
          </p>
        </div>
      </div>
    </div>
  );
}
